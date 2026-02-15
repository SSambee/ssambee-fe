"use client";

import { useMemo } from "react";
import { FileText } from "lucide-react";

import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { mapExamApiToView } from "@/services/exams/exams.mapper";

type LectureDetailExamsProps = {
  lectureId: string;
  lectureName: string;
  enabled: boolean;
};

export function LectureDetailExams({
  lectureId,
  lectureName,
  enabled,
}: LectureDetailExamsProps) {
  const { data: exams, isLoading } = useExamsByLecture(
    enabled ? lectureId : undefined
  );

  const examList = useMemo(
    () => (exams ?? []).map((exam) => mapExamApiToView(exam, lectureName)),
    [exams, lectureName]
  );

  if (isLoading) {
    return (
      <div className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-8 text-center text-sm text-[#8b90a3]">
        시험 목록 불러오는 중...
      </div>
    );
  }

  if (examList.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-8 text-center text-sm text-[#8b90a3]">
        연결된 시험이 없습니다.
      </div>
    );
  }

  return (
    <div className="max-h-[364px] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#dadde3_transparent]">
      {examList.map((exam) => {
        const examMeta = exam.subtitle?.trim() || "시험지";
        const examDate = exam.registrationDate || "-";

        return (
          <div
            key={exam.id}
            className="rounded-[20px] border border-[#f4f6fa] bg-[#f7f8fa] px-7 py-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[16px] bg-[#e1e7fe] text-[#7f99fb]">
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[20px] font-semibold leading-7 tracking-[-0.2px] text-[#6b6f80]">
                  {exam.name}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3]">
                  <span>{examMeta}</span>
                  <span className="h-[3px] w-[3px] rounded-full bg-[#dadde3]" />
                  <span>{examDate} 수정</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
