import {
  mapServerSessionToAuthUser,
  requireAuthWithRole,
} from "@/shared/common/lib/auth/session";
import AuthBoundaryProvider from "@/app/providers/AuthBoundaryProvider";
import { DashboardLayoutContent } from "@/app/providers/DashboardLayoutContent";

export default async function LearnersDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await requireAuthWithRole({
    loginPath: "/learners/login",
    allowedRoles: ["STUDENT", "PARENT"],
    role: "SVC",
    fallbackPath: "/educators",
  });

  return (
    <AuthBoundaryProvider initialUser={mapServerSessionToAuthUser(sessionUser)}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthBoundaryProvider>
  );
}
