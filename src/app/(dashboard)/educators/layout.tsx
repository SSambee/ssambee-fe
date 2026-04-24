import { redirect } from "next/navigation";

import { requireAuthWithRole } from "@/lib/auth/auth";

export default async function EducatorsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 비로그인 상태면 로그인 페이지로, 권한 없으면 learners로 리다이렉트
  const user = await requireAuthWithRole({
    loginPath: "/educators/login",
    allowedRoles: ["INSTRUCTOR", "ASSISTANT"],
    role: "MGMT",
    fallbackPath: "/learners",
  });

  // 조교인 경우 승인 상태를 한 번 더 엄격하게 체크
  // requireAuthWithRole 안에서도 체크하고, 여기서 또 체크 -> 대시보드 안 보이게
  if (user.userType === "ASSISTANT" && user.profile?.signStatus !== "SIGNED") {
    redirect("/pending-approval");
    return null;
  }

  return (
    <div className="flex">
      <main className="flex-1">{children}</main>
    </div>
  );
}
