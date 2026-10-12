export function Header() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-4 sm:px-6">
      <a href="#top" className="flex items-center gap-2.5">
        <img src="/logo.png" alt="" className="h-12 w-12" />
        <span className="text-[15px] font-medium tracking-[-0.035em]">Cynera</span>
      </a>
      <a
        href="/dashboard"
        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium tracking-[-0.035em] text-black transition-colors hover:bg-white/85"
      >
        Get started
      </a>
    </header>
  );
}

