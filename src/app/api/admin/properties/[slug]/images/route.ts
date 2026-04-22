import { NextResponse } from "next/server";
import { adminUploadPropertyImages } from "@/server/admin-properties-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

type RouteParams = { params: Promise<{ slug: string }> };

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

  try {
    const upstream = await adminUploadPropertyImages(token, slug, formData);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
