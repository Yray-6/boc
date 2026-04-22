import {
  upstreamDelete,
  upstreamGet,
  upstreamPost,
  upstreamPut,
} from "@/server/upstream";
import type {
  AdminAmenity,
  AdminAmenityWritePayload,
  AdminPropertyType,
  AdminPropertyTypeWritePayload,
} from "@/types/admin-catalog";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ── Amenities ────────────────────────────────────────────────────────────────

export function adminListAmenities(token: string) {
  return upstreamGet<AdminAmenity[] | unknown>("/api/v1/admin/amenities/", {
    headers: auth(token),
  });
}

export function adminCreateAmenity(token: string, body: AdminAmenityWritePayload) {
  return upstreamPost<AdminAmenity | unknown, AdminAmenityWritePayload>(
    "/api/v1/admin/amenities/",
    body,
    { headers: auth(token) },
  );
}

export function adminGetAmenity(token: string, id: number) {
  return upstreamGet<AdminAmenity | unknown>(`/api/v1/admin/amenities/${id}/`, {
    headers: auth(token),
  });
}

export function adminUpdateAmenity(
  token: string,
  id: number,
  body: AdminAmenityWritePayload,
) {
  return upstreamPut<AdminAmenity | unknown, AdminAmenityWritePayload>(
    `/api/v1/admin/amenities/${id}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminDeleteAmenity(token: string, id: number) {
  return upstreamDelete<unknown>(`/api/v1/admin/amenities/${id}/`, {
    headers: auth(token),
  });
}

// ── Property Types ────────────────────────────────────────────────────────────

export function adminListPropertyTypes(token: string) {
  return upstreamGet<AdminPropertyType[] | unknown>(
    "/api/v1/admin/property-types/",
    { headers: auth(token) },
  );
}

export function adminCreatePropertyType(
  token: string,
  body: AdminPropertyTypeWritePayload,
) {
  return upstreamPost<AdminPropertyType | unknown, AdminPropertyTypeWritePayload>(
    "/api/v1/admin/property-types/",
    body,
    { headers: auth(token) },
  );
}

export function adminGetPropertyType(token: string, id: number) {
  return upstreamGet<AdminPropertyType | unknown>(
    `/api/v1/admin/property-types/${id}/`,
    { headers: auth(token) },
  );
}

export function adminUpdatePropertyType(
  token: string,
  id: number,
  body: AdminPropertyTypeWritePayload,
) {
  return upstreamPut<AdminPropertyType | unknown, AdminPropertyTypeWritePayload>(
    `/api/v1/admin/property-types/${id}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminDeletePropertyType(token: string, id: number) {
  return upstreamDelete<unknown>(`/api/v1/admin/property-types/${id}/`, {
    headers: auth(token),
  });
}
