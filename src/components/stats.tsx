const steps = [
  {
    title: "List what you already own",
    body: "A CPU, a GPU, or a whole server. You set the hourly price. The machine stays in your room.",
    diagram: <PriceDiagram />,
  },
  {
    title: "Someone pays for the hours they use",
    body: "They pick a machine that is online, pay your hourly rate, and ship a service. You can see that it is running, not their code.",
    diagram: <HoursDiagram />,
  },
  {
    title: "Pay only for time in use",
    body: "The bill starts when a job is on the box and stops when it is not. Listing an idle machine costs nothing.",
    diagram: <TypesDiagram />,
  },
];

export function Stats() {
  return (
    <section id="pricing" className="mx-auto mt-24 w-full max-w-[1040px] scroll-mt-24 px-3 pb-8 sm:px-4">
      <h2 className="text-3xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-4xl">How a machine gets used</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
        Cynera sits between the person who owns the box and the person who needs it. No reserved contract.
      </p>
      <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, index) => (
          <article key={step.title}>
            <div
              className="machine-card relative h-[200px] overflow-hidden rounded-[18px] border border-white/10 bg-ash-dark"
              style={{ animationDelay: `${index * 0.35}s` }}
            >
              <div
                className="machine-dots absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.1px)",
                  backgroundSize: "14px 14px",
                  animationDelay: `${index * -1.4}s`,
                }}
              />
              {step.diagram}
            </div>
            <h3 className="mt-4 text-[15px] font-medium tracking-[-0.035em] text-white">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ash">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriceDiagram() {
  return (
    <div className="relative flex h-full flex-col">
      <div className="p-4">
        <span className="machine-drift grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black text-white">
          <ServerIcon />
        </span>
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center gap-2 px-3 pb-8">
        <Rate delay="0s">$0.06</Rate>
        <Rate delay="0.8s">$0.42</Rate>
        <Rate delay="1.6s">$1.10</Rate>
      </div>
    </div>
  );
}

function Rate({ delay, children }: { delay: string; children: string }) {
  return (
    <span className="machine-rate rounded-md px-2.5 py-1 text-[13px] font-medium tracking-[-0.03em]" style={{ animationDelay: delay }}>
      {children}
    </span>
  );
}

function HoursDiagram() {
  const bars = [46, 62, 54, 70, 100];
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black">
          <span className="machine-ping h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="text-[13px] tracking-[-0.03em] text-white/85">helix-4090</span>
      </div>
      <div className="mt-auto flex items-end justify-center gap-2.5 px-6">
        {bars.map((height, index) => {
          const live = index === bars.length - 1;
          return (
            <div key={index} className="relative z-10 flex w-7 flex-col items-center">
              {live ? (
                <span
                  className="machine-live mb-1.5 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-black"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  live
                </span>
              ) : (
                <span className="mb-1.5 h-4" />
              )}
              <div
                className={`machine-bar w-full rounded-t-[5px] ${live ? "h-24 bg-white" : "bg-ash"}`}
                style={{
                  animationDelay: `${index * 0.12}s`,
                  ...(live ? {} : { height: `${Math.round(height * 0.42)}px` }),
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypesDiagram() {
  return (
    <div className="relative h-full">
      <span className="machine-drift absolute left-[14%] top-[22%] text-white/15">
        <ChipIcon />
      </span>
      <span className="machine-drift absolute right-[16%] top-[18%] text-white/10" style={{ animationDelay: "-1.4s" }}>
        <ServerIcon />
      </span>
      <span className="machine-drift absolute bottom-[18%] left-[22%] text-white/10" style={{ animationDelay: "-2.8s" }}>
        <ServerIcon />
      </span>
      <span className="machine-drift absolute bottom-[22%] right-[18%] text-white/15" style={{ animationDelay: "-4s" }}>
        <ChipIcon />
      </span>
      <div className="machine-orbs absolute left-1/2 top-1/2 flex items-center">
        <TypeOrb delay="0s">CPU</TypeOrb>
        <TypeOrb delay="0.9s">GPU</TypeOrb>
        <TypeOrb delay="1.8s">Box</TypeOrb>
      </div>
    </div>
  );
}

function TypeOrb({ delay, children }: { delay: string; children: string }) {
  return (
    <span
      className="machine-orb -mx-3 grid h-[52px] w-[52px] place-items-center rounded-full text-[11px] font-medium tracking-[-0.03em]"
      style={{ animationDelay: delay }}
    >
      {children}
    </span>
  );
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.5" y="10" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="4" r="0.7" fill="currentColor" />
      <circle cx="5" cy="12" r="0.7" fill="currentColor" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 1.5v2.5M10 1.5v2.5M6 12v2.5M10 12v2.5M1.5 6h2.5M1.5 10h2.5M12 6h2.5M12 10h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
