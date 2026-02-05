import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { ClinicHeader } from "./_components/ClinicHeader";
import { ClinicStats } from "./_components/ClinicStats";
import { ClinicFilters } from "./_components/ClinicFilters";
import { ClinicTable } from "./_components/ClinicTable";

export default function ClinicPage() {
  useSetBreadcrumb([
    { label: "시험 관리", href: "/educators/exams" },
    { label: "클리닉" },
  ]);
  return (
    <div className="container mx-auto space-y-8 p-6">
      <ClinicHeader />
      <ClinicStats />
      <ClinicFilters />
      <ClinicTable />
    </div>
  );
}
