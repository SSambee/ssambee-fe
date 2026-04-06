import {
  mapServerSessionToAuthUser,
  requireAuthWithRole,
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
