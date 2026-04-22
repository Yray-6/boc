import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "@/lib/admin-auth-cookies";

export function bearerFromRequest(request: Request): string | null {
  const h = request.headers.get("authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m?.[1] ?? null;
}

export async function resolveAdminAccessToken(
  request: Request,
): Promise<string | null> {
  const fromHeader = bearerFromRequest(request);
  if (fromHeader) return fromHeader;
  const jar = await cookies();
  return jar.get(ADMIN_ACCESS_COOKIE)?.value ?? null;
}
