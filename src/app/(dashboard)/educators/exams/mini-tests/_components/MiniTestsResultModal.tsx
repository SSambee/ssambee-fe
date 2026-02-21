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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>미니테스트 결과 보기</DialogTitle>
        </DialogHeader>

        {selectedExamId && includedAssignments.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={resultSearchTerm}
                  onChange={(event) =>
                    onResultSearchTermChange(event.target.value)
                  }
                  placeholder="학생 검색"
                  aria-label="학생 검색"
                  className="h-9 pl-8 text-sm"
                />
              </div>
              <Button
                type="button"
                variant={showOnlyMissingResults ? "default" : "outline"}
                className="h-9 px-3 text-xs"
                onClick={onToggleMissingFilter}
              >
                {showOnlyMissingResults ? "전체 보기" : "미입력만"}
              </Button>
              <span className="text-xs text-muted-foreground">
                {filteredResultRows.length}명 표시
              </span>
            </div>

            <div
              className="overflow-auto rounded-md border"
              style={{ maxHeight: `${STUDENT_TABLE_MAX_HEIGHT_PX}px` }}
            >
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b">
                    <th className="p-3 text-left font-semibold sticky left-0 bg-muted/40 z-10">
                      학생명
                    </th>
                    {includedAssignments.map((assignment) => (
                      <th
                        key={`result-${assignment.id}`}
                        className="p-3 text-center font-semibold min-w-[110px]"
                      >
                        {assignment.categoryName}
                        <div className="text-[10px] font-normal text-muted-foreground">
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
                        className="p-4 text-center text-sm text-muted-foreground"
                      >
                        조건에 맞는 학생이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredResultRows.map((row) => (
                      <tr key={`result-row-${row.id}`} className="border-b">
                        <td className="p-3 font-medium sticky left-0 bg-background z-10 border-r">
                          <div className="flex items-center gap-2">
                            <StudentProfileAvatar
                              size={28}
                              seedKey={row.id}
                              label={`${row.name || "학생"} 프로필 이미지`}
                            />
                            <span>{row.name}</span>
                          </div>
                        </td>
                        {row.values.map((value, idx) => (
                          <td
                            key={`result-value-${row.id}-${idx}`}
                            className="p-3 text-center"
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
          <p className="text-sm text-muted-foreground">
            표시할 미니테스트 결과가 없습니다.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
