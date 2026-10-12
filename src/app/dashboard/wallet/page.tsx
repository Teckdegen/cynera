import type { Metadata } from "next";
import { WalletPage } from "@/components/dashboard/pages";

export const metadata: Metadata = { title: "Wallet · Cynera" };

export default function Page() {
  return <WalletPage />;
}
