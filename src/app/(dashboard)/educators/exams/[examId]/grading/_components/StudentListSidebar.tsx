"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GradingStudent } from "@/types/grading";

type StudentListSidebarProps = {
  students: GradingStudent[];
  selectedStudentId?: string;
  onSelectStudentAction?: (studentId: string) => void;
  onCompleteAction?: () => void;
  onOpenResultModalAction?: () => void;
  disableComplete?: boolean;
  disabled?: boolean;
  canViewResult?: boolean;
};

export function StudentListSidebar({
  students,
  selectedStudentId,
  onSelectStudentAction,
  onCompleteAction,
  onOpenResultModalAction,
  disableComplete = false,
  disabled = false,
  canViewResult = false,
}: StudentListSidebarProps) {
  const isAllSaved =
    students.length > 0 && students.every((student) => student.isFinalSaved);
  const isCompleteDisabled = disableComplete || !isAllSaved;

  return (
    <div className="w-80 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">학생 리스트</h2>
        <p className="text-sm text-muted-foreground">{students.length}명</p>
      </div>

      <div className="space-y-2">
        {students.map((student) => {
          const isSelected = selectedStudentId === student.id;
          const statusText = student.isFinalSaved
            ? `저장 완료 ${student.score ?? 0}점`
            : student.hasDraft
              ? "임시 저장"
              : "대기";

          return (
            <Card
              key={student.id}
              className={`cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 border-primary" : ""
              }`}
              onClick={() => {
                if (disabled) return;
                onSelectStudentAction?.(student.id);
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.lectureName}
                  </p>
                  <p className="text-xs text-muted-foreground">{statusText}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          disabled={isCompleteDisabled}
          onClick={onCompleteAction}
        >
          <Check className="h-4 w-4 mr-2" />
          전체 완료
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={disabled || !canViewResult}
          onClick={onOpenResultModalAction}
        >
          결과 보기
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          모든 학생이 저장되면 활성화됩니다.
        </p>
      </div>
    </div>
  );
}
