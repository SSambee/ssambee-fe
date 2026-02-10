import { requireAuthWithRole } from "@/lib/auth/auth";

export default async function EducatorsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 비로그인 상태면 로그인 페이지로, 권한 없으면 learners로 리다이렉트
  await requireAuthWithRole({
    loginPath: "/educators/login",
    allowedRoles: ["INSTRUCTOR", "ASSISTANT"],
    role: "MGMT",
    fallbackPath: "/learners",
  });

  return <>{children}</>;
}
