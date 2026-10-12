"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ConsoleProvider, useConsole } from "./console";
import {
  BellIcon,
  BoxesIcon,
  ChartIcon,
  Chevron,
  DotsIcon,
  GridIcon,
  LogsIcon,
  Mark,
  MenuIcon,
  SearchIcon,
  ServerIcon,
  WalletIcon,
} from "./icons";
import { cn } from "./ui";

const NAV = [
  { href: "/dashboard", label: "Machines", icon: GridIcon, exact: true },
  { href: "/dashboard/deployments", label: "Deployments", icon: BoxesIcon },
  { href: "/dashboard/logs", label: "Logs", icon: LogsIcon },
  { href: "/dashboard/usage", label: "Usage", icon: ChartIcon },
  { href: "/dashboard/wallet", label: "Wallet", icon: WalletIcon },
  { href: "/dashboard/host", label: "Host", icon: ServerIcon },
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ConsoleProvider>
      <ShellFrame>{children}</ShellFrame>
    </ConsoleProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { wallet, notice, clearNotice, connect, connecting } = useConsole();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const items = NAV.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        document.getElementById("dash-find")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="dash flex h-dvh overflow-hidden bg-black text-white">
      {open ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 flex-col border-r border-white bg-black transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 items-center gap-2 px-3">
          <Mark className="h-8 w-8" />
          <span className="text-[14px] font-medium tracking-[-0.015em]">Cynera</span>
          <Chevron className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="px-3 pb-3">
          <label className="flex h-8 items-center gap-2 rounded-md border border-white bg-black px-2">
            <SearchIcon />
            <input
              id="dash-find"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-white"
            />
            <kbd className="rounded border border-white px-1 text-[10px] text-white">F</kbd>
          </label>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-md px-2 text-[14px] tracking-[-0.011em]",
                  active ? "bg-white text-black" : "text-white hover:bg-white hover:text-black",
                )}
              >
                <Icon />
                <span className="truncate">{item.label}</span>
                {item.href === "/dashboard/wallet" && wallet ? (
                  <span className="ml-auto truncate text-[12px]">{wallet.balance}</span>
                ) : null}
              </Link>
            );
          })}
          {items.length === 0 ? <p className="px-2 py-2 text-[13px] text-white">No matches</p> : null}
        </nav>
        <div className="mt-auto flex h-12 items-center gap-2 border-t border-white px-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-medium text-black">C</span>
          <Link href="/dashboard/wallet" className="min-w-0 flex-1 truncate text-[13px] text-white hover:text-white">
            {wallet ? shortAddress(wallet.address) : "Connect"}
          </Link>
          <Link href="/dashboard/logs" aria-label="Logs" className="text-white hover:text-white">
            <BellIcon />
          </Link>
          <Link href="/dashboard/host" aria-label="Host" className="text-white hover:text-white">
            <DotsIcon />
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-3 border-b border-white px-3 lg:hidden">
          <button aria-label="Open menu" className="text-white" onClick={() => setOpen(true)}>
            <MenuIcon />
          </button>
          <span className="text-[14px] font-medium">Cynera</span>
        </div>
        {wallet ? (
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        ) : (
          <ConnectPanel connect={connect} connecting={connecting} />
        )}
      </div>
      {notice ? (
        <button
          onClick={clearNotice}
          className="fixed bottom-4 left-1/2 z-50 max-w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 rounded-md border border-white bg-black px-3 py-2 text-left text-[13px] text-white shadow-lg"
        >
          {notice}
        </button>
      ) : null}
    </div>
  );
}

function ConnectPanel({ connect, connecting }: { connect: () => Promise<void>; connecting: boolean }) {
  const [error, setError] = useState("");
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-white bg-black px-6 py-10 text-center">
        <p className="text-[22px] font-medium tracking-[-0.04em]">Connect a wallet</p>
        <p className="mt-3 text-[14px] leading-6">
          Use the wallet that holds your USDG on Robinhood Chain. Cynera reads that balance.
        </p>
        <button
          className="mt-6 inline-flex h-10 items-center rounded-md bg-white px-4 text-[14px] font-medium text-black disabled:cursor-not-allowed"
          disabled={connecting}
          onClick={() => {
            setError("");
            void connect().catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not connect"));
          }}
        >
          {connecting ? "Connecting" : "Connect wallet"}
        </button>
        {error ? <p className="mt-4 text-[13px]">{error}</p> : null}
      </div>
    </div>
  );
}

function shortAddress(address: string) {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
