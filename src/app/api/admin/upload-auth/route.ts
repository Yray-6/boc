import { NextResponse } from "next/server";
import { resolveAdminAccessToken } from "@/server/resolve-admin-access-token";

function apiBaseUrlForBrowser(): string {
  const base =
    process.env.NEXT_PUBLIC_BOC_API_BASE_URL?.trim() ||
    process.env.BOC_API_BASE_URL?.trim() ||
    "";
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_BOC_API_BASE_URL or BOC_API_BASE_URL must be configured for direct media uploads.",
    );
  }
  return base.replace(/\/+$/, "");
}

/** Returns Bearer token + API base URL for browser multipart uploads (bypasses Vercel 4.5 MB limit). */
export async function GET(request: Request) {
  const token = await resolveAdminAccessToken(request);
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  try {
    return NextResponse.json({
      apiBaseUrl: apiBaseUrlForBrowser(),
      accessToken: token,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Configuration error";
    return NextResponse.json({ detail: message }, { status: 503 });
  }
}
