import {
  mapServerSessionToAuthUser,
  requireAuthWithRole,
  requireInstructorEntitlement,
} from "@/shared/common/lib/auth/session";
import AuthBoundaryProvider from "@/app/providers/AuthBoundaryProvider";
import { DashboardLayoutContent } from "@/app/providers/DashboardLayoutContent";

export default async function EducatorsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await requireAuthWithRole({
    loginPath: "/educators/login",
    allowedRoles: ["INSTRUCTOR", "ASSISTANT"],
    role: "MGMT",
    fallbackPath: "/learners",
  });

  // 강사일 때만 활성 이용권 체크
  await requireInstructorEntitlement(sessionUser);

  return (
    <AuthBoundaryProvider initialUser={mapServerSessionToAuthUser(sessionUser)}>
      <DashboardLayoutContent>
        <div className="flex">
          <main className="flex-1">{children}</main>
        </div>
      </DashboardLayoutContent>
    </AuthBoundaryProvider>
  );
}
