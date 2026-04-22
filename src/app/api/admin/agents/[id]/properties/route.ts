import { NextResponse } from "next/server";
import { adminGetAgentProperties } from "@/server/admin-agents-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

type RouteParams = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

export async function GET(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ detail: "Invalid agent id" }, { status: 400 });
  }

  try {
    const upstream = await adminGetAgentProperties(token, id);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
