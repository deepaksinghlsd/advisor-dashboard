import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Portfolio · Advisor Dashboard",
};

export default function PortfolioPage() {
  return (
    <ComingSoon
      title="Portfolio"
      description="Holdings, allocation drift and rebalancing tools for the full book will live here."
    />
  );
}
