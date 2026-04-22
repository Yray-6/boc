import { NextResponse } from "next/server";
import { upstreamPost } from "@/server/upstream";

export type PublicEnquiryPayload = {
  property: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  enquiry_type: "GENERAL" | "SCHEDULE_VISIT" | "BUY" | "RENT" | "LEASE";
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await upstreamPost<unknown, PublicEnquiryPayload>(
      "/api/v1/enquiries/",
      body as PublicEnquiryPayload,
    );
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
