import { NextResponse } from "next/server";
import {
  adminGetSiteSettings,
  adminPatchSiteSettings,
  adminPutSiteSettings,
} from "@/server/admin-settings-api";
import { revalidatePublicSiteContent } from "@/server/revalidate-public-site";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";
import type { AdminSiteSettingsWritePayload } from "@/types/admin-settings";

function revalidateIfSaved(status: number) {
  if (status >= 200 && status < 300) revalidatePublicSiteContent();
}

export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  try {
    const upstream = await adminGetSiteSettings(token);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
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
    const upstream = await adminPatchSiteSettings(
      token,
      body as Partial<AdminSiteSettingsWritePayload>,
    );
    revalidateIfSaved(upstream.status);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function PUT(request: Request) {
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
    const upstream = await adminPutSiteSettings(
      token,
      body as AdminSiteSettingsWritePayload,
    );
    revalidateIfSaved(upstream.status);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
