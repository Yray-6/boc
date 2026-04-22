import { NextResponse } from "next/server";
import { adminCreateAgent, adminListAgents } from "@/server/admin-agents-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminAgentCreatePayload } from "@/types/admin-agent";

export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query: Record<string, string | undefined> = {};
  for (const [k, v] of searchParams.entries()) {
    query[k] = v;
  }

  try {
    const upstream = await adminListAgents(token, query);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await adminCreateAgent(
      token,
      body as AdminAgentCreatePayload,
    );
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
