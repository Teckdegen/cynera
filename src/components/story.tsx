export function Story() {
  return (
    <div className="mx-auto w-full max-w-[1040px] px-3 sm:px-4">
      <section id="offer" className="relative mt-20 scroll-mt-24 pl-8 sm:pl-12">
        <Rail />
        <h2 className="max-w-[16ch] text-4xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl">
          List a machine without the ceremony
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ash">
          Point Cynera at a server you already own. It gets a name, a price, and a place in the catalog. No new rack, no reserved contract.{" "}
          <a href="#hosts" className="text-white/80 underline decoration-white/30 underline-offset-4">
            Learn more
          </a>
        </p>

        <CanvasMock />

        <FeatureTrio
          items={[
            ["See the metal", "A map of every machine you offer, and what is actually running on it."],
            ["You set the price", "Hourly rates stay yours. Cynera only takes a cut when a job is running."],
            ["Unplug anytime", "Take a node offline and new work stops. The hardware never leaves your room."],
          ]}
        />
        <InsteadOf items={["a closet server", "a reserved instance", "a colo cage"]} />
      </section>

      <section id="deploy" className="relative mt-24 scroll-mt-24 grid gap-10 pl-8 sm:grid-cols-[1.1fr_0.9fr] sm:pl-12">
        <Rail />
        <div>
          <h2 className="text-4xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl">
            Deploy onto someone else&apos;s spare box
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ash">
            Pick a live host and ship a service. You get a URL. They keep the machine.{" "}
            <a href="#marketplace" className="text-white/80 underline decoration-white/30 underline-offset-4">
              Learn more
            </a>
          </p>
          <ul className="mt-8 space-y-5 text-sm text-white/70">
            <Li>Private by default, public when you ask. No VPC homework.</Li>
            <Li>The host can see usage, not your source.</Li>
          </ul>
        </div>
        <ServiceStack />
      </section>

      <section id="hosts" className="relative mt-24 scroll-mt-24 grid gap-10 pl-8 sm:grid-cols-[1.1fr_0.9fr] sm:pl-12">
        <Rail />
        <div>
          <h2 className="text-4xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl">
            Grow the pool without a datacenter
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ash">
            One idle GPU tonight, a rack later. Cynera schedules work onto whatever you leave online.{" "}
            <a href="#pricing" className="text-white/80 underline decoration-white/30 underline-offset-4">
              Learn more
            </a>
          </p>
          <ul className="mt-8 space-y-5 text-sm text-white/70">
            <Li>CPU shares for APIs. GPU hours for models and renders.</Li>
            <Li>Jobs follow the regions hosts actually live in.</Li>
          </ul>
        </div>
        <HostMock />
      </section>

      <section id="usage" className="relative mt-24 scroll-mt-24 pl-8 sm:pl-12">
        <Rail />
        <h2 className="max-w-[18ch] text-4xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl">
          Logs and load, from the hour you rent
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ash">
          See CPU, GPU, and egress for the machine you are on. Hosts see the same charts for their own metal.{" "}
          <a href="#usage" className="text-white/80 underline decoration-white/30 underline-offset-4">
            Learn more
          </a>
        </p>
        <MetricsMock />
        <FeatureTrio
          items={[
            ["One board", "Usage for every service you placed on community hardware."],
            ["Alerts you set", "Ping when a host drops, or when a GPU saturates."],
            ["Logs in place", "Read the stream without opening another tool."],
          ]}
        />
      </section>

      <section id="network" className="relative mt-24 scroll-mt-24 pl-8 sm:pl-12">
        <Rail />
        <h2 className="max-w-[16ch] text-4xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl">
          Production here. A spare box for the branch.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ash">
          Keep the stable service on a host you trust. Spin the next change on idle capacity, then throw that environment away.
        </p>
        <div className="mt-8 grid gap-4 rounded-2xl border border-white/15 bg-ash-dark p-3 sm:grid-cols-2 sm:p-4">
          <EnvWindow title="production" accent={false} />
          <EnvWindow title="preview" accent />
        </div>
        <FeatureTrio
          items={[
            ["Hosts stay in control", "Each environment is a job on a machine someone chose to offer."],
            ["Previews are cheap", "They run on idle hours, not on a second cloud account."],
            ["Tear down in one click", "The spare box goes back to the catalog."],
          ]}
        />
      </section>
    </div>
  );
}

function Rail() {
  return <span className="absolute bottom-0 left-[7px] top-1 w-px bg-white/15 sm:left-[11px]" />;
}

function FeatureTrio({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
      {items.map(([title, body]) => (
        <div key={title}>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ash">{body}</p>
        </div>
      ))}
    </div>
  );
}

function InsteadOf({ items }: { items: string[] }) {
  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-white/35">
      <span>Instead of</span>
      {items.map((item) => (
        <span key={item} className="text-ash">
          {item}
        </span>
      ))}
    </p>
  );
}

function Li({ children }: { children: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
      <span>{children}</span>
    </li>
  );
}

function Dots() {
  return (
    <div
      className="machine-dots pointer-events-none absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.1px)",
        backgroundSize: "14px 14px",
      }}
    />
  );
}

