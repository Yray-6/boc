import { NextResponse } from "next/server";
import { adminUploadSiteLogo } from "@/server/admin-settings-api";
import { revalidatePublicSiteContent } from "@/server/revalidate-public-site";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

export async function POST(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ detail: "Invalid form data" }, { status: 400 });
  }
  try {
    const upstream = await adminUploadSiteLogo(token, formData);
    if (upstream.status >= 200 && upstream.status < 300) {
      revalidatePublicSiteContent();
    }
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
