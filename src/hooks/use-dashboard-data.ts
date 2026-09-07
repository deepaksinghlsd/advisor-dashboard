"use client";

import { useEffect, useState } from "react";
import type { DashboardContent } from "@/lib/types";

interface UseDashboardDataResult {
  data: DashboardContent | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<DashboardContent>;
      })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
