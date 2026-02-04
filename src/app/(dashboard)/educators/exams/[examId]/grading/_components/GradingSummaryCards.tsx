import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* 선택 학생 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">선택 학생</p>
          <p className="font-medium">{selectedStudentName}</p>
          <p className="text-sm text-muted-foreground">
            {selectedStudentLecture}
          </p>
        </CardContent>
      </Card>

      {/* 실시간 점수 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">실시간 점수</p>
          <p className="text-3xl font-bold mb-1">
            {currentScore}/{totalScore}
          </p>
          <p className="text-xs text-muted-foreground">
            통과 기준 {passingScore}점
          </p>
        </CardContent>
      </Card>

      {/* 정답 개수 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">정답 개수</p>
          <p className="text-3xl font-bold mb-2">
            {correctCount}/{totalQuestions}
          </p>
          <div className="flex gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isPassed
                  ? "bg-green-500/20 text-green-600"
                  : "bg-red-500/20 text-red-600"
              }`}
            >
              {isPassed ? "통과" : "미통과"}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              정답률 {correctRate}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
