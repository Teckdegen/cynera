const marks = ["GPUs", "CPUs", "Servers", "Memory", "NVMe", "Regions", "Inference", "Training", "Renders", "Builds", "APIs", "Previews"];

export function LogoRow() {
  return (
    <section aria-label="Hardware and jobs on Cynera" className="mx-auto mt-4 w-full max-w-[1200px] px-3 sm:px-4">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
        {marks.map((name) => (
          <div key={name} className="flex h-[72px] items-center justify-center bg-black px-3 text-[15px] tracking-[-0.03em] text-ash">
            <span className="font-medium">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
