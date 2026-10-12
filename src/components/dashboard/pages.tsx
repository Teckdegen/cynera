"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useConsole } from "./console";
import { PlusIcon } from "./icons";
import { EmptyNote, Field, GhostButton, Meter, PageFrame, Panel, PrimaryButton, SectionLabel, TextInput } from "./ui";

export function DeploymentsPage() {
  const { jobs, machines, deploy, stop, busy } = useConsole();
  const [image, setImage] = useState("cynera/hello");
  const [hours, setHours] = useState("1");
  const [machineId, setMachineId] = useState("");
  const selected = machines.find((machine) => machine.id === machineId) || machines[0];

  return (
    <PageFrame
      title="Deployments"
      action={
        <Link
          href="/dashboard/host"
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-white"
        >
          <PlusIcon />
          Create New
        </Link>
      }
    >
      <Panel className="grid gap-4 p-4 sm:grid-cols-[1.4fr_0.8fr_0.6fr_auto] sm:items-end">
        <Field label="Image">
          <TextInput value={image} onChange={(event) => setImage(event.target.value)} />
        </Field>
        <Field label="Machine">
          <select
            value={selected?.id || ""}
            onChange={(event) => setMachineId(event.target.value)}
            className="h-9 w-full rounded-md border border-white bg-black px-3 text-[13px] outline-none focus:border-white"
          >
            {machines.length === 0 ? <option value="">No machine online</option> : null}
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.gpu || machine.id} · {machine.region}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Max hours">
          <TextInput value={hours} onChange={(event) => setHours(event.target.value)} inputMode="decimal" />
        </Field>
        <PrimaryButton
          disabled={!selected || busy === selected.id}
          onClick={() => selected && void deploy(selected, image.trim() || "cynera/hello", Number(hours) || 1)}
        >
          {selected && busy === selected.id ? "Starting" : "Deploy"}
        </PrimaryButton>
      </Panel>

      {jobs.length === 0 ? (
        <EmptyNote title="No deployments yet" body="Pick a machine and an image. cynera/hello runs before Docker is installed." />
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="text-[12px] text-white">
              <tr className="border-b border-white">
                <th className="px-4 py-2.5 font-medium">Deployment</th>
                <th className="px-4 py-2.5 font-medium">Image</th>
                <th className="px-4 py-2.5 font-medium">Machine</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Billed</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-white last:border-0">
                  <td className="px-4 py-3 font-mono text-[12px]">{job.id}</td>
                  <td className="px-4 py-3">{job.image || "cynera/hello"}</td>
                  <td className="px-4 py-3">{job.machineLabel || "—"}</td>
                  <td className="px-4 py-3 capitalize">{job.status}</td>
                  <td className="px-4 py-3 tabular-nums">{job.billed || (job.done ? "—" : "running")}</td>
                  <td className="px-4 py-3 text-right">
                    {job.done ? (
                      <span className="text-[12px] text-white">{job.payment?.txHash ? "Paid" : job.payment?.error || ""}</span>
                    ) : (
                      <GhostButton disabled={busy === job.id} onClick={() => void stop(job.id)}>
                        {busy === job.id ? "Stopping" : "Stop"}
                      </GhostButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </PageFrame>
  );
}

export function LogsPage() {
  const { jobs } = useConsole();
  const lines = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        status: job.status,
        detail: job.detail || job.error || job.url || job.billed || "waiting",
      })),
    [jobs],
  );

  return (
    <PageFrame title="Logs">
      {lines.length === 0 ? (
        <EmptyNote title="No logs yet" body="Deployments you start from this browser show their status here." />
      ) : (
        <Panel className="divide-y divide-white font-mono text-[12px]">
          {lines.map((line) => (
            <div key={line.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[180px_90px_1fr] sm:gap-4">
              <span className="truncate text-white">{line.id}</span>
              <span className="capitalize text-white">{line.status}</span>
              <span className="truncate text-white">{line.detail}</span>
            </div>
          ))}
        </Panel>
      )}
    </PageFrame>
  );
}

