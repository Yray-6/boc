import { upstreamGet, upstreamPost } from "@/server/upstream";
import type { AdminTokenResponse, AdminUser } from "@/types/admin-auth";

export function postAdminAuthToken(username: string, password: string) {
  return upstreamPost<AdminTokenResponse | unknown>("/api/v1/admin/auth/token/", {
    username,
    password,
  });
}

export function getAdminAuthMe(accessToken: string) {
  return upstreamGet<AdminUser | unknown>("/api/v1/admin/auth/me/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
