"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "@/lib/admin-dashboard-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard.summary(),
    queryFn: fetchAdminDashboard,
  });
}
