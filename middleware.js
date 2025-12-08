import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("jwtToken");
  const pathname = req.nextUrl.pathname;

  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
