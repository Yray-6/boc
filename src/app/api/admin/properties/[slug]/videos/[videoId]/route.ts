import { NextResponse } from "next/server";
import {
  adminDeletePropertyVideo,
  adminGetPropertyVideo,
} from "@/server/admin-properties-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

type RouteParams = { params: Promise<{ slug: string; videoId: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  const { slug, videoId } = await params;
  const id = Number(videoId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ detail: "Invalid video id" }, { status: 400 });
  }

  try {
    const upstream = await adminGetPropertyVideo(token, slug, id);
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
  const { slug, videoId } = await params;
  const id = Number(videoId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ detail: "Invalid video id" }, { status: 400 });
  }

  try {
    const upstream = await adminDeletePropertyVideo(token, slug, id);
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
