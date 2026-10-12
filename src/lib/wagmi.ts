import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem";
import { http } from "wagmi";

export const robinhood = {
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "Cynera",
  appDescription: "Anyone with a spare machine can offer it. Anyone else pays that host for the hours they use.",
  appUrl: "https://cynera.cloud",
  appIcon: "https://cynera.cloud/logo.png",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cynera",
  chains: [robinhood],
  transports: {
    [robinhood.id]: http("https://rpc.mainnet.chain.robinhood.com"),
  },
  ssr: true,
});
