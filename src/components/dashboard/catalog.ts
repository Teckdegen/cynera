import type { Job, Machine, Wallet } from "@/lib/cynera";

export const floorMachines: Machine[] = [
  { id: "lisbon-4090", cpu: 8, memoryGb: 32, gpu: "RTX 4090", diskGb: 1000, region: "lisbon", pricePerHour: "0.42" },
  { id: "berlin-a6000", cpu: 16, memoryGb: 64, gpu: "RTX A6000", diskGb: 2000, region: "berlin", pricePerHour: "0.68" },
  { id: "amsterdam-h100", cpu: 32, memoryGb: 128, gpu: "H100", diskGb: 4000, region: "amsterdam", pricePerHour: "2.40" },
  { id: "london-l40s", cpu: 16, memoryGb: 64, gpu: "L40S", diskGb: 2000, region: "london", pricePerHour: "1.10" },
  { id: "paris-4080", cpu: 8, memoryGb: 32, gpu: "RTX 4080", diskGb: 1000, region: "paris", pricePerHour: "0.36" },
  { id: "newyork-3090", cpu: 8, memoryGb: 32, gpu: "RTX 3090", diskGb: 1000, region: "new york", pricePerHour: "0.28" },
];

export const floorJobs: Job[] = [
  {
    id: "job_8f3a1c",
    done: false,
    status: "running",
    image: "cynera/hello",
    machineLabel: "RTX 4090",
    url: "https://lisbon.hosts.cynera.cloud/",
    detail: "container is up on lisbon-4090",
  },
  {
    id: "job_1c02aa",
    done: true,
    status: "done",
    image: "pytorch/pytorch",
    machineLabel: "H100",
    billed: "$1.26",
    url: "https://amsterdam.hosts.cynera.cloud/",
    detail: "paid the host $1.26",
    payment: { txHash: "0x91ab" },
  },
  {
    id: "job_90ab44",
    done: true,
    status: "done",
    image: "vllm/vllm-openai",
    machineLabel: "L40S",
    billed: "$0.44",
    url: "https://london.hosts.cynera.cloud/",
    detail: "paid the host $0.44",
    payment: { txHash: "0x44c1" },
  },
];

export const floorWallet: Wallet = {
  id: "wal_cynera",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  role: "renter",
  label: "Cynera",
  balance: "$128.40",
  held: "$4.20",
};

export const floorIds = new Set(floorMachines.map((machine) => machine.id));
export const floorJobIds = new Set(floorJobs.map((job) => job.id));

export function hostName(region: string) {
  return `${region.replace(/\s+/g, "")}.hosts.cynera.cloud`;
}
