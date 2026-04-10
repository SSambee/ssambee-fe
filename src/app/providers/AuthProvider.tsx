"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { getSessionAPI } from "@/services/auth.service";
import type { Role } from "@/types/auth.type";

/** 랜딩 등 공개 구간: MGMT/SVC 쿠키 중 어느 쪽이든 로그인 상태를 반영 */
function shouldProbeBothSessionRoles(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy")
  );
}

async function fetchSessionUser(pathname: string) {
  if (shouldProbeBothSessionRoles(pathname)) {
    const mgmtRes = await getSessionAPI("MGMT");
    const mgmtUser = mgmtRes.data?.data?.user;
    if (mgmtUser) {
      return mgmtUser;
    }
    const svcRes = await getSessionAPI("SVC");
    return svcRes.data?.data?.user ?? null;
  }

  const role: "MGMT" | "SVC" = pathname.startsWith("/learners")
    ? "SVC"
    : "MGMT";
  const res = await getSessionAPI(role);
  return res.data?.data?.user ?? null;
}

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  userType: Role;
  image?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  /**
   * `undefined`: prop 미전달 → 클라이언트에서 세션 API 호출 (게스트 라우트 등)
   * 그 외: 서버에서 이미 검증된 초기 유저(또는 명시적 null) → 세션 API 재호출 금지
   */
  initialUser?: AuthUser | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const serverProvided = initialUser !== undefined;
  const [user, setUser] = useState<AuthUser | null>(
    serverProvided ? initialUser : null
  );
  const [isLoading, setIsLoading] = useState(!serverProvided);
  const pathname = usePathname();

  useEffect(() => {
    if (serverProvided) {
      return;
    }

    let cancelled = false;

    const initAuth = async () => {
      try {
        const userData = await fetchSessionUser(pathname);

        if (cancelled) {
          return;
        }

        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch session", err);
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, serverProvided]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 내에서 사용해야 합니다.");
  return context;
};
