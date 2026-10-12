import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Shell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Dashboard · Cynera",
  description: "List a spare machine or deploy on one that is already online.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
