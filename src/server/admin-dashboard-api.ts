import { upstreamGet } from "@/server/upstream";
import type { AdminDashboardResponse } from "@/types/admin-dashboard";

export function adminGetDashboard(token: string) {
  return upstreamGet<AdminDashboardResponse | unknown>("/api/v1/admin/dashboard/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
