"use client";

import { Search } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { STUDENT_TABLE_MAX_HEIGHT_PX } from "@/constants/exams.constants";
import { cn } from "@/lib/utils";
import type {
  IncludedAssignment,
  MiniTestResultRow,
} from "@/types/exams/mini-tests";

type MiniTestsResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExamId?: string | null;
  includedAssignments: IncludedAssignment[];
  filteredResultRows: MiniTestResultRow[];
  resultSearchTerm: string;
  onResultSearchTermChange: (value: string) => void;
  showOnlyMissingResults: boolean;
  onToggleMissingFilter: () => void;
};

export function MiniTestsResultModal({
  open,
  onOpenChange,
  selectedExamId,
  includedAssignments,
  filteredResultRows,
  resultSearchTerm,
  onResultSearchTermChange,
  showOnlyMissingResults,
  onToggleMissingFilter,
}: MiniTestsResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
        <DialogHeader className="border-b border-[#eaecf2] pb-4">
          <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
            미니테스트 결과 보기
          </DialogTitle>
        </DialogHeader>

        {selectedExamId && includedAssignments.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b0b4c2]" />
                <Input
                  value={resultSearchTerm}
                  onChange={(event) =>
                    onResultSearchTermChange(event.target.value)
                  }
                  placeholder="학생 검색"
                  aria-label="학생 검색"
                  className="h-11 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-10 text-[14px] font-medium tracking-[-0.14px] placeholder:text-[#8b90a3] focus-visible:ring-0"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-11 rounded-[12px] px-4 text-[13px] font-semibold",
                  showOnlyMissingResults
                    ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                    : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                )}
                onClick={onToggleMissingFilter}
              >
                {showOnlyMissingResults ? "전체 보기" : "미입력만"}
              </Button>
              <span className="text-[13px] font-medium text-[#8b90a3]">
                {filteredResultRows.length}명 표시
              </span>
            </div>

            <div
              className="overflow-auto rounded-[16px] border border-[#eaecf2]"
              style={{ maxHeight: `${STUDENT_TABLE_MAX_HEIGHT_PX}px` }}
            >
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#eaecf2] bg-[#fcfcfd]">
                    <th className="sticky left-0 z-10 bg-[#fcfcfd] p-3 text-left text-[14px] font-semibold text-[#8b90a3]">
                      학생명
                    </th>
                    {includedAssignments.map((assignment) => (
                      <th
                        key={`result-${assignment.id}`}
                        className="min-w-[120px] p-3 text-center text-[14px] font-semibold text-[#8b90a3]"
                      >
                        {assignment.categoryName}
                        <div className="text-[11px] font-medium text-[rgba(22,22,27,0.28)]">
                          {assignment.title}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResultRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={includedAssignments.length + 1}
                        className="p-5 text-center text-[14px] font-medium text-[#8b90a3]"
                      >
                        조건에 맞는 학생이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredResultRows.map((row, rowIndex) => (
                      <tr
                        key={`result-row-${row.id}`}
                        className={cn(
                          "border-b border-[#eaecf2]",
                          rowIndex % 2 === 1 && "bg-[#fcfcfd]"
                        )}
                      >
                        <td className="sticky left-0 z-10 border-r border-[#eaecf2] bg-white p-3 font-medium">
                          <div className="flex items-center gap-2">
                            <StudentProfileAvatar
                              size={28}
                              seedKey={row.id}
                              label={`${row.name || "학생"} 프로필 이미지`}
                            />
                            <span className="text-[14px] font-semibold text-[#4a4d5c]">
                              {row.name}
                            </span>
                          </div>
                        </td>
                        {row.values.map((value, idx) => (
                          <td
                            key={`result-value-${row.id}-${idx}`}
                            className="p-3 text-center text-[14px] font-medium text-[#4a4d5c]"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-[14px] font-medium text-[#8b90a3]">
            표시할 미니테스트 결과가 없습니다.
          </p>
        )}

        <DialogFooter className="border-t border-[#eaecf2] pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-[10px] border-[#d6d9e0] px-4 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
