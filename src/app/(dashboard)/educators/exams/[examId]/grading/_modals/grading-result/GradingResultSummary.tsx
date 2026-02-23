import type { GradingReportOverview } from "@/types/exams";
import { Card, CardContent } from "@/components/ui/card";

type GradingResultSummaryProps = {
  overview: GradingReportOverview;
};

export function GradingResultSummary({ overview }: GradingResultSummaryProps) {
  const summaryItems = [
    { label: "시험 일자", value: overview.examDate },
    { label: "평균", value: overview.averageScore },
    { label: "상위 30% 평균", value: overview.top30AverageScore },
    { label: "최고점수", value: overview.maxScore },
  ] as const;

  return (
    <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.label}
              className={
                index === 1
                  ? "rounded-[14px] border border-[#dce4ff] bg-[#f4f7ff] px-3.5 py-3"
                  : "rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] px-3.5 py-3"
              }
            >
              <p className="text-[12px] font-semibold text-[#8b90a3]">
                {item.label}
              </p>
              <p className="mt-1 text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
