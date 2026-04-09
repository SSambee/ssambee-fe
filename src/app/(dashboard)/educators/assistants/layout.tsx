import { requireAuthWithRole } from "@/shared/common/lib/auth/session";

export default async function AssistantManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthWithRole({
    loginPath: "/educators/login",
    allowedRoles: ["INSTRUCTOR"], // ASSISTANT 제외
    role: "MGMT",
    fallbackPath: "/educators", // 조교 접근 시 메인 대시보드로 튕김
  });

  return <>{children}</>;
}
