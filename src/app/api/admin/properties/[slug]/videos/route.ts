import { NextResponse } from "next/server";
import {
  logAdminVideoUploadRoute,
  summarizeMultipartFormData,
} from "@/lib/admin-video-upload-log";
import {
  adminListPropertyVideos,
  adminUploadPropertyVideos,
} from "@/server/admin-properties-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(_request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { slug } = await params;
  try {
    const upstream = await adminListPropertyVideos(token, slug);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { slug } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ detail: "Invalid form data" }, { status: 400 });
  }

  logAdminVideoUploadRoute("request", {
    slug,
    form: summarizeMultipartFormData(formData),
  });

  try {
    const upstream = await adminUploadPropertyVideos(token, slug, formData);
    logAdminVideoUploadRoute("upstream-response", {
      slug,
      status: upstream.status,
      ok: upstream.ok,
      data: upstream.data,
    });
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    logAdminVideoUploadRoute("error", { slug, message });
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
