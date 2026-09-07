import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Settings · Advisor Dashboard",
};

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Profile, notification preferences and alert thresholds will be configurable here."
    />
  );
}
