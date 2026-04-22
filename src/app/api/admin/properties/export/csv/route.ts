import { NextResponse } from "next/server";
import { adminExportPropertiesCsv } from "@/server/admin-properties-api";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  try {
    const upstream = await adminExportPropertiesCsv(token);
    if (!upstream.ok) {
      const text = Buffer.from(upstream.data).toString("utf8");
      try {
        const j = JSON.parse(text) as { detail?: string };
        return NextResponse.json(j, { status: upstream.status });
      } catch {
        return new NextResponse(text, { status: upstream.status });
      }
    }
    const buf = Buffer.from(upstream.data);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="properties.csv"',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
