import type { Metadata } from "next";
import { HostPage } from "@/components/dashboard/pages";

export const metadata: Metadata = { title: "Host · Cynera" };

export default function Page() {
  return <HostPage />;
}
