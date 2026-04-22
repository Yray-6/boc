import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_ACCESS_COOKIE } from "@/lib/admin-auth-cookies";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  if (token) {
    return NextResponse.next();
  }

  const login = new URL("/admin-login", request.url);
  const { pathname, search } = request.nextUrl;
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
