import { NextResponse } from "next/server";
import { publicListSimilar } from "@/server/public-properties-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ detail: "Missing slug" }, { status: 400 });
  }
  try {
    const upstream = await publicListSimilar(slug);
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
