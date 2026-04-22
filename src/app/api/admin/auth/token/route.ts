import { NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/admin-auth-cookies";
import { postAdminAuthToken } from "@/server/admin-auth-api";
import type { AdminTokenResponse } from "@/types/admin-auth";

function isTokenResponse(body: unknown): body is AdminTokenResponse {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.access === "string" &&
    typeof o.refresh === "string" &&
    typeof o.user === "object" &&
    o.user !== null
  );
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  if (!json || typeof json !== "object") {
    return NextResponse.json({ detail: "Invalid body" }, { status: 400 });
  }

  const { username, password, remember } = json as {
    username?: unknown;
    password?: unknown;
    remember?: unknown;
  };

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { detail: "username and password are required" },
      { status: 400 },
    );
  }

  let upstream;
  try {
    upstream = await postAdminAuthToken(username, password);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }

  if (!upstream.ok || !isTokenResponse(upstream.data)) {
    return NextResponse.json(upstream.data, { status: upstream.status });
  }

  const { access, refresh, user } = upstream.data;
  const persist = remember === true;

  const res = NextResponse.json({ user }, { status: 200 });
  res.cookies.set(ADMIN_ACCESS_COOKIE, access, accessCookieOptions(persist));
  res.cookies.set(ADMIN_REFRESH_COOKIE, refresh, refreshCookieOptions(persist));
  return res;
}
