"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { TodaysBriefCard } from "@/components/dashboard/todays-brief";
import { AttentionSection } from "@/components/dashboard/attention-section";
import { HeartbeatBar } from "@/components/dashboard/heartbeat-bar";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  return (
    <div className="flex min-h-screen w-full bg-[#f4f1ea]">
      <Sidebar />
      <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </p>
          )}

          {isLoading || !data ? (
            <div className="flex flex-col gap-5">
              <div className="h-16 w-full animate-pulse rounded-xl bg-black/5" />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
                <div className="h-64 animate-pulse rounded-2xl bg-black/5" />
                <div className="h-64 animate-pulse rounded-2xl bg-black/5" />
              </div>
              <div className="h-[500px] animate-pulse rounded-2xl bg-black/5" />
            </div>
          ) : (
            <>
              <DashboardHeader user={data.user} date={data.date} stats={data.stats} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
                <TodaysBriefCard
                  brief={data.todaysBrief}
                  clientFirstNames={data.clientsNeedingAttention.cards.map(
                    (c) => c.name.split(" ")[0]
                  )}
                />
                <AttentionSection data={data.clientsNeedingAttention} />
              </div>

              <HeartbeatBar data={data.rmHeartbeat} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
