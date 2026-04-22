import { NextResponse } from "next/server";
import { getAdminAuthMe } from "@/server/admin-auth-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminUser } from "@/types/admin-auth";

function isAdminUser(body: unknown): body is AdminUser {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return typeof o.id === "number" && typeof o.username === "string";
}

export async function GET(request: Request) {
  const access = await resolveAdminAccessToken(request);

  if (!access) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  let upstream;
  try {
    upstream = await getAdminAuthMe(access);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }

  if (!upstream.ok || !isAdminUser(upstream.data)) {
    return NextResponse.json(upstream.data, { status: upstream.status });
  }

  return NextResponse.json(upstream.data, { status: 200 });
}
