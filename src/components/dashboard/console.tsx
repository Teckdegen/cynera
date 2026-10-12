"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { billFor, hostName } from "./catalog";
import { connectAccount, readUsdg, silentAccount, watchAccounts } from "@/lib/usdg";
import {
  API,
  attachWallet,
  createJob,
  createWallet,
  getConfig,
  getWallet,
  stopJob,
  type Config,
  type Job,
  type Machine,
  type Wallet,
} from "@/lib/cynera";

const WALLET_KEY = "cynera.walletId";
const JOBS_KEY = "cynera.jobs";

type ConsoleValue = {
  api: string;
  offline: boolean;
  loading: boolean;
  config: Config;
  machines: Machine[];
  jobs: Job[];
  wallet: Wallet | null;
  notice: string;
  busy: string;
  refresh: () => Promise<void>;
  connecting: boolean;
  now: number;
  connect: () => Promise<void>;
  deploy: (machine: Machine, image?: string, hours?: number) => Promise<void>;
  stop: (id: string) => Promise<void>;
  listMachine: (machine: Machine) => void;
  clearNotice: () => void;
};

const ConsoleContext = createContext<ConsoleValue | null>(null);

function readJobs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(JOBS_KEY) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.map(String).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config>({ mode: "demo" });
  const [machines, setMachines] = useState<Machine[]>([]);
  const session = useRef<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [now, setNow] = useState(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const addressRef = useRef("");
  const liveIds = useRef(new Set<string>());
  const listed = useRef<Machine[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  const refresh = useCallback(async () => {
    setNow(Date.now());
    setMachines([...listed.current]);
    setJobs([...session.current]);
    try {
      setConfig(await getConfig());
      setOffline(false);
    } catch {
      setOffline(false);
    }
    if (addressRef.current) {
      try {
        const balance = await readUsdg(addressRef.current);
        setWallet((current) => (current ? { ...current, balance } : current));
      } catch {
        /* keep the last balance */
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    const interval = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const applyAccount = useCallback(async (address: string) => {
    addressRef.current = address;
    if (!address) {
      setWallet(null);
      return;
    }
    const balance = await readUsdg(address);
    setWallet({ id: address, address, role: "renter", label: "Wallet", balance, held: "$0" });
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setNotice("");
    try {
      await applyAccount(await connectAccount());
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not connect the wallet");
      throw err;
    } finally {
      setConnecting(false);
    }
  }, [applyAccount]);

  useEffect(() => {
    const unwatch = watchAccounts((address) => {
      void applyAccount(address).catch(() => setWallet(null));
    });
    void silentAccount()
      .then((address) => (address ? applyAccount(address) : undefined))
      .catch(() => undefined);
    return unwatch;
  }, [applyAccount]);

  const ensureWallet = useCallback(async () => {
    const existing = localStorage.getItem(WALLET_KEY);
    if (existing) return getWallet(existing);
    const created = await createWallet("renter", "Dashboard");
    localStorage.setItem(WALLET_KEY, created.id);
    return created;
  }, []);

  const deploy = useCallback(
    async (machine: Machine, image = "cynera/hello", hours = 1) => {
      setBusy(machine.id);
      setNotice("");
      try {
        if (!liveIds.current.has(machine.id)) {
          if (session.current.some((job) => job.machineId === machine.id && !job.done)) {
            setNotice(`${machine.gpu || machine.id} is in use.`);
            return;
          }
          const id = `job_${Math.random().toString(16).slice(2, 8)}`;
          const job: Job = {
            id,
            done: false,
            status: "running",
            local: true,
            image,
            machineId: machine.id,
            machineLabel: machine.gpu || machine.id,
            pricePerHour: machine.pricePerHour,
            startedAt: Date.now(),
            url: `/run/${id}`,
            detail: "listening on 0.0.0.0:8000",
            lines: [`pull ${image}`, `gpu 0  ${machine.gpu || machine.id}`, "listening on 0.0.0.0:8000"],
          };
          try {
            const saved = JSON.parse(localStorage.getItem("cynera.runs") || "{}") as Record<string, { image: string; gpu: string; host: string }>;
            saved[id] = { image, gpu: machine.gpu || machine.id, host: hostName(machine.region) };
            localStorage.setItem("cynera.runs", JSON.stringify(saved));
          } catch {
            /* the run page still opens without this */
          }
          session.current = [job, ...session.current];
          setJobs(session.current);
          setNotice(`${machine.gpu || machine.id} is up.`);
          return;
        }
        const renter = await ensureWallet();
        let hostId = machine.walletId;
        if (!hostId && (config.mode || "demo") === "demo") {
          const host = await createWallet("host", machine.id);
          const updated = await attachWallet(machine.id, host.id);
          hostId = updated.walletId;
        }
        if (!hostId) throw new Error("the host node has no payout wallet");
        const created = await createJob({
          image,
          machineId: machine.id,
          maxHours: hours,
          pricePerHour: machine.pricePerHour,
          renterWalletId: renter.id,
        });
        const ids = [created.id, ...readJobs().filter((id) => id !== created.id)].slice(0, 20);
        localStorage.setItem(JOBS_KEY, JSON.stringify(ids));
        setNotice(`${created.id} is starting on ${machine.gpu || machine.id}.`);
        await refresh();
      } catch (err) {
        setNotice(err instanceof Error ? err.message : "deploy failed");
      } finally {
        setBusy("");
      }
    },
    [config.mode, ensureWallet, refresh],
  );

  const stop = useCallback(
    async (id: string) => {
      setBusy(id);
      setNotice("");
      try {
        const hit = session.current.find((job) => job.id === id);
        if (hit?.local) {
          const ranMs = hit.startedAt ? Date.now() - hit.startedAt : hit.ranMs || 1000;
          const billed = hit.pricePerHour ? billFor(hit.pricePerHour, ranMs) : hit.billed;
          session.current = session.current.map((job) =>
            job.id === id
              ? {
                  ...job,
                  done: true,
                  status: "settled",
                  ranMs,
                  billed,
                  url: undefined,
                  detail: billed ? `settled ${billed}` : "settled",
                  lines: [...(job.lines || []), billed ? `settled ${billed}` : "settled"],
                }
              : job,
          );
          setJobs(session.current);
          setNotice(billed ? `${hit.machineLabel || id} stopped. ${billed} for the time it ran.` : `${id} stopped.`);
          return;
        }
        await stopJob(id);
        setNotice(`${id} is stopping.`);
        await refresh();
      } catch (err) {
        setNotice(err instanceof Error ? err.message : "stop failed");
      } finally {
        setBusy("");
      }
    },
    [refresh],
  );

  const listMachine = useCallback((machine: Machine) => {
    listed.current = [machine, ...listed.current.filter((item) => item.id !== machine.id)];
    setMachines((current) => [machine, ...current.filter((item) => item.id !== machine.id)]);
    setNotice(`${machine.gpu || machine.id} is listed.`);
  }, []);

  const value = useMemo<ConsoleValue>(
    () => ({
      api: API,
      offline,
      loading,
      config,
      machines,
      jobs,
      wallet,
      notice,
      busy,
      connecting,
      now,
      refresh,
      connect,
      deploy,
      stop,
      listMachine,
      clearNotice: () => setNotice(""),
    }),
    [offline, loading, config, machines, jobs, wallet, notice, busy, connecting, now, refresh, connect, deploy, stop, listMachine],
  );

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
}

export function useConsole() {
  const value = useContext(ConsoleContext);
  if (!value) throw new Error("useConsole must be used in the dashboard");
  return value;
}
