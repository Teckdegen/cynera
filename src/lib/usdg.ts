export const ROBINHOOD_CHAIN_ID = "0x1237";
const USDG = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";
const RPC = "https://rpc.mainnet.chain.robinhood.com";

type Ethereum = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  providers?: Ethereum[];
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
  isOkxWallet?: boolean;
  isPhantom?: boolean;
};

export type WalletChoice = {
  name: string;
  icon: string;
  rdns: string;
  provider: Ethereum;
};

const WALLET_RDNS = "cynera.walletRdns";
const found = new Map<string, WalletChoice>();
const walletListeners = new Set<(wallets: WalletChoice[]) => void>();
const accountListeners = new Set<(address: string) => void>();
let listening = false;
let active: Ethereum | null = null;
let bound: Ethereum | null = null;

function ethereum(): Ethereum | null {
  if (typeof window === "undefined") return null;
  const provider = (window as Window & { ethereum?: Ethereum }).ethereum;
  return provider ?? null;
}

function walletName(provider: Ethereum) {
  if (provider.isRabby) return "Rabby";
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider.isOkxWallet) return "OKX Wallet";
  if (provider.isBraveWallet) return "Brave Wallet";
  if (provider.isPhantom) return "Phantom";
  if (provider.isMetaMask) return "MetaMask";
  return "Browser wallet";
}

function remember(choice: WalletChoice) {
  found.set(choice.rdns, choice);
  walletListeners.forEach((listener) => listener(listWallets()));
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem(WALLET_RDNS) : "";
  if (saved === choice.rdns && !active) {
    void restore(choice.provider);
  }
}

async function restore(provider: Ethereum) {
  active = provider;
  bind(provider);
  const accounts = (await provider.request({ method: "eth_accounts" })) as string[];
  const address = accounts?.[0] || "";
  if (address) accountListeners.forEach((listener) => listener(address));
}

export function listenForWallets() {
  if (typeof window === "undefined" || listening) return;
  listening = true;
  window.addEventListener("eip6963:announceProvider", (event) => {
    const detail = (event as CustomEvent<{ info?: { name?: string; icon?: string; rdns?: string }; provider?: Ethereum }>).detail;
    const rdns = detail?.info?.rdns;
    if (!rdns || !detail.provider) return;
    remember({
      name: detail.info?.name || "Wallet",
      icon: detail.info?.icon || "",
      rdns,
      provider: detail.provider,
    });
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

export function listWallets() {
  if (found.size > 0) return [...found.values()];
  const injected = ethereum();
  if (!injected) return [];
  const providers = injected.providers?.length ? injected.providers : [injected];
  return providers.map((provider, index) => ({
    name: walletName(provider),
    icon: "",
    rdns: `injected.${walletName(provider).toLowerCase().replace(/\s+/g, "")}.${index}`,
    provider,
  }));
}

export function watchWallets(onChange: (wallets: WalletChoice[]) => void) {
  listenForWallets();
  walletListeners.add(onChange);
  onChange(listWallets());
  return () => {
    walletListeners.delete(onChange);
  };
}

function bind(provider: Ethereum | null) {
  if (bound?.removeListener) bound.removeListener("accountsChanged", onAccounts);
  bound = provider;
  provider?.on?.("accountsChanged", onAccounts);
}

function onAccounts(accounts: unknown) {
  const list = Array.isArray(accounts) ? accounts.map(String) : [];
  const address = list[0] || "";
  accountListeners.forEach((listener) => listener(address));
}

export async function silentAccount() {
  listenForWallets();
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem(WALLET_RDNS) : "";
  const provider = (saved && found.get(saved)?.provider) || active || ethereum();
  if (!provider) return "";
  active = provider;
  bind(provider);
  const accounts = (await provider.request({ method: "eth_accounts" })) as string[];
  return accounts?.[0] || "";
}

export async function connectAccount(provider?: Ethereum) {
  const chosen = provider || active || ethereum();
  if (!chosen) throw new Error("No wallet found in this browser");
  active = chosen;
  const match = [...found.values()].find((wallet) => wallet.provider === chosen);
  if (match) localStorage.setItem(WALLET_RDNS, match.rdns);
  const accounts = (await chosen.request({ method: "eth_requestAccounts" })) as string[];
  await ensureRobinhood(chosen);
  bind(chosen);
  const address = accounts?.[0];
  if (!address) throw new Error("The wallet did not return an account");
  return address;
}

export function watchAccounts(onChange: (address: string) => void) {
  listenForWallets();
  accountListeners.add(onChange);
  bind(active || ethereum());
  return () => {
    accountListeners.delete(onChange);
  };
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
