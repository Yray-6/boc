import { NextResponse } from "next/server";
import {
  adminDeleteAgent,
  adminGetAgent,
  adminUpdateAgent,
} from "@/server/admin-agents-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminAgentUpdatePayload } from "@/types/admin-agent";

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
    const upstream = await adminGetAgent(token, id);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ detail: "Invalid agent id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await adminUpdateAgent(
      token,
      id,
      body as AdminAgentUpdatePayload,
    );
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ detail: "Invalid agent id" }, { status: 400 });
  }

  try {
    const upstream = await adminDeleteAgent(token, id);
    const { status, data } = upstream;
    if (status === 204 || status === 205) {
      return new NextResponse(null, { status });
    }
    return NextResponse.json(
      data === "" || data === undefined ? {} : data,
      { status },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
