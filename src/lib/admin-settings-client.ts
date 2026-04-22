import axios from "axios";
import type {
  AdminSiteSettings,
  AdminSiteSettingsWritePayload,
} from "@/types/admin-settings";

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

export async function fetchAdminSiteSettings(): Promise<AdminSiteSettings> {
  const res = await api.get<AdminSiteSettings | { detail?: string }>(
    "/api/admin/settings",
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminSiteSettings;
}

export async function patchAdminSiteSettings(
  body: Partial<AdminSiteSettingsWritePayload>,
): Promise<AdminSiteSettings> {
  const res = await api.patch<AdminSiteSettings | { detail?: string }>(
    "/api/admin/settings",
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminSiteSettings;
}

export async function uploadAdminSiteLogo(file: File): Promise<AdminSiteSettings> {
  const fd = new FormData();
  fd.append("logo", file);
  const res = await axios.post<AdminSiteSettings | { detail?: string }>(
    "/api/admin/settings/logo",
    fd,
    {
      withCredentials: true,
      validateStatus: () => true,
    },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminSiteSettings;
}
