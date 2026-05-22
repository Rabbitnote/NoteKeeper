import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  // Not logged in → trying to access dashboard → redirect to login
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Logged in → trying to access auth pages → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard/notes?tab=my", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
