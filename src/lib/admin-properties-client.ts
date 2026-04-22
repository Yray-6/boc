import axios from "axios";
import {
  normalizePropertyFormData,
  type NormalizedPropertyFormData,
} from "@/lib/property-form-dropdowns";
import type {
  AdminPropertyDetail,
  AdminPropertyListResponse,
  AdminPropertyWritePayload,
  AdminPropertyImage,
} from "@/types/admin-property";

const api = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export async function fetchPropertyFormData(): Promise<NormalizedPropertyFormData> {
  const res = await api.get<unknown>("/api/admin/properties/form-data");
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return normalizePropertyFormData(res.data);
}

function detailFromUnknown(data: unknown): string {
  if (data && typeof data === "object" && "detail" in data) {
    const d = (data as { detail: unknown }).detail;
    if (typeof d === "string") return d;
  }
  return "Request failed";
}

export async function fetchAdminPropertyList(
  params: Record<string, string>,
): Promise<AdminPropertyListResponse> {
  const res = await api.get<AdminPropertyListResponse>("/api/admin/properties", {
    params,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function createAdminProperty(
  body: AdminPropertyWritePayload,
): Promise<AdminPropertyDetail> {
  const res = await api.post<AdminPropertyDetail | { detail?: string }>(
    "/api/admin/properties",
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

export async function fetchAdminPropertyDetail(
  slug: string,
): Promise<AdminPropertyDetail> {
  const res = await api.get<AdminPropertyDetail | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

export async function updateAdminProperty(
  slug: string,
  body: AdminPropertyWritePayload,
): Promise<AdminPropertyDetail> {
  const res = await api.put<AdminPropertyDetail | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}`,
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

export async function deleteAdminProperty(slug: string): Promise<void> {
  const res = await api.delete(`/api/admin/properties/${encodeURIComponent(slug)}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}

export async function downloadAdminPropertiesCsv(): Promise<void> {
  const res = await fetch("/api/admin/properties/export/csv", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    let msg = "Export failed";
    try {
      const j = (await res.json()) as { detail?: string };
      if (typeof j.detail === "string") msg = j.detail;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "properties.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadAdminPropertyImages(
  slug: string,
  files: File[],
  fieldName = "images",
): Promise<AdminPropertyImage[]> {
  const fd = new FormData();
  for (const f of files) {
    fd.append(fieldName, f);
  }
  const res = await axios.post<AdminPropertyImage[] | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}/images`,
    fd,
    {
      withCredentials: true,
      validateStatus: () => true,
    },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyImage[];
}

export async function fetchAdminPropertyImage(
  slug: string,
  imageId: number,
): Promise<AdminPropertyImage> {
  const res = await api.get<AdminPropertyImage | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}/images/${imageId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyImage;
}

export async function deleteAdminPropertyImage(
  slug: string,
  imageId: number,
): Promise<void> {
  const res = await api.delete(
    `/api/admin/properties/${encodeURIComponent(slug)}/images/${imageId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}
