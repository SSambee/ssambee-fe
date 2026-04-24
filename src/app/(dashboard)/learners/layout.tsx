import { requireAuthWithRole } from "@/lib/auth/auth";

export default async function LearnersDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 비로그인 상태면 로그인 페이지로, 권한 없으면 educators로 리다이렉트
  await requireAuthWithRole({
    loginPath: "/learners/login",
    allowedRoles: ["STUDENT", "PARENT"],
    role: "SVC",
    fallbackPath: "/educators",
  });

  return <>{children}</>;
}
