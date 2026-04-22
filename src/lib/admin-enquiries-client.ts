import axios from "axios";
import type {
  AdminEnquiry,
  AdminEnquiryListResponse,
  AdminEnquiryStatusPayload,
} from "@/types/admin-enquiry";

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

export async function fetchAdminEnquiries(
  params: Record<string, string>,
): Promise<AdminEnquiryListResponse> {
  const res = await api.get<AdminEnquiryListResponse>("/api/admin/enquiries", {
    params,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function fetchAdminEnquiry(id: number): Promise<AdminEnquiry> {
  const res = await api.get<AdminEnquiry>(`/api/admin/enquiries/${id}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function updateAdminEnquiryStatus(
  id: number,
  body: AdminEnquiryStatusPayload,
): Promise<{ status: string }> {
  const res = await api.put<{ status: string }>(
    `/api/admin/enquiries/${id}`,
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}
