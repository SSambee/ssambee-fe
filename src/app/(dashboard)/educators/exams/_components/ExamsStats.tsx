import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useClinicsList } from "@/hooks/clinics/useClinicsList";
import type { Exam } from "@/types/exams";

type ExamsStatsProps = {
  exams: Exam[];
  isLoading?: boolean;
};

export function ExamsStats({ exams, isLoading = false }: ExamsStatsProps) {
  const totalExams = exams.length;
  const clinicsQuery = useClinicsList({});
  const clinics = clinicsQuery.data;
  const clinicExams = useMemo(() => {
    const examIds = new Set((clinics ?? []).map((clinic) => clinic.exam.id));
    return examIds.size;
  }, [clinics]);
  const totalLabel = isLoading ? "-" : `${totalExams}개`;
  const clinicsLoading =
    isLoading ||
    clinicsQuery.isLoading ||
    clinicsQuery.isPending ||
    clinicsQuery.isFetching;
  const clinicLabel = clinicsLoading ? "-" : `${clinicExams}개`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 시험 등록</p>
              <p className="text-3xl font-bold">{totalLabel}</p>
              <p className="text-xs text-muted-foreground">등록된 시험 수</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">클리닉 대상 시험</p>
              <p className="text-3xl font-bold">{clinicLabel}</p>
              <p className="text-xs text-muted-foreground">
                클리닉 대상 클래스 기준
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
