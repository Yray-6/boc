import axios from "axios";
import type {
  AdminAmenity,
  AdminAmenityWritePayload,
  AdminPropertyType,
  AdminPropertyTypeWritePayload,
} from "@/types/admin-catalog";

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

// ── Amenities ────────────────────────────────────────────────────────────────

export async function fetchAdminAmenities(): Promise<AdminAmenity[]> {
  const res = await api.get<AdminAmenity[]>("/api/admin/amenities");
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function createAdminAmenity(
  body: AdminAmenityWritePayload,
): Promise<AdminAmenity> {
  const res = await api.post<AdminAmenity>("/api/admin/amenities", body);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function updateAdminAmenity(
  id: number,
  body: AdminAmenityWritePayload,
): Promise<AdminAmenity> {
  const res = await api.put<AdminAmenity>(`/api/admin/amenities/${id}`, body);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function deleteAdminAmenity(id: number): Promise<void> {
  const res = await api.delete(`/api/admin/amenities/${id}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}

// ── Property Types ────────────────────────────────────────────────────────────

export async function fetchAdminPropertyTypes(): Promise<AdminPropertyType[]> {
  const res = await api.get<AdminPropertyType[]>("/api/admin/property-types");
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function createAdminPropertyType(
  body: AdminPropertyTypeWritePayload,
): Promise<AdminPropertyType> {
  const res = await api.post<AdminPropertyType>(
    "/api/admin/property-types",
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function updateAdminPropertyType(
  id: number,
  body: AdminPropertyTypeWritePayload,
): Promise<AdminPropertyType> {
  const res = await api.put<AdminPropertyType>(
    `/api/admin/property-types/${id}`,
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function deleteAdminPropertyType(id: number): Promise<void> {
  const res = await api.delete(`/api/admin/property-types/${id}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}
