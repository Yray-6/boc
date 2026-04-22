import {
  upstreamDelete,
  upstreamGet,
  upstreamPost,
  upstreamPostFormData,
  upstreamPut,
} from "@/server/upstream";
import type {
  AdminPropertyDetail,
  AdminPropertyListResponse,
  AdminPropertyWritePayload,
  AdminPropertyImage,
} from "@/types/admin-property";

const BASE = "/api/v1/admin/properties";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function enc(s: string) {
  return encodeURIComponent(s);
}

export function adminGetPropertyFormData(token: string) {
  return upstreamGet<unknown>(`${BASE}/form-data/`, {
    headers: auth(token),
  });
}

export function adminListProperties(
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
  return upstreamGet<AdminPropertyListResponse>(path, { headers: auth(token) });
}

export function adminCreateProperty(token: string, body: AdminPropertyWritePayload) {
  return upstreamPost<AdminPropertyDetail | unknown, AdminPropertyWritePayload>(
    `${BASE}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminGetProperty(token: string, slug: string) {
  return upstreamGet<AdminPropertyDetail | unknown>(`${BASE}/${enc(slug)}/`, {
    headers: auth(token),
  });
}

export function adminUpdateProperty(
  token: string,
  slug: string,
  body: AdminPropertyWritePayload,
) {
  return upstreamPut<AdminPropertyDetail | unknown, AdminPropertyWritePayload>(
    `${BASE}/${enc(slug)}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminDeleteProperty(token: string, slug: string) {
  return upstreamDelete<unknown>(`${BASE}/${enc(slug)}/`, {
    headers: auth(token),
  });
}

export function adminExportPropertiesCsv(token: string) {
  return upstreamGet<ArrayBuffer>(`${BASE}/export/csv/`, {
    headers: auth(token),
    responseType: "arraybuffer",
  });
}

export function adminUploadPropertyImages(token: string, slug: string, formData: FormData) {
  return upstreamPostFormData<AdminPropertyImage[] | unknown>(
    `${BASE}/${enc(slug)}/images/`,
    formData,
    { headers: auth(token) },
  );
}

export function adminGetPropertyImage(token: string, slug: string, imageId: number) {
  return upstreamGet<AdminPropertyImage | unknown>(
    `${BASE}/${enc(slug)}/images/${imageId}/`,
    { headers: auth(token) },
  );
}

export function adminDeletePropertyImage(
  token: string,
  slug: string,
  imageId: number,
) {
  return upstreamDelete<unknown>(`${BASE}/${enc(slug)}/images/${imageId}/`, {
    headers: auth(token),
  });
}
