"use client";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { LearnersDashboardClient } from "./_components/LearnersDashboardClient";

export default function LearnersDashboardPage() {
  useSetBreadcrumb([{ label: "대시보드" }]);

  return <LearnersDashboardClient />;
}
