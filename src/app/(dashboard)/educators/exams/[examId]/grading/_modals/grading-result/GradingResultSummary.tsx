import { Card, CardContent } from "@/components/ui/card";

import { GradingReportOverview } from "./types";

type GradingResultSummaryProps = {
  overview: GradingReportOverview;
};

export function GradingResultSummary({ overview }: GradingResultSummaryProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">시험 일자</p>
            <p className="text-lg font-semibold">{overview.examDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">평균</p>
            <p className="text-lg font-semibold">{overview.averageScore}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">상위 30% 평균</p>
            <p className="text-lg font-semibold">
              {overview.top30AverageScore}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">최고점수</p>
            <p className="text-lg font-semibold">{overview.maxScore}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