const archPaths = {
  toRelay: "M 200 292 C 230 270, 255 230, 278 200",
  toHost: "M 430 190 C 446 168, 452 148, 462 132",
  toUrl: "M 692 108 C 730 88, 770 68, 792 56",
};

function CanvasMock() {
  return (
    <div id="marketplace" className="relative mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-white/15 bg-ash-dark">
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-3 py-2 text-[12px] text-ash">
        <span className="text-white/80">helix-4090 / listed</span>
        <span className="hidden gap-4 sm:flex">
          <span className="text-white">Architecture</span>
          <span>Usage</span>
          <span>Settings</span>
        </span>
      </div>
      <div className="relative h-[440px] sm:h-[460px]">
        <Dots />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#141414_100%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 420" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <ArchWire d={archPaths.toRelay} delay="0s" />
          <ArchWire d={archPaths.toHost} delay="-0.8s" />
          <ArchWire d={archPaths.toUrl} delay="-1.6s" />
          <ArchPacket d={archPaths.toRelay} dur="2.4s" />
          <ArchPacket d={archPaths.toHost} dur="2.4s" begin="0.7s" />
          <ArchPacket d={archPaths.toUrl} dur="2.4s" begin="1.4s" />
        </svg>

        <div className="absolute left-[4%] top-[62%] z-10">
          <div className="sketch-pop rounded-xl border border-white/20 bg-black px-3 py-2.5">
            <p className="text-[12px] text-white/85">api · building</p>
            <p className="mt-1 text-[10px] text-ash">cynera/hello · 1 hour max</p>
          </div>
        </div>

        <div className="absolute left-[28%] top-[40%] z-10 hidden sm:block">
          <div className="sketch-float rounded-xl border border-white/15 bg-black px-3 py-2.5" style={{ animationDelay: "-0.8s" }}>
            <p className="flex items-center gap-2 text-[12px] text-white/85">
              <span className="machine-ping h-1.5 w-1.5 rounded-full bg-white" />
              relay
            </p>
            <p className="mt-1 text-[10px] text-ash">outbound tunnel</p>
          </div>
        </div>

        <div className="absolute left-[46%] top-[16%] z-10">
          <div className="machine-card relative w-[180px] rounded-xl border border-white/20 bg-black p-3 sm:w-[220px]">
            <div className="flex items-center gap-2 text-sm">
              <span className="machine-ping h-2 w-2 rounded-full bg-white" />
              gpu-01 <span className="text-white/35">[Host]</span>
            </div>
            <p className="mt-2 text-[11px] text-ash">RTX 4090 · 24 GB · Lisbon</p>
            <p className="mt-1 text-[12px] text-white">$0.42/hr</p>
            <div className="mt-3 flex h-6 items-end gap-1">
              {[40, 65, 48, 80, 58, 92, 70].map((height, index) => (
                <span
                  key={index}
                  className="machine-bar flex-1 rounded-sm bg-white/80"
                  style={{ height: `${height}%`, animationDelay: `${index * 0.12}s` }}
                />
              ))}
            </div>
            <div className="arch-cycle relative mt-2 h-4 text-[10px] text-ash">
              <span>heartbeat</span>
              <span>tunnel open</span>
              <span>billing the hour</span>
            </div>
          </div>
        </div>

        <div className="absolute right-[4%] top-[8%] z-10">
          <div className="sketch-float rounded-xl border border-white/20 bg-black px-3 py-2.5" style={{ animationDelay: "-1.8s" }}>
            <p className="flex items-center gap-2 text-[12px] text-white">
              <span className="machine-ping h-1.5 w-1.5 rounded-full bg-white" style={{ animationDelay: "-0.4s" }} />
              live
            </p>
            <p className="mt-1 text-[10px] text-ash">lisbon.hosts.cynera.app</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchWire({ d, delay }: { d: string; delay: string }) {
  return (
    <>
      <path d={d} stroke="rgba(255,255,255,0.22)" strokeWidth="1.6" />
      <path d={d} stroke="white" strokeWidth="2.4" strokeLinecap="round" pathLength="100" className="sketch-comet" style={{ animationDelay: delay }} />
    </>
  );
}

function ArchPacket({ d, dur, begin }: { d: string; dur: string; begin?: string }) {
  return (
    <>
      <circle r="7" fill="white" opacity="0.18">
        <animateMotion dur={dur} begin={begin || "0s"} repeatCount="indefinite" path={d} />
      </circle>
      <circle r="2.6" fill="white">
        <animateMotion dur={dur} begin={begin || "0s"} repeatCount="indefinite" path={d} />
      </circle>
    </>
  );
}

function ServiceStack() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-ash-dark p-3">
      <Dots />
      <div className="relative z-10">
        <ServiceCard name="helix-4090" url="lisbon.hosts.cynera.app" detail="GPU · 24 GB · $0.42/hr" delay="0s" />
        <div className="mx-4 my-2 flex items-center gap-2 text-[11px] text-white/70">
          <span className="sketch-tag rounded-full border border-white/20 px-2 py-0.5">public</span>
          <span className="text-white/30">TLS on</span>
        </div>
        <ServiceCard name="attic-node" url="berlin.hosts.cynera.app" detail="8 vCPU · 32 GB · $0.06/hr" delay="-1.3s" />
      </div>
    </div>
  );
}

