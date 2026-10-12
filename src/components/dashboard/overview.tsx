"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useConsole } from "./console";
import { ExternalIcon, ListIcon, Mark, PlusIcon } from "./icons";
import { hostName, usedLabel } from "./catalog";
import { GhostButton, Meter, Panel, SectionLabel, TopBar, cn } from "./ui";
import type { Machine } from "@/lib/cynera";

export function Overview() {
  const { machines, jobs, wallet, deploy, busy, now } = useConsole();
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const running = jobs.filter((job) => !job.done).length;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return machines;
    return machines.filter((machine) =>
      [machine.id, machine.gpu, machine.region, machine.pricePerHour].join(" ").toLowerCase().includes(needle),
    );
  }, [machines, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (typing || event.key !== "/") return;
      event.preventDefault();
      document.getElementById("machine-search")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const machineRatio = machines.length === 0 ? 0 : 1;
  const jobRatio = jobs.length === 0 ? 0 : running / jobs.length;
  const hours = usedLabel(jobs, now);
  const taken = new Set(jobs.filter((job) => !job.done && job.machineId).map((job) => job.machineId as string));

  return (
    <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col border-white xl:border-r">
        <TopBar title="All machines">
          <Link
            href="/dashboard/host"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-2.5 text-[13px] font-medium text-black hover:bg-white xl:hidden"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Create New</span>
          </Link>
        </TopBar>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mb-6 flex items-center gap-2">
            <label className="relative min-w-0 flex-1">
              <input
                id="machine-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search machines"
                className="h-10 w-full rounded-md border border-white bg-black pl-3 pr-10 text-[13px] outline-none placeholder:text-white focus:border-white"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-white px-1.5 text-[11px] text-white">
                /
              </kbd>
            </label>
            <div className="flex h-10 shrink-0 overflow-hidden rounded-md border border-white">
              <button
                aria-label="List"
                onClick={() => setLayout("list")}
                className={cn("flex w-9 items-center justify-center", layout === "list" ? "bg-white text-black" : "text-white")}
              >
                <ListIcon />
              </button>
              <button
                aria-label="Grid"
                onClick={() => setLayout("grid")}
                className={cn(
                  "flex w-9 items-center justify-center border-l border-white",
                  layout === "grid" ? "bg-white text-black" : "text-white",
                )}
              >
                <span className="grid grid-cols-2 gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                </span>
              </button>
            </div>
          </div>

          <SectionLabel>Usage</SectionLabel>
          <Panel className="mb-8">
            <div className="flex items-center justify-between px-4 pt-4 pb-1">
              <p className="text-[14px] font-medium">Last 30 days</p>
              <Link
                href="/dashboard/wallet"
                className="inline-flex h-7 items-center rounded-md bg-white px-2.5 text-[12px] font-medium text-black hover:bg-white"
              >
                Wallet
              </Link>
            </div>
            <Meter label="Hours running" value={hours.label} ratio={hours.ratio} />
            <Meter label="Machines online" value={String(machines.length)} ratio={machineRatio} />
            <Meter label="Jobs running" value={jobs.length ? `${running} / ${jobs.length}` : "0"} ratio={jobRatio} />
            <Meter label="USDG" value={wallet?.balance || "$0"} ratio={wallet && wallet.balance !== "$0" ? 1 : 0} />
            <div className="h-2" />
          </Panel>

          <SectionLabel>Billing</SectionLabel>
          <Panel className="mb-6">
            <div className="flex flex-col items-center px-6 py-8 text-center">
              <p className="text-[15px] font-medium tracking-[-0.011em]">Pay the host for the hours you use</p>
              <p className="mt-2 max-w-full text-[13px] leading-5 text-balance text-white">
                When a deployment stops, the renter wallet pays that host for the seconds it ran. Listing a machine costs nothing.
              </p>
              <Link
                href="/dashboard/wallet"
                className="mt-5 inline-flex h-8 items-center rounded-md border border-white px-3 text-[13px] hover:bg-white hover:text-black"
              >
                Open wallet
              </Link>
            </div>
          </Panel>

          <div className="xl:hidden">
            <SectionLabel>Machines</SectionLabel>
            <MachineList
              machines={filtered}
              layout={layout}
              busy={busy}
              taken={taken}
              onDeploy={(machine) => void deploy(machine)}
            />
          </div>
        </div>
      </section>

      <section className="hidden min-h-0 w-[min(440px,42%)] shrink-0 flex-col xl:flex">
        <TopBar title="Overview">
          <Link
            href="/dashboard/host"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-white"
          >
            <PlusIcon />
            Create New
          </Link>
          <Link
            href="/dashboard/deployments"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white px-3 text-[13px] font-medium hover:bg-white hover:text-black"
          >
            Deploy
          </Link>
        </TopBar>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <SectionLabel>Machines</SectionLabel>
          <MachineList
            machines={filtered}
            layout={layout}
            busy={busy}
            taken={taken}
            onDeploy={(machine) => void deploy(machine)}
          />
        </div>
      </section>
    </div>
  );
}

