import { NextResponse } from "next/server";
import { adminListEnquiries } from "@/server/admin-enquiries-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

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
    const upstream = await adminListEnquiries(token, query);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
