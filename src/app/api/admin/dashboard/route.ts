import { NextResponse } from "next/server";
import { adminGetDashboard } from "@/server/admin-dashboard-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  try {
    const upstream = await adminGetDashboard(token);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
