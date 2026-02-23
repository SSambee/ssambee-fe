import { cn } from "@/lib/utils";
import { LearnersDashboardResponse } from "@/types/dashboard/learnersDashboard";

type DashboardStatCardsProps = {
  data: LearnersDashboardResponse;
};

type StatCard = {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  note?: string;
  colorType: "primary" | "secondary" | "tertiary";
};

export function DashboardStatCards({ data }: DashboardStatCardsProps) {
  const stats: StatCard[] = [
    {
      id: "clinicsCount",
      label: "클리닉 필요",
      value: data.clinicsCount ?? 0,
      unit: "개",
      note: "현재 수업",
      colorType: "primary",
    },
    {
      id: "attendanceRate",
      label: "출석률",
      value: data.attendanceRate ?? 0,
      unit: "%",
      note: "현재 수업",
      colorType: "secondary",
    },
    {
      id: "latestExam",
      label: data.latestExam?.title
        ? data.latestExam.title.length > 12
          ? `${data.latestExam.title.slice(0, 12)}...`
          : data.latestExam.title
        : "최근 시험",
      value: data.latestExam?.score ?? 0,
      unit: "점",
      note: data.latestExam
        ? `${data.latestExam.totalParticipants}명 중 ${data.latestExam.rank}등`
        : "시험 정보 없음",
      colorType: "tertiary",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {stats.map((stat) => {
        const isPrimary = stat.colorType === "primary";
        const isSecondary = stat.colorType === "secondary";
        const isTertiary = stat.colorType === "tertiary";

        return (
          <div
            key={stat.id}
            className="block rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b72f7] focus-visible:ring-offset-2"
          >
            <div
              className={cn(
                "flex h-[160px] w-full items-end justify-between rounded-[24px] border border-[#eaecf2] px-8 pb-6 pt-8 transition-transform hover:-translate-y-0.5 xl:px-10",
                isPrimary && "bg-[#4b72f7]",
                isSecondary && "bg-[#6b6f80]",
                isTertiary && "bg-white"
              )}
            >
              <div className="flex h-full flex-col items-start gap-1">
                <p
                  className={cn(
                    "text-xl font-semibold tracking-tight",
                    isTertiary ? "text-[#4a4d5c]" : "text-white/88"
                  )}
                >
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-base font-semibold tracking-tight",
                    isTertiary ? "text-[#8b90a3]" : "text-white/40"
                  )}
                >
                  {stat.note}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-end gap-1 font-bold",
                  isTertiary ? "text-[#4a4d5c]" : "text-white"
                )}
              >
                <span className="text-4xl leading-[52px] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[28px] leading-[38px] tracking-tight">
                  {stat.unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
