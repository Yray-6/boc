import {
  upstreamGet,
  upstreamPatch,
  upstreamPostFormData,
  upstreamPut,
} from "@/server/upstream";
import type {
  AdminSiteSettings,
  AdminSiteSettingsWritePayload,
} from "@/types/admin-settings";

const BASE = "/api/v1/admin/settings";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function adminGetSiteSettings(token: string) {
  return upstreamGet<AdminSiteSettings | unknown>(`${BASE}/`, {
    headers: auth(token),
  });
}

export function adminPatchSiteSettings(
  token: string,
  body: Partial<AdminSiteSettingsWritePayload>,
) {
  return upstreamPatch<AdminSiteSettings | unknown, Partial<AdminSiteSettingsWritePayload>>(
    `${BASE}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminPutSiteSettings(token: string, body: AdminSiteSettingsWritePayload) {
  return upstreamPut<AdminSiteSettings | unknown, AdminSiteSettingsWritePayload>(
    `${BASE}/`,
    body,
    { headers: auth(token) },
  );
}

export function adminUploadSiteLogo(token: string, formData: FormData) {
  return upstreamPostFormData<AdminSiteSettings | unknown>(`${BASE}/logo/`, formData, {
    headers: auth(token),
  });
}
