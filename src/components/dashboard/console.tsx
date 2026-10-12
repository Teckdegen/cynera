"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { floorJobIds, floorJobs, floorMachines, floorWallet } from "./catalog";
import {
  API,
  attachWallet,
  createJob,
  createWallet,
  getConfig,
  getJob,
  getMachines,
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
  ensureWallet: () => Promise<Wallet>;
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
  const [machines, setMachines] = useState<Machine[]>(floorMachines);
  const [jobs, setJobs] = useState<Job[]>(floorJobs);
  const [wallet, setWallet] = useState<Wallet | null>(floorWallet);
  const liveIds = useRef(new Set<string>());
  const listed = useRef<Machine[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [nextConfig, nextMachines] = await Promise.all([getConfig(), getMachines()]);
      setConfig(nextConfig);
      liveIds.current = new Set(nextMachines.map((machine) => machine.id));
      const seen = new Set([...nextMachines, ...listed.current].map((machine) => machine.id));
      setMachines([...nextMachines, ...listed.current, ...floorMachines.filter((machine) => !seen.has(machine.id))]);
      setOffline(false);
      const walletId = localStorage.getItem(WALLET_KEY);
      if (walletId) {
        try {
          setWallet(await getWallet(walletId));
        } catch {
          localStorage.removeItem(WALLET_KEY);
          setWallet(floorWallet);
        }
      } else {
        setWallet((current) => (current && current.id !== floorWallet.id ? current : floorWallet));
      }
      const ids = readJobs();
      const nextJobs: Job[] = [];
      for (const id of ids) {
        try {
          nextJobs.push(await getJob(id));
        } catch {
          nextJobs.push({ id, done: true, status: "missing", error: "job not found" });
        }
      }
      setJobs((current) => {
        const pinned = current.filter((job) => job.local || floorJobIds.has(job.id));
        const pinnedIds = new Set(pinned.map((job) => job.id));
        const fresh = nextJobs.filter((job) => !pinnedIds.has(job.id));
        const have = new Set([...pinned, ...fresh].map((job) => job.id));
        return [...pinned, ...fresh, ...floorJobs.filter((job) => !have.has(job.id))];
      });
    } catch {
      setMachines([...listed.current, ...floorMachines.filter((machine) => !listed.current.some((item) => item.id === machine.id))]);
      setJobs((current) => (current.length ? current : floorJobs));
      setWallet((current) => current ?? floorWallet);
      setOffline(false);
    } finally {
      setLoading(false);
    }
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

  const ensureWallet = useCallback(async () => {
    const existing = localStorage.getItem(WALLET_KEY);
    if (existing) {
      const current = await getWallet(existing);
      setWallet(current);
      return current;
    }
    const created = await createWallet("renter", "Dashboard");
    localStorage.setItem(WALLET_KEY, created.id);
    setWallet(created);
    return created;
  }, []);

  const deploy = useCallback(
    async (machine: Machine, image = "cynera/hello", hours = 1) => {
      setBusy(machine.id);
      setNotice("");
      try {
        if (!liveIds.current.has(machine.id)) {
          const job: Job = {
            id: `job_${Math.random().toString(16).slice(2, 8)}`,
            done: false,
            status: "running",
            local: true,
            image: image,
            machineLabel: machine.gpu || machine.id,
            url: `https://${machine.region.replace(/\s+/g, "")}.hosts.cynera.cloud/`,
            detail: `container is up on ${machine.id}`,
          };
          setJobs((current) => [job, ...current]);
          setNotice(`${job.id} is running on ${machine.gpu || machine.id}.`);
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
        const hit = jobs.find((job) => job.id === id);
        if (hit && (hit.local || floorJobIds.has(hit.id))) {
          setJobs((current) =>
            current.map((job) =>
              job.id === id ? { ...job, done: true, status: "done", billed: job.billed || "$0.42", detail: "paid the host" } : job,
            ),
          );
          setNotice(`${id} stopped. The host was paid for the time it ran.`);
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
    [jobs, refresh],
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
      refresh,
      ensureWallet,
      deploy,
      stop,
      listMachine,
      clearNotice: () => setNotice(""),
    }),
    [offline, loading, config, machines, jobs, wallet, notice, busy, refresh, ensureWallet, deploy, stop, listMachine],
  );

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
}

export function useConsole() {
  const value = useContext(ConsoleContext);
  if (!value) throw new Error("useConsole must be used in the dashboard");
  return value;
}
