import { NextResponse } from "next/server";
import {
  adminDeleteProperty,
  adminGetProperty,
  adminUpdateProperty,
} from "@/server/admin-properties-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminPropertyWritePayload } from "@/types/admin-property";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { slug } = await params;

  try {
    const upstream = await adminGetProperty(token, slug);
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
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await adminUpdateProperty(
      token,
      slug,
      body as AdminPropertyWritePayload,
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
  const { slug } = await params;

  try {
    const upstream = await adminDeleteProperty(token, slug);
    console.log("[admin:property:delete] backend response", {
      slug,
      ok: upstream.ok,
      status: upstream.status,
      data: upstream.data,
    });
    const { status, data } = upstream;
    // 204/205 must not have a body — NextResponse.json(..., 204) throws.
    if (status === 204 || status === 205) {
      return new NextResponse(null, { status });
    }
    return NextResponse.json(
      data === "" || data === undefined ? {} : data,
      { status },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    console.error("[admin:property:delete] backend request failed", {
      slug,
      error: message,
    });
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
