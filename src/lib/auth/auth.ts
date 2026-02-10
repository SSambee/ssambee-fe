import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Role } from "@/types/auth.type";

// better-auth 쿠키
const SESSION_COOKIE_NAMES = [
  "ssambee-auth.session_token",
  "__Secure-ssambee-auth.session_token",
] as const;

// 강사/조교, 학생/학부모 전용 API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL_SVC = process.env.NEXT_PUBLIC_API_BASE_URL_SVC;

type SessionUser = {
  id: string;
  email: string;
  name: string;
  userType: Role;
};

type SessionResponse = {
  success: boolean;
  data?: {
    user: SessionUser;
  };
};

// 서버 컴포넌트에서 세션 쿠키 존재 여부 확인
// 세션 쿠키가 하나라도 존재하면 true
export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();

  return SESSION_COOKIE_NAMES.some((name) => cookieStore.has(name));
}

//서버 컴포넌트에서 쿠키를 문자열로 변환
async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

//서버 컴포넌트에서 세션 정보 가져오기 (MGMT: 강사/조교, SVC: 학생/학부모)
export async function getServerSession(
  role: "MGMT" | "SVC" = "MGMT"
): Promise<SessionUser | null> {
  try {
    const baseURL = role === "MGMT" ? API_BASE_URL : API_BASE_URL_SVC;
    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${baseURL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store", // 항상 최신 세션 정보 가져오기
    });

    if (!response.ok) {
      return null;
    }

    const data: SessionResponse = await response.json();

    return data.data?.user || null;
  } catch (error) {
    console.error("Failed to fetch server session:", error);
    return null;
  }
}

// 비로그인 상태면 로그인 페이지로 리다이렉트
export async function requireAuth(loginPath: string): Promise<void> {
  const isAuthenticated = await hasSession();

  if (!isAuthenticated) {
    redirect(loginPath);
  }
}

// 비로그인 상태 또는 권한 없으면 리다이렉트
export async function requireAuthWithRole(options: {
  loginPath: string;
  allowedRoles: Role[];
  role: "MGMT" | "SVC";
  fallbackPath: string;
}): Promise<SessionUser> {
  const { loginPath, allowedRoles, role, fallbackPath } = options;

  // 쿠키 체크
  const isAuthenticated = await hasSession();
  if (!isAuthenticated) {
    redirect(loginPath);
  }

  // 세션 정보 가져오기
  const user = await getServerSession(role);

  // 세션 정보가 없으면 로그인 페이지로
  if (!user) {
    redirect(loginPath);
  }

  // Role 체크
  if (!allowedRoles.includes(user.userType)) {
    // 권한이 없으면 fallback 경로로 리다이렉트
    redirect(fallbackPath);
  }

  return user;
}

// 로그인 상태면 대시보드로 리다이렉트
export async function requireGuest(dashboardPath: string): Promise<void> {
  const isAuthenticated = await hasSession();

  if (isAuthenticated) {
    redirect(dashboardPath);
  }
}
