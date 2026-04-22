import axios from "axios";
import type { AdminDashboardResponse } from "@/types/admin-dashboard";

const api = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

function detailFromUnknown(data: unknown): string {
  if (data && typeof data === "object" && "detail" in data) {
    const d = (data as { detail: unknown }).detail;
    if (typeof d === "string") return d;
  }
  return "Request failed";
}

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  const res = await api.get<AdminDashboardResponse | { detail?: string }>(
    "/api/admin/dashboard",
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminDashboardResponse;
}
