import {
  upstreamGet,
  upstreamPut,
} from "@/server/upstream";
import type {
  AdminEnquiry,
  AdminEnquiryListResponse,
  AdminEnquiryStatusPayload,
} from "@/types/admin-enquiry";

const BASE = "/api/v1/admin/enquiries";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function adminListEnquiries(
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
  return upstreamGet<AdminEnquiryListResponse | unknown>(path, {
    headers: auth(token),
  });
}

export function adminGetEnquiry(token: string, id: number) {
  return upstreamGet<AdminEnquiry | unknown>(`${BASE}/${id}/`, {
    headers: auth(token),
  });
}

export function adminUpdateEnquiryStatus(
  token: string,
  id: number,
  body: AdminEnquiryStatusPayload,
) {
  return upstreamPut<AdminEnquiry | unknown, AdminEnquiryStatusPayload>(
    `${BASE}/${id}/`,
    body,
    { headers: auth(token) },
  );
}
