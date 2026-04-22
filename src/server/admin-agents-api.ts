import {
  upstreamDelete,
  upstreamGet,
  upstreamPost,
  upstreamPut,
} from "@/server/upstream";
import type {
  AdminAgentCreatePayload,
  AdminAgentDetail,
  AdminAgentListResponse,
  AdminAgentPropertySummary,
  AdminAgentUpdatePayload,
} from "@/types/admin-agent";

const BASE = "/api/v1/admin/agents";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function adminListAgents(
  token: string,
  query?: Record<string, string | undefined>,
) {
  const sp = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "") sp.set(k, v);
    }
  }
  const qs = sp.toString();
  const path = qs ? `${BASE}/?${qs}` : `${BASE}/`;
  return upstreamGet<AdminAgentListResponse>(path, { headers: auth(token) });
}

export function adminCreateAgent(token: string, body: AdminAgentCreatePayload) {
  return upstreamPost<AdminAgentDetail | unknown, AdminAgentCreatePayload>(
    `${BASE}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminGetAgent(token: string, id: number) {
  return upstreamGet<AdminAgentDetail | unknown>(`${BASE}/${id}/`, {
    headers: auth(token),
  });
}

export function adminUpdateAgent(
  token: string,
  id: number,
  body: AdminAgentUpdatePayload,
) {
  return upstreamPut<AdminAgentDetail | unknown, AdminAgentUpdatePayload>(
    `${BASE}/${id}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminDeleteAgent(token: string, id: number) {
  return upstreamDelete<unknown>(`${BASE}/${id}/`, {
    headers: auth(token),
  });
}

export function adminGetAgentProperties(token: string, id: number) {
  return upstreamGet<AdminAgentPropertySummary[] | unknown>(
    `${BASE}/${id}/properties/`,
    { headers: auth(token) },
  );
}