function ServiceCard({ name, url, detail, delay }: { name: string; url: string; detail: string; delay: string }) {
  return (
    <div className="sketch-float relative overflow-hidden rounded-xl border border-white/15 bg-black/85 p-4" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white">
          <BoxIcon />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">{name}</p>
          <p className="truncate text-[11px] text-ash">{url}</p>
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="sketch-sweep h-full w-1/3 rounded-full bg-white" style={{ animationDelay: delay }} />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-white/80">
        <span className="machine-ping h-1.5 w-1.5 rounded-full bg-white" /> Online
      </p>
      <p className="mt-1 text-[11px] text-white/35">{detail}</p>
    </div>
  );
}

function HostMock() {
  const hours = [18, 28, 22, 36, 30, 48, 70];
  return (
    <div className="relative h-[240px] overflow-hidden rounded-2xl border border-white/15 bg-ash-dark">
      <Dots />
      <div className="relative z-10 flex h-full flex-col p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-black text-white/80">
            <BoxIcon />
          </span>
          <div>
            <p className="text-sm font-medium">attic-node</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
              <span className="machine-ping h-1.5 w-1.5 rounded-full bg-white" /> Online · Berlin
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ash">8 vCPU · 32 GB · $0.06/hr</p>
        <div className="mt-auto flex items-end gap-2">
          {hours.map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center">
              {index === hours.length - 1 ? (
                <span className="machine-live mb-1.5 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-black" style={{ animationDelay: "0.7s" }}>
                  idle
                </span>
              ) : (
                <span className="mb-1.5 h-4" />
              )}
              <div
                className={`machine-bar w-full rounded-t-[4px] ${index === hours.length - 1 ? "h-16 bg-white" : "bg-ash"}`}
                style={{ animationDelay: `${index * 0.1}s`, ...(index === hours.length - 1 ? {} : { height: `${height}px` }) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricsMock() {
  const logs = [
    { time: "18:14", source: "api", message: "host north-gpu heartbeat delayed 8s", delay: "0s" },
    { time: "18:14", source: "api", message: "retry scheduled on the same machine", delay: "1.2s" },
    { time: "18:16", source: "worker", message: "job resumed · gpu 61%", delay: "2.4s" },
  ];
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/15 bg-ash-dark">
      <Dots />
      <div className="relative z-10">
        <div className="border-b border-white/10 px-4 py-2 text-[12px] text-ash">north-gpu / production · last 6 hours</div>
        <div className="px-3 py-3">
          <p className="px-1 text-[11px] text-ash">Recent logs</p>
          <div className="mt-2 space-y-1 font-mono text-[10px] text-ash">
            {logs.map((log) => (
              <Log key={log.message} {...log} />
            ))}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Chart title="CPU" color="#ffffff" delay="0s" points={[8, 9, 12, 11, 18, 16, 14, 22, 20, 17]} />
            <Chart title="GPU" color="#9a9a9a" delay="0.4s" points={[20, 22, 21, 28, 40, 55, 62, 58, 60, 64]} />
            <Chart title="Egress" color="#6e6e6e" delay="0.8s" points={[4, 6, 5, 9, 8, 14, 12, 18, 16, 15]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Log({ time, source, message, delay }: { time: string; source: string; message: string; delay: string }) {
  return (
    <div className="sketch-log grid grid-cols-[52px_64px_1fr] gap-2 rounded px-2 py-1" style={{ animationDelay: delay }}>
      <span>{time}</span>
      <span>{source}</span>
      <span className="truncate">{message}</span>
    </div>
  );
}

function Chart({ title, color, points, delay }: { title: string; color: string; points: number[]; delay: string }) {
  const d = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 36 - value * 0.45;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border border-white/10 bg-black p-2">
      <p className="text-[11px] text-ash">{title}</p>
      <svg viewBox="0 0 100 40" className="mt-1 h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke={color} strokeWidth="1.6" pathLength="100" className="sketch-line" style={{ animationDelay: delay }} />
      </svg>
    </div>
  );
}

function EnvWindow({ title, accent }: { title: string; accent: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-black ${accent ? "border-white/40" : "border-white/15"}`}>
      {accent ? <span className="sketch-ring" /> : null}
      <Dots />
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-3 py-2 text-[12px] text-ash">
        <span>{title}</span>
        {accent ? <span className="machine-ping h-2.5 w-2.5 rounded-full bg-white" /> : <span className="h-2.5 w-2.5 rounded-full border border-white/30" />}
      </div>
      <div className="relative z-10 flex h-36 items-center justify-center gap-3">
        <span className="rounded-md border border-white/20 bg-black px-3 py-2 text-[12px] text-white/80">api</span>
        {accent ? <span className="sketch-pop rounded-md bg-white px-3 py-2 text-[12px] font-medium text-black">worker</span> : null}
      </div>
    </div>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2.5" y="3" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.5" y="9" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
