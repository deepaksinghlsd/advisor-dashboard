import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Performance · Advisor Dashboard",
};

export default function PerformancePage() {
  return (
    <ComingSoon
      title="Performance"
      description="Returns, benchmarks and attribution across clients and asset classes are on the way."
    />
  );
}
