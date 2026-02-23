import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClinicStatsProps = {
  totalTargets: number;
  completedTargets: number;
};

export function ClinicStats({
  totalTargets,
  completedTargets,
}: ClinicStatsProps) {
  const stats = [
    {
      id: "clinic-stat-total",
      label: "전체 클리닉 대상자",
      note: "클리닉 알림 대상",
      value: totalTargets,
      unit: "명",
    },
    {
      id: "clinic-stat-completed",
      label: "완료",
      note: "처리 완료 인원",
      value: completedTargets,
      unit: "명",
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-stretch gap-3.5 xl:gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.id}
          className={cn(
            "w-full rounded-[20px] border border-[#eaecf2] shadow-none sm:w-[252px] xl:w-[280px]",
            index === 0 ? "bg-[#4b72f7]" : "bg-[#6b6f80]"
          )}
        >
          <CardContent className="flex h-[114px] items-end justify-between px-5 pb-3.5 pt-4 xl:px-5">
            <div className="flex h-full flex-col gap-1">
              <p className="text-[15px] font-semibold tracking-tight text-white/90">
                {stat.label}
              </p>
              <p className="text-xs font-semibold tracking-tight text-white/40">
                {stat.note}
              </p>
            </div>
            <div className="flex items-end gap-1 font-bold text-white">
              <span className="text-[28px] leading-[34px] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[20px] leading-[28px] tracking-tight">
                {stat.unit}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
