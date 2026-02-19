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

// 조교 가입 승인 상태
type SignStatus = "PENDING" | "REJECTED" | "SIGNED" | "EXPIRED";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  userType: Role;
};

type SessionProfile = {
  signStatus: SignStatus;
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
): Promise<(SessionUser & { profile: SessionProfile }) | null> {
  try {
    const baseURL = role === "MGMT" ? API_BASE_URL : API_BASE_URL_SVC;
    const cookieHeader = await getCookieHeader();

    if (!baseURL) {
      console.error(`Missing API base URL for role: ${role}`);
      return null;
    }

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

    const res = await response.json();

    if (!res.data || !res.data.user) {
      return null;
    }

    return {
      ...res.data.user,
      profile: res.data.profile,
    };
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
}): Promise<SessionUser & { profile: SessionProfile }> {
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

  // 역할이 조교일 때만 진행
  const rolesNeedApproval: Role[] = ["ASSISTANT"];

  if (rolesNeedApproval.includes(user.userType)) {
    const signStatus = user.profile?.signStatus;
    if (signStatus !== "SIGNED") {
      // 서명 대기/거절/만료 상태라면 서명 페이지(또는 승인 대기 페이지)로 이동
      redirect("/pending-approval");
    }
  }

  // Role 체크
  if (!allowedRoles.includes(user.userType)) {
    // 권한이 없으면 fallback 경로로 리다이렉트
    redirect(fallbackPath);
  }

  return user;
}

// 로그인 상태면 대시보드로 리다이렉트
export async function requireGuest(
  dashboardPath: string,
  role: "MGMT" | "SVC" = "MGMT" // 어떤 세션을 체크할지
): Promise<void> {
  const isCookieExist = await hasSession();

  // 쿠키가 아예 없으면 게스트니까 통과
  if (!isCookieExist) return;

  // 쿠키가 있다면 실제로 유효한 세션인지 확인
  const user = await getServerSession(role);

  // 실제 유효한 유저 정보가 있으면 리다이렉트
  if (user) {
    redirect(dashboardPath);
  }

  // 쿠키는 있는데 user가 null이면 세션 만료
  // 리다이렉트하지 않고 로그인 페이지를 보여줌 (무한 루프 탈출)
}
