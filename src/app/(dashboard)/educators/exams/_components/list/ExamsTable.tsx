"use client";

import type { Exam } from "@/types/exams";

import { ExamTableRow } from "../ExamTableRow";

type ExamsTableProps = {
  exams: Exam[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectExam: (id: string, checked: boolean) => void;
  isSelectionDisabled?: boolean;
  isLoading?: boolean;
  emptyMessage: string;
};

export function ExamsTable({
  exams,
  selectedIds,
  onSelectAll,
  onSelectExam,
  isSelectionDisabled = false,
  isLoading = false,
  emptyMessage,
}: ExamsTableProps) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#eaecf2]">
      <table className="min-w-[860px] w-full">
        <thead>
          <tr className="border-b border-[#eaecf2] bg-[#fcfcfd]">
            <th className="w-12 px-4 py-4 text-left">
              <input
                type="checkbox"
                checked={
                  exams.length > 0 &&
                  exams.every((exam) => selectedIds.includes(exam.id))
                }
                onChange={(event) => onSelectAll(event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#3863f6]"
                disabled={isSelectionDisabled}
                aria-label="현재 페이지 전체 선택"
              />
            </th>
            <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
              과제명
            </th>
            <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
              반
            </th>
            <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
              등록일
            </th>
            <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
              상태
            </th>
            <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-[14px] font-medium text-[#8b90a3]"
              >
                시험 목록을 불러오는 중입니다.
              </td>
            </tr>
          ) : exams.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-[14px] font-medium text-[#8b90a3]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            exams.map((exam) => (
              <ExamTableRow
                key={exam.id}
                exam={exam}
                isSelected={selectedIds.includes(exam.id)}
                onSelect={(checked) => onSelectExam(exam.id, checked)}
                disableSelection={isSelectionDisabled}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
