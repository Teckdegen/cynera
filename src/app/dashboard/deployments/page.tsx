import type { Metadata } from "next";
import { DeploymentsPage } from "@/components/dashboard/pages";

export const metadata: Metadata = { title: "Deployments · Cynera" };

export default function Page() {
  return <DeploymentsPage />;
}
