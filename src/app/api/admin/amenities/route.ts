import { NextResponse } from "next/server";
import {
  adminCreateAmenity,
  adminListAmenities,
} from "@/server/admin-catalog-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminAmenityWritePayload } from "@/types/admin-catalog";

export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  try {
    const upstream = await adminListAmenities(token);
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
    const upstream = await adminCreateAmenity(
      token,
      body as AdminAmenityWritePayload,
    );
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
