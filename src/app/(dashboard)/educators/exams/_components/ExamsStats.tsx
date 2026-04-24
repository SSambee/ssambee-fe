import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  const clinicsLoading =
    isLoading ||
    clinicsQuery.isLoading ||
    clinicsQuery.isPending ||
    clinicsQuery.isFetching;
  const stats = [
    {
      id: "exam-stat-total",
      label: "총 시험 등록",
      note: "등록된 시험 수",
      value: isLoading ? "-" : totalExams,
      unit: "개",
    },
    {
      id: "exam-stat-clinic",
      label: "클리닉 대상 시험",
      note: "클리닉 대상 클래스 기준",
      value: clinicsLoading ? "-" : clinicExams,
      unit: "개",
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-stretch gap-4 xl:gap-5">
      {stats.map((stat, index) => (
        <Card
          key={stat.id}
          className={cn(
            "w-full rounded-[20px] border border-[#eaecf2] shadow-none sm:w-[272px] xl:w-[300px]",
            index === 0 ? "bg-[#4b72f7]" : "bg-[#6b6f80]"
          )}
        >
          <CardContent className="flex h-[124px] items-end justify-between px-5 pb-4 pt-5 xl:px-6">
            <div className="flex h-full flex-col gap-1">
              <p className="text-base font-semibold tracking-tight text-white/88">
                {stat.label}
              </p>
              <p className="text-xs font-semibold tracking-tight text-white/40">
                {stat.note}
              </p>
            </div>
            <div className="flex items-end gap-1 font-bold text-white">
              <span className="text-[30px] leading-[38px] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[22px] leading-[30px] tracking-tight">
                {stat.unit}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
