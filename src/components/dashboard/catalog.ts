import type { Job, Machine } from "@/lib/cynera";

export const floorMachines: Machine[] = [
  { id: "lisbon-4090", cpu: 8, memoryGb: 32, gpu: "RTX 4090", diskGb: 1000, region: "lisbon", pricePerHour: "0.42" },
  { id: "berlin-a6000", cpu: 16, memoryGb: 64, gpu: "RTX A6000", diskGb: 2000, region: "berlin", pricePerHour: "0.68" },
  { id: "amsterdam-h100", cpu: 32, memoryGb: 128, gpu: "H100", diskGb: 4000, region: "amsterdam", pricePerHour: "2.40" },
  { id: "london-l40s", cpu: 16, memoryGb: 64, gpu: "L40S", diskGb: 2000, region: "london", pricePerHour: "1.10" },
  { id: "paris-4080", cpu: 8, memoryGb: 32, gpu: "RTX 4080", diskGb: 1000, region: "paris", pricePerHour: "0.36" },
  { id: "newyork-3090", cpu: 8, memoryGb: 32, gpu: "RTX 3090", diskGb: 1000, region: "new york", pricePerHour: "0.28" },
  { id: "tokyo-a100", cpu: 24, memoryGb: 80, gpu: "A100", diskGb: 2000, region: "tokyo", pricePerHour: "1.85" },
  { id: "singapore-l4", cpu: 8, memoryGb: 32, gpu: "L4", diskGb: 1000, region: "singapore", pricePerHour: "0.31" },
  { id: "sydney-4080", cpu: 12, memoryGb: 48, gpu: "RTX 4080", diskGb: 2000, region: "sydney", pricePerHour: "0.48" },
];

export function hostName(region: string) {
  return `${region.replace(/\s+/g, "")}.hosts.cynera.cloud`;
}

export function marketJobs(now: number): Job[] {
  const runningFor = 26 * 60 * 1000;
  const ranMs = Math.round(3.8 * 60 * 60 * 1000);
  const settled = billFor("1.10", ranMs);
  return [
    {
      id: "job_7c21aa",
      done: false,
      status: "running",
      local: true,
      image: "vllm/vllm-openai",
      machineId: "amsterdam-h100",
      machineLabel: "H100",
      pricePerHour: "2.40",
      startedAt: now - runningFor,
      url: "/run/job_7c21aa",
      detail: "accepting requests",
      lines: [
        "pull vllm/vllm-openai",
        "gpu 0  NVIDIA H100 80GB",
        "listening on 0.0.0.0:8000",
        "health ok",
      ],
    },
    {
      id: "job_19e044",
      done: true,
      status: "settled",
      local: true,
      image: "pytorch/pytorch",
      machineId: "london-l40s",
      machineLabel: "L40S",
      pricePerHour: "1.10",
      startedAt: now - 5 * 60 * 60 * 1000,
      ranMs,
      billed: settled,
      detail: `settled ${settled}`,
      lines: ["pull pytorch/pytorch", "epoch 12/12  loss 0.041", "checkpoint written", `settled ${settled}`],
    },
  ];
}

export function billFor(pricePerHour: string, ms: number) {
  const [whole, frac = ""] = String(pricePerHour).split(".");
  const perHour = BigInt(whole || "0") * BigInt("1000000") + BigInt((frac + "000000").slice(0, 6) || "0");
  const seconds = BigInt(Math.max(1, Math.floor(ms / 1000)));
  const micros = (perHour * seconds) / BigInt(3600);
  const scale = BigInt("1000000");
  const dollars = micros / scale;
  const rest = (micros % scale).toString().padStart(6, "0").replace(/0+$/, "");
  return rest ? `$${dollars.toString()}.${rest}` : `$${dollars.toString()}`;
}

export function usedLabel(jobs: Job[], now: number) {
  const ms = jobs.reduce((sum, job) => {
    if (!job.startedAt) return sum;
    if (job.done) return sum + (job.ranMs || 0);
    return sum + Math.max(0, now - job.startedAt);
  }, 0);
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return {
    label: hours ? `${hours}h ${remain}m` : `${remain}m`,
    ratio: Math.min(1, ms / (24 * 60 * 60 * 1000)),
  };
}
