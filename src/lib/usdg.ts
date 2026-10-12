export const ROBINHOOD_CHAIN_ID = "0x1237";
const USDG = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";
const RPC = "https://rpc.mainnet.chain.robinhood.com";

type Ethereum = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function ethereum(): Ethereum | null {
  if (typeof window === "undefined") return null;
  const provider = (window as Window & { ethereum?: Ethereum }).ethereum;
  return provider ?? null;
}

export async function silentAccount() {
  const provider = ethereum();
  if (!provider) return "";
  const accounts = (await provider.request({ method: "eth_accounts" })) as string[];
  return accounts?.[0] || "";
}

export async function connectAccount() {
  const provider = ethereum();
  if (!provider) throw new Error("Open this page in a browser with a wallet installed");
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  await ensureRobinhood(provider);
  const address = accounts?.[0];
  if (!address) throw new Error("The wallet did not return an account");
  return address;
}

export function watchAccounts(onChange: (address: string) => void) {
  const provider = ethereum();
  if (!provider?.on) return () => {};
  const handler = (accounts: unknown) => {
    const list = Array.isArray(accounts) ? accounts.map(String) : [];
    onChange(list[0] || "");
  };
  provider.on("accountsChanged", handler);
  return () => provider.removeListener?.("accountsChanged", handler);
}

export async function readUsdg(address: string) {
  const data = `0x70a08231${address.toLowerCase().replace(/^0x/, "").padStart(64, "0")}`;
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: USDG, data }, "latest"],
    }),
  });
  const body = (await res.json()) as { result?: string; error?: { message?: string } };
  if (!res.ok || body.error) throw new Error(body.error?.message || "Could not read the USDG balance");
  return formatUsdg(BigInt(body.result || "0x0"));
}

function formatUsdg(units: bigint) {
  const scale = BigInt("1000000");
  const whole = units / scale;
  const frac = (units % scale).toString().padStart(6, "0").replace(/0+$/, "");
  return frac ? `$${whole.toString()}.${frac}` : `$${whole.toString()}`;
}

async function ensureRobinhood(provider: Ethereum) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ROBINHOOD_CHAIN_ID }] });
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (code !== 4902) throw err;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ROBINHOOD_CHAIN_ID,
          chainName: "Robinhood Chain",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: [RPC],
          blockExplorerUrls: ["https://robinhoodchain.blockscout.com"],
        },
      ],
    });
  }
}
