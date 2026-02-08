"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusLabel from "@/components/common/label/StatusLabel";
import type { ClinicStudent } from "@/types/clinics";

type ClinicTableProps = {
  students: ClinicStudent[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string, checked: boolean) => void;
  selectedExamLabel: string;
  dateSort: "latest" | "oldest";
  incompleteFirst: boolean;
  onSortLatest: () => void;
  onSortIncomplete: () => void;
  emptyMessage?: string;
  showResetButton?: boolean;
  onResetFilters?: () => void;
};

const statusColorMap = {
  "알림 예정": "gray",
  "알림 발송": "green",
  완료: "blue",
} as const;

export function ClinicTable({
  students,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  selectedExamLabel,
  dateSort,
  incompleteFirst,
  onSortLatest,
  onSortIncomplete,
  emptyMessage,
  showResetButton = false,
  onResetFilters,
}: ClinicTableProps) {
  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    onToggleSelect(id, checked);
  };

  return (
    <div className="space-y-4">
      {/* 테이블 헤더 */}
      <div className="text-sm text-muted-foreground">
        선택된 시험:{" "}
        <span className="font-medium text-foreground">{selectedExamLabel}</span>
      </div>

      {/* 테이블 */}
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    students.length > 0 &&
                    students.every((student) =>
                      selectedIds.includes(student.id)
                    )
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="cursor-pointer"
                  aria-label="전체 선택"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                학생 정보
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                미통과 시험명
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                점수 / 컷
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  미통과 일자
                  <button
                    type="button"
                    onClick={onSortLatest}
                    className={`rounded p-0.5 transition ${
                      dateSort === "latest"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    aria-label="미통과 일자 최신순 정렬"
                  >
                    {dateSort === "latest" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  재시험 확인
                  <button
                    type="button"
                    onClick={onSortIncomplete}
                    className={`rounded p-0.5 transition ${
                      incompleteFirst
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    aria-label="미완료 우선 정렬"
                  >
                    {incompleteFirst ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p>{emptyMessage ?? "표시할 클리닉 대상자가 없습니다."}</p>
                    {showResetButton && onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="text-xs font-medium text-primary underline"
                      >
                        필터 초기화
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={(e) =>
                        handleSelectStudent(student.id, e.target.checked)
                      }
                      className="cursor-pointer"
                      aria-label={`${student.name} 선택`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={`${student.color} text-white`}
                        >
                          {student.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{student.examName}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-red-500">{student.score}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {student.cutoff}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {student.failedDate}
                  </td>
                  <td className="px-4 py-3">
                    <StatusLabel
                      color={statusColorMap[student.status]}
                      showDot={student.status !== "알림 예정"}
                    >
                      {student.status}
                    </StatusLabel>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
