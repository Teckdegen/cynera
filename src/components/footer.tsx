export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 pb-8 pt-16 sm:px-6">
      <div className="rounded-[22px] border border-white/10 bg-ash-dark px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-12 w-12" />
            <span className="text-[17px] font-medium tracking-[-0.03em]">Cynera</span>
          </a>
          <div className="flex items-center gap-5 text-ash">
            <a href="https://x.com/cyneracloud" aria-label="X" className="transition-colors hover:text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[13px] text-ash">
          <p>Copyright 2026 Cynera</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

