import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GradingSummary } from "@/types/grading";

type GradingSummaryCardsProps = {
  summary: GradingSummary;
};

export function GradingSummaryCards({ summary }: GradingSummaryCardsProps) {
  const {
    selectedStudentName,
    selectedStudentLecture,
    currentScore,
    totalScore,
    passingScore,
    correctCount,
    totalQuestions,
    correctRate,
    isPassed,
  } = summary;
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-2 px-5 py-4">
          <p className="text-[13px] font-semibold text-[#8b90a3]">선택 학생</p>
          <p className="text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
            {selectedStudentName}
          </p>
          <p className="text-[13px] font-medium text-[#8b90a3]">
            {selectedStudentLecture}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border border-[#eaecf2] bg-[#4b72f7] shadow-none">
        <CardContent className="space-y-2 px-5 py-4">
          <p className="text-[13px] font-semibold text-white/70">실시간 점수</p>
          <p className="text-[32px] font-bold leading-[1.1] tracking-tight text-white">
            {currentScore}
            <span className="text-[22px] font-semibold text-white/80">
              /{totalScore}
            </span>
          </p>
          <p className="text-[12px] font-semibold text-white/70">
            통과 기준 {passingScore}점
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-2 px-5 py-4">
          <p className="text-[13px] font-semibold text-[#8b90a3]">정답 개수</p>
          <p className="text-[30px] font-bold leading-[1.2] tracking-tight text-[#4a4d5c]">
            {correctCount}/{totalQuestions}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[12px] font-semibold",
                isPassed
                  ? "bg-[#ecf8ef] text-[#1f8b4d]"
                  : "bg-[#ffefef] text-[#d84949]"
              )}
            >
              {isPassed ? "통과" : "미통과"}
            </span>
            <span className="rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[12px] font-semibold text-[#8b90a3]">
              정답률 {correctRate}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
