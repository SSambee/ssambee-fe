import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAMES } from "@/shared/common/lib/auth/session-token";

const EDUCATORS_PUBLIC_PREFIXES = [
  "/educators/login",
  "/educators/instructor-register",
  "/educators/assistant-register",
] as const;

const LEARNERS_PUBLIC_PREFIXES = [
  "/learners/login",
  "/learners/register",
] as const;

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

function isPublicEducatorsPath(pathname: string): boolean {
  return EDUCATORS_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isPublicLearnersPath(pathname: string): boolean {
  return LEARNERS_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/educators")) {
    if (isPublicEducatorsPath(pathname)) {
      return NextResponse.next();
    }
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/educators/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/learners")) {
    if (isPublicLearnersPath(pathname)) {
      return NextResponse.next();
    }
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/learners/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/educators/:path*", "/learners/:path*"],
};