function MachineList({
  machines,
  layout,
  busy,
  taken,
  onDeploy,
}: {
  machines: Machine[];
  layout: "grid" | "list";
  busy: string;
  taken: Set<string>;
  onDeploy: (machine: Machine) => void;
}) {
  if (machines.length === 0) {
    return (
      <Panel className="p-4">
        <div className="flex items-center gap-2.5">
          <Mark className="h-8 w-8" />
          <p className="text-[14px] font-medium">No machines online</p>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-white">List a spare machine from Host. The hardware stays with you.</p>
        <p className="mt-1 text-[13px] leading-5 text-white">Renters pay you for the hours they use.</p>
      </Panel>
    );
  }

  if (layout === "list") {
    return (
      <Panel className="overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="text-[12px] text-white">
            <tr className="border-b border-white">
              <th className="px-3 py-2 font-medium">Machine</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">Specs</th>
              <th className="px-3 py-2 font-medium">Price</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine.id} className="border-b border-white last:border-0">
                <td className="px-3 py-3">
                  <div className="font-medium">{machine.gpu || machine.id}</div>
                  <div className="font-mono text-[12px] text-white">{machine.id}</div>
                </td>
                <td className="px-3 py-3 text-white">{machine.region}</td>
                <td className="px-3 py-3 text-white">
                  {machine.cpu} vCPU · {machine.memoryGb} GB · {machine.diskGb} GB
                </td>
                <td className="px-3 py-3 tabular-nums">${machine.pricePerHour}/hr</td>
                <td className="px-3 py-3 text-right">
                  {taken.has(machine.id) ? (
                    <span className="text-[12px]">In use</span>
                  ) : (
                    <GhostButton disabled={busy === machine.id} onClick={() => onDeploy(machine)}>
                      {busy === machine.id ? "Starting" : "Deploy"}
                    </GhostButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {machines.map((machine) => (
        <Panel key={machine.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Mark className="h-8 w-8" />
              <p className="truncate text-[14px] font-medium">{machine.gpu || machine.id}</p>
              {taken.has(machine.id) ? <span className="text-[12px]">In use</span> : null}
            </div>
            <button
              aria-label={`Deploy on ${machine.id}`}
              title="Deploy cynera/hello"
              disabled={busy === machine.id || taken.has(machine.id)}
              onClick={() => onDeploy(machine)}
              className="text-white hover:text-white disabled:opacity-40"
            >
              <ExternalIcon />
            </button>
          </div>
          <p className="mt-3 text-[13px] text-white">{hostName(machine.region)}</p>
          <p className="mt-1 text-[13px] leading-5 text-white">
            {machine.cpu} vCPU · {machine.memoryGb} GB memory · {machine.diskGb} GB disk
          </p>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-white">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-medium text-black">C</span>
            <span className="truncate font-mono">{machine.id}</span>
            <span>·</span>
            <span className="shrink-0 tabular-nums">${machine.pricePerHour}/hr</span>
          </div>
        </Panel>
      ))}
    </div>
  );
}
