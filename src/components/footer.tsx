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
            <a href="#top" aria-label="X" className="transition-colors hover:text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#top" aria-label="Telegram" className="transition-colors hover:text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                <path d="M21.5 4.3 18.7 19c-.2.9-.8 1.1-1.6.7l-4.4-3.3-2.1 2c-.2.3-.4.5-.9.5l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.6 13.1 3.2 11.7c-.9-.3-.9-.9.2-1.4L20.2 3.2c.8-.3 1.5.2 1.3 1.1z" />
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

