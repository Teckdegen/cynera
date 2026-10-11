export function Header() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-4 sm:px-6">
      <a href="#top" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[15px] font-medium tracking-[-0.035em]">Cynera</span>
      </a>
      <a
        href="#offer"
        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium tracking-[-0.035em] text-black transition-colors hover:bg-white/85"
      >
        Get Started
      </a>
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="white" />
      <circle cx="16" cy="16" r="6.5" fill="#000" />
      <circle cx="16" cy="16" r="2.3" fill="white" />
    </svg>
  );
}
