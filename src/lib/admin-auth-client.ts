import axios from "axios";
import type { AdminUser } from "@/types/admin-auth";

const browser = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

function formatErrorBody(body: unknown): string {
  if (!body || typeof body !== "object") {
    return "Unable to sign in. Check your credentials.";
  }
  const o = body as Record<string, unknown>;
  if (typeof o.detail === "string") return o.detail;
  if (Array.isArray(o.non_field_errors) && o.non_field_errors.length > 0) {
    const first = o.non_field_errors[0];
    if (typeof first === "string") return first;
  }
  return "Unable to sign in. Check your credentials.";
}

export async function adminLogin(
  username: string,
  password: string,
  remember: boolean,
): Promise<{ user: AdminUser }> {
  const res = await browser.post<{ user?: AdminUser } | Record<string, unknown>>(
    "/api/admin/auth/token",
    { username, password, remember },
  );

  if (res.status < 200 || res.status >= 300) {
    throw new Error(formatErrorBody(res.data));
  }

  const body = res.data;
  if (!body || typeof body !== "object" || !("user" in body)) {
    throw new Error("Unexpected response from server.");
  }

  const user = body.user;
  if (!user || typeof user !== "object") {
    throw new Error("Unexpected response from server.");
  }

  return { user: user as AdminUser };
}

export async function adminMe(): Promise<AdminUser> {
  const res = await browser.get<AdminUser | { detail?: string }>("/api/admin/auth/me");

  if (res.status < 200 || res.status >= 300) {
    const body = res.data;
    const detail =
      body &&
      typeof body === "object" &&
      typeof (body as { detail?: string }).detail === "string"
        ? (body as { detail: string }).detail
        : "Not authenticated";
    throw new Error(detail);
  }

  return res.data as AdminUser;
}
