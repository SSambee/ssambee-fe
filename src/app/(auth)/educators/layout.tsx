import { requireGuest } from "@/shared/common/lib/auth/session";

export default async function EducatorsAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 상태면 educators 대시보드로 리다이렉트
  await requireGuest("/educators");

  return <>{children}</>;
}
