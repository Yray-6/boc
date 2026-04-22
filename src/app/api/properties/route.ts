import { NextResponse } from "next/server";
import { publicListProperties } from "@/server/public-properties-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  try {
    const upstream = await publicListProperties(qs ? new URLSearchParams(qs) : undefined);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
