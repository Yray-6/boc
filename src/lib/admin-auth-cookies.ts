export const ADMIN_ACCESS_COOKIE = "boc_admin_access";
export const ADMIN_REFRESH_COOKIE = "boc_admin_refresh";

const ACCESS_MAX_AGE_SEC = 60 * 60; // 1h fallback until backend exposes TTL
const REFRESH_MAX_AGE_REMEMBER_SEC = 60 * 60 * 24 * 30;

export function accessCookieOptions(remember: boolean) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(remember
      ? { maxAge: ACCESS_MAX_AGE_SEC }
      : {}),
  };
}

export function refreshCookieOptions(remember: boolean) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(remember ? { maxAge: REFRESH_MAX_AGE_REMEMBER_SEC } : {}),
  };
}
