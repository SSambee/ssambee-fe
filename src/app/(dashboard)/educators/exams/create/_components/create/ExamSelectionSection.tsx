"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lecture } from "@/types/lectures";
import type { ExamApi } from "@/types/exams";
import { formatDateYMD } from "@/utils/date";

type ExamSelectionSectionProps = {
  lectures: Lecture[];
  lectureValue?: string;
  onLectureChange?: (value: string) => void;
  isLecturesLoading?: boolean;
  exams?: ExamApi[];
  examValue?: string;
  onExamChange?: (value: string) => void;
  isExamsLoading?: boolean;
  disabled?: boolean;
};

export function ExamSelectionSection({
  lectures,
  lectureValue,
  onLectureChange,
  isLecturesLoading = false,
  exams = [],
  examValue = "new",
  onExamChange,
  isExamsLoading = false,
  disabled = false,
}: ExamSelectionSectionProps) {
  const renderDate = (iso?: string) => {
    const ymd = formatDateYMD(iso);
    return ymd ? ymd.split("-").join(". ") : "날짜 미지정";
  };

  return (
    <Card>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">수업 및 시험 선택</h2>
      </div>
      <CardContent className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">수업</label>
            <Select
              value={lectureValue}
              onValueChange={onLectureChange}
              disabled={disabled || isLecturesLoading || lectures.length === 0}
            >
              <SelectTrigger className="w-full" aria-label="수업 선택">
                <SelectValue placeholder="수업을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {lectures.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    {isLecturesLoading
                      ? "수업을 불러오는 중입니다"
                      : "등록된 수업이 없습니다"}
                  </SelectItem>
                ) : (
                  lectures.map((lecture) => (
                    <SelectItem key={lecture.id} value={lecture.id}>
                      {lecture.name} ({lecture.subject} · {lecture.schoolYear})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">등록된 시험</label>
            <Select
              value={examValue}
              onValueChange={onExamChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full" aria-label="등록된 시험 선택">
                <SelectValue placeholder="새 시험 등록" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">새 시험 등록</SelectItem>
                {isExamsLoading ? (
                  <SelectItem value="__loading__" disabled>
                    시험 목록을 불러오는 중입니다.
                  </SelectItem>
                ) : exams.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    등록된 시험이 없습니다.
                  </SelectItem>
                ) : (
                  exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title} ·{" "}
                      {renderDate(exam.examDate ?? exam.createdAt)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
