import { ReactNode } from "react";

import { requireAuthWithRole } from "@/shared/common/lib/auth/session";

export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthWithRole({
    loginPath: "/educators/login",
    allowedRoles: ["INSTRUCTOR"],
    role: "MGMT",
    fallbackPath: "/pricing",
  });

  return <>{children}</>;
}
