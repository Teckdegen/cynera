export function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1200px] px-3 sm:px-4">
      <div className="relative h-[460px] overflow-hidden rounded-[18px] border border-white/10 bg-black sm:h-[540px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1.15px)",
            backgroundSize: "16px 16px",
          }}
        />

        <img
          src="/graphics/hero-machines-crop.jpg"
          alt=""
          className="pointer-events-none absolute inset-x-3 bottom-3 h-[210px] w-[calc(100%-1.5rem)] object-contain object-bottom mix-blend-screen sm:inset-x-6 sm:bottom-4 sm:h-[280px] sm:w-[calc(100%-3rem)]"
        />

        <div className="relative z-10 flex flex-col items-center px-5 pt-10 text-center sm:px-8 sm:pt-14">
          <h1 className="w-full min-w-0 max-w-[20rem] text-balance text-[clamp(1.85rem,4.6vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white sm:max-w-none">
            Idle servers used to sit around. That&apos;s over.
          </h1>
          <p className="mx-auto mt-3 max-w-[22rem] text-pretty text-[13px] leading-relaxed text-ash sm:max-w-none sm:text-[15px]">
            Anyone with a spare machine can offer it. Anyone else pays that host for the hours they use.
          </p>
        </div>
      </div>
    </section>
  );
}
