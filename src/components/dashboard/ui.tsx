import type { ComponentProps, ReactNode } from "react";
import { Chevron } from "./icons";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white px-4">
      <div className="flex min-w-0 items-center gap-1 text-[14px] font-medium tracking-[-0.011em] text-white">
        <span className="truncate">{title}</span>
        <Chevron className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

export function PageFrame({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title={title}>{action}</TopBar>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg border border-white bg-black", className)}>{children}</div>;
}

export function PrimaryButton({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-white bg-black px-3 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextInput(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full rounded-md border border-white bg-black px-3 text-[13px] text-white outline-none placeholder:text-white focus:border-white",
        props.className,
      )}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] text-white">{label}</span>
      {children}
    </label>
  );
}

export function Meter({ label, value, ratio }: { label: string; value: string; ratio: number }) {
  const width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span className="flex min-w-0 items-center gap-2 text-white">
          <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 tabular-nums text-white">{value}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden border border-white bg-black">
        <div className="h-full rounded-full bg-white" style={{ width }} />
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-[14px] font-medium tracking-[-0.011em]">{children}</h2>;
}

export function EmptyNote({ title, body }: { title: string; body: string }) {
  return (
    <Panel className="px-4 py-8 text-center">
      <p className="text-[14px] font-medium">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-5 text-white">{body}</p>
    </Panel>
  );
}
