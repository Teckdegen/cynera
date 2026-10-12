import type { Metadata } from "next";
import { LogsPage } from "@/components/dashboard/pages";

export const metadata: Metadata = { title: "Logs · Cynera" };

export default function Page() {
  return <LogsPage />;
}
