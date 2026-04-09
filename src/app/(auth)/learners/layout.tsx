import { requireGuest } from "@/shared/common/lib/auth/session";

export default async function LearnersAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 상태면 learners 대시보드로 리다이렉트
  await requireGuest("/learners", "SVC");

  return <>{children}</>;
}
