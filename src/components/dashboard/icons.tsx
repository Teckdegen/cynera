type IconProps = { className?: string };

const base = "h-4 w-4 shrink-0";

export function Mark({ className = "h-5 w-5" }: IconProps) {
  return <img src="/logo.png" alt="" className={className} />;
}

export function Chevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className || "h-3.5 w-3.5"} fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className={`${base} text-white`} fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.25" y="2.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.25" y="9.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.25" y="9.25" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function BoxesIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <path d="M2.5 5.5L8 3l5.5 2.5L8 8 2.5 5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2.5 5.5V11L8 13.5 13.5 11V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 8v5.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function LogsIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <path d="M2.5 13.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4 13.5V8M8 13.5V3.5M12 13.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function WalletIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.25" cy="9.75" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function ServerIcon() {
  return (
    <svg viewBox="0 0 16 16" className={base} fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.5" y="9.5" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="4.5" r="0.6" fill="currentColor" />
      <circle cx="5" cy="11.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M6 3.5H3.5v9h9V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 3.5H12.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 3.5L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M3 4.5h10M3 8h10M3 11.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M8 2.5a3.5 3.5 0 0 0-3.5 3.5c0 2.2-.6 3.2-1.2 3.8h9.4c-.6-.6-1.2-1.6-1.2-3.8A3.5 3.5 0 0 0 8 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.6 12.2a1.4 1.4 0 0 0 2.8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function DotsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="12.5" cy="8" r="1" />
    </svg>
  );
}
