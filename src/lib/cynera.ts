export const API = process.env.NEXT_PUBLIC_CYNERA_API || "http://127.0.0.1:8787";

export type Machine = {
  id: string;
  cpu: number;
  memoryGb: number;
  gpu?: string;
  diskGb: number;
  region: string;
  pricePerHour: string;
  walletId?: string;
};

export type Job = {
  id: string;
  done: boolean;
  status: string;
  url?: string;
  error?: string;
  billed?: string;
  payment?: { txHash?: string; error?: string };
  renterWalletId?: string;
  hostWalletId?: string;
  image?: string;
  machineLabel?: string;
  detail?: string;
  local?: boolean;
};

export type Wallet = {
  id: string;
  address: string;
  role: string;
  label: string;
  balance: string;
  held: string;
};

export type Config = {
  mode?: string;
  symbol?: string;
  chainId?: number;
};

async function readError(res: Response) {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error || `request failed (${res.status})`;
  } catch {
    return `request failed (${res.status})`;
  }
}

export async function getConfig(): Promise<Config> {
  const res = await fetch(`${API}/v1/config`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function getMachines(): Promise<Machine[]> {
  const res = await fetch(`${API}/v1/machines`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${API}/v1/jobs/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function getWallet(id: string): Promise<Wallet> {
  const res = await fetch(`${API}/v1/wallets/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createWallet(role: "renter" | "host", label: string): Promise<Wallet> {
  const res = await fetch(`${API}/v1/wallets`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ role, label }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function attachWallet(machineId: string, walletId: string): Promise<Machine> {
  const res = await fetch(`${API}/v1/machines/${encodeURIComponent(machineId)}/wallet`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ walletId }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export function toCents(amount: string) {
  const [whole, frac = ""] = String(amount).split(".");
  const padded = (frac + "00").slice(0, 2);
  return (BigInt(whole || "0") * BigInt(100) + BigInt(padded || "0")).toString();
}

export async function createJob(input: {
  image: string;
  machineId: string;
  maxHours: number;
  pricePerHour: string;
  renterWalletId: string;
}): Promise<{ id: string }> {
  const res = await fetch(`${API}/v1/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      intent: {
        image: input.image,
        machineId: input.machineId,
        maxHours: input.maxHours,
        pricePerHour: toCents(input.pricePerHour),
      },
      signature: `0x${"ab".repeat(33)}`,
      domain: { name: "Cynera" },
      renterWalletId: input.renterWalletId,
    }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function stopJob(id: string) {
  const res = await fetch(`${API}/v1/jobs/${encodeURIComponent(id)}/stop`, { method: "POST" });
  if (!res.ok) throw new Error(await readError(res));
}