export function UsagePage() {
  const { machines, jobs, wallet } = useConsole();
  const running = jobs.filter((job) => !job.done).length;
  return (
    <PageFrame title="Usage">
      <SectionLabel>Last 30 days</SectionLabel>
      <Panel>
        <div className="flex items-center justify-between px-4 pt-4">
          <p className="text-[14px] font-medium">Spare compute</p>
          <Link
            href="/dashboard/wallet"
            className="inline-flex h-7 items-center rounded-md bg-white px-2.5 text-[12px] font-medium text-black hover:bg-white"
          >
            Wallet
          </Link>
        </div>
        <Meter label="Active hours" value="18h 24m / 40h" ratio={18.4 / 40} />
        <Meter label="Machines online" value={String(machines.length)} ratio={machines.length ? 1 : 0} />
        <Meter label="Jobs running" value={jobs.length ? `${running} / ${jobs.length}` : "0"} ratio={jobs.length ? running / jobs.length : 0} />
        <Meter label="Jobs finished" value={String(jobs.filter((job) => job.done).length)} ratio={jobs.length ? jobs.filter((job) => job.done).length / jobs.length : 0} />
        <Meter label="Wallet" value={wallet?.balance || "$128.40"} ratio={0.64} />
        <div className="h-2" />
      </Panel>
      <Panel className="px-4 py-4 text-[13px] leading-6 text-white">
        Hours are billed when a deployment stops. The price is the one on the machine listing. Unused time stays in the wallet.
      </Panel>
    </PageFrame>
  );
}

export function WalletPage() {
  const { wallet, ensureWallet, busy, refresh } = useConsole();
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function create() {
    setWorking(true);
    setError("");
    try {
      await ensureWallet();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not create a wallet");
    } finally {
      setWorking(false);
    }
  }

  async function copy() {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <PageFrame
      title="Wallet"
      action={
        wallet ? (
          <GhostButton onClick={() => void refresh()}>Refresh</GhostButton>
        ) : (
          <PrimaryButton disabled={working || Boolean(busy)} onClick={() => void create()}>
            {working ? "Creating" : "Create wallet"}
          </PrimaryButton>
        )
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <p className="text-[13px] text-white">Balance</p>
          <p className="mt-2 text-[32px] font-medium tracking-[-0.04em] tabular-nums">{wallet?.balance || "$0"}</p>
          <p className="mt-2 text-[13px] text-white">Held {wallet?.held || "$0"}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-[13px] text-white">USDG address</p>
          <p className="mt-3 break-all font-mono text-[13px] leading-6">{wallet?.address || "No wallet yet"}</p>
          {wallet ? (
            <GhostButton className="mt-4" onClick={() => void copy()}>
              {copied ? "Copied" : "Copy address"}
            </GhostButton>
          ) : null}
        </Panel>
      </div>
      {error ? <p className="text-[13px] text-white">{error}</p> : null}
      <Panel className="px-5 py-4 text-[13px] leading-6 text-white">
        This wallet pays the host in USDG when a deployment stops. Fund it on Robinhood Chain. What you do not use stays here.
      </Panel>
    </PageFrame>
  );
}

export function HostPage() {
  const { listMachine } = useConsole();
  const [gpu, setGpu] = useState("RTX 4090");
  const [cpu, setCpu] = useState("8");
  const [memory, setMemory] = useState("32");
  const [disk, setDisk] = useState("1000");
  const [region, setRegion] = useState("lisbon");
  const [price, setPrice] = useState("0.42");
  const [payout, setPayout] = useState("");

  function list() {
    const name = region.trim().toLowerCase().replace(/\s+/g, "") || "lisbon";
    const chip = (gpu.trim() || "machine").toLowerCase().replace(/[^a-z0-9]+/g, "");
    listMachine({
      id: `${name}-${chip || "machine"}`,
      cpu: Number(cpu) || 8,
      memoryGb: Number(memory) || 32,
      diskGb: Number(disk) || 1000,
      gpu: gpu.trim() || undefined,
      region: region.trim() || "lisbon",
      pricePerHour: price || "0.42",
      walletId: payout.trim() || undefined,
    });
  }

  return (
    <PageFrame
      title="Host"
      action={<PrimaryButton onClick={list}>List machine</PrimaryButton>}
    >
      <p className="max-w-2xl text-[13px] leading-6 text-white">
        The machine stays yours. Listing it costs nothing.
      </p>
      <Panel className="grid gap-4 p-4 sm:grid-cols-2">
        <Field label="GPU">
          <TextInput value={gpu} onChange={(event) => setGpu(event.target.value)} />
        </Field>
        <Field label="Region">
          <TextInput value={region} onChange={(event) => setRegion(event.target.value)} />
        </Field>
        <Field label="CPU">
          <TextInput value={cpu} onChange={(event) => setCpu(event.target.value)} />
        </Field>
        <Field label="Memory GB">
          <TextInput value={memory} onChange={(event) => setMemory(event.target.value)} />
        </Field>
        <Field label="Disk GB">
          <TextInput value={disk} onChange={(event) => setDisk(event.target.value)} />
        </Field>
        <Field label="Price per hour">
          <TextInput value={price} onChange={(event) => setPrice(event.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Payout address">
            <TextInput value={payout} onChange={(event) => setPayout(event.target.value)} placeholder="0x payout address" />
          </Field>
        </div>
      </Panel>
    </PageFrame>
  );
}
