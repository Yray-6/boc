import axios from "axios";
import type {
  AdminAgentCreatePayload,
  AdminAgentDetail,
  AdminAgentListResponse,
  AdminAgentPropertySummary,
  AdminAgentUpdatePayload,
} from "@/types/admin-agent";

function normalizeAgentPropertiesBody(
  data: unknown,
): AdminAgentPropertySummary[] {
  if (Array.isArray(data)) {
    return data as AdminAgentPropertySummary[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const list = o.properties ?? o.results;
    if (Array.isArray(list)) {
      return list as AdminAgentPropertySummary[];
    }
  }
  return [];
}

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

export async function fetchAdminAgentList(
  params: Record<string, string>,
): Promise<AdminAgentListResponse> {
  const res = await api.get<AdminAgentListResponse>("/api/admin/agents", {
    params,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function createAdminAgent(
  body: AdminAgentCreatePayload,
): Promise<AdminAgentDetail> {
  const res = await api.post<AdminAgentDetail | { detail?: string }>(
    "/api/admin/agents",
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminAgentDetail;
}

export async function fetchAdminAgentDetail(id: number): Promise<AdminAgentDetail> {
  const res = await api.get<AdminAgentDetail | { detail?: string }>(
    `/api/admin/agents/${id}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminAgentDetail;
}

export async function updateAdminAgent(
  id: number,
  body: AdminAgentUpdatePayload,
): Promise<AdminAgentDetail> {
  const res = await api.put<AdminAgentDetail | { detail?: string }>(
    `/api/admin/agents/${id}`,
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminAgentDetail;
}

export async function deleteAdminAgent(id: number): Promise<void> {
  const res = await api.delete(`/api/admin/agents/${id}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}

export async function fetchAdminAgentProperties(
  id: number,
): Promise<AdminAgentPropertySummary[]> {
  const res = await api.get<unknown>(`/api/admin/agents/${id}/properties`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return normalizeAgentPropertiesBody(res.data);
}
