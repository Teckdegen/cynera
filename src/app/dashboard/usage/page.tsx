import type { Metadata } from "next";
import { UsagePage } from "@/components/dashboard/pages";

export const metadata: Metadata = { title: "Usage · Cynera" };

export default function Page() {
  return <UsagePage />;
}
