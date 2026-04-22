import { NextResponse } from "next/server";
import {
  adminGetEnquiry,
  adminUpdateEnquiryStatus,
} from "@/server/admin-enquiries-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminEnquiryStatusPayload } from "@/types/admin-enquiry";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  }
  try {
    const upstream = await adminGetEnquiry(token, numId);
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
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const upstream = await adminUpdateEnquiryStatus(
      token,
      numId,
      body as AdminEnquiryStatusPayload,
    );
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
