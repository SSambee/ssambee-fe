import { requireEntitlementPendingPage } from "@/shared/common/lib/auth/session";

export default async function EntitlementPendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireEntitlementPendingPage();

  return <>{children}</>;
}
