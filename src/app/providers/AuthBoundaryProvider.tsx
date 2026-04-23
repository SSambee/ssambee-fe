"use client";

import type { AuthUser } from "./AuthProvider";
import { AuthProvider } from "./AuthProvider";
import { ModalProvider } from "./ModalProvider";

type AuthBoundaryProviderProps = {
  children: React.ReactNode;
  /** 서버 레이아웃에서 검증된 유저. 미전달 시 게스트 구간과 동일하게 클라이언트에서 세션 조회 */
  initialUser?: AuthUser | null;
};

export default function AuthBoundaryProvider({
  children,
  initialUser,
}: AuthBoundaryProviderProps) {
  return (
    <AuthProvider initialUser={initialUser}>
      <ModalProvider>{children}</ModalProvider>
    </AuthProvider>
  );
}
