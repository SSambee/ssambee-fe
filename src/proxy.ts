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

// 로그인 후 조교/이용권 상태 게이트 — 세션 없이 URL 직접 접근 시 리다이렉트
const SESSION_GATE_PATHS = [
  "/pending-approval",
  "/no-entitlement",
  "/entitlement-pending",
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

function isSessionGatePath(pathname: string): boolean {
  return SESSION_GATE_PATHS.some(
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

  if (isSessionGatePath(pathname)) {
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/educators/:path*",
    "/learners/:path*",
    "/pending-approval",
    "/no-entitlement",
    "/entitlement-pending",
  ],
};
