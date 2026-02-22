"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
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
  return (
    <div className="space-y-4">
      <div className="text-[14px] font-semibold text-[#8b90a3]">
        선택된 시험: <span className="text-[#4a4d5c]">{selectedExamLabel}</span>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[#eaecf2] bg-white">
        <table className="min-w-[860px] w-full">
          <thead>
            <tr className="border-b border-[#eaecf2] bg-[#fcfcfd]">
              <th className="w-12 px-4 py-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    students.length > 0 &&
                    students.every((student) =>
                      selectedIds.includes(student.id)
                    )
                  }
                  onChange={(event) => onSelectAll(event.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#3863f6]"
                  aria-label="전체 선택"
                />
              </th>
              <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                학생 정보
              </th>
              <th className="w-[24%] px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                미통과 시험명
              </th>
              <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                점수 / 컷
              </th>
              <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                <div className="flex items-center gap-1">
                  미통과 일자
                  <button
                    type="button"
                    onClick={onSortLatest}
                    className={`rounded-md p-1 transition ${
                      dateSort === "latest"
                        ? "bg-[#eef2ff] text-[#3863f6]"
                        : "text-[#8b90a3] hover:bg-[#f4f6fb]"
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
              <th className="px-4 py-4 text-left text-[14px] font-semibold text-[#8b90a3]">
                <div className="flex items-center gap-1">
                  재시험 확인
                  <button
                    type="button"
                    onClick={onSortIncomplete}
                    className={`rounded-md p-1 transition ${
                      incompleteFirst
                        ? "bg-[#eef2ff] text-[#3863f6]"
                        : "text-[#8b90a3] hover:bg-[#f4f6fb]"
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
                  className="px-4 py-10 text-center text-[14px] font-medium text-[#8b90a3]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p>{emptyMessage ?? "표시할 클리닉 대상자가 없습니다."}</p>
                    {showResetButton && onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="text-[12px] font-semibold text-[#3863f6] underline"
                      >
                        필터 초기화
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-[#f0f2f7] last:border-b-0 hover:bg-[#fcfcfd]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={(event) =>
                        onToggleSelect(student.id, event.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer accent-[#3863f6]"
                      aria-label={`${student.name} 선택`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <StudentProfileAvatar
                        size={36}
                        seedKey={student.id}
                        label={`${student.name || "학생"} 프로필 이미지`}
                      />
                      <div>
                        <p className="text-[14px] font-semibold text-[#4a4d5c]">
                          {student.name}
                        </p>
                        <p className="text-[12px] font-medium text-[#8b90a3]">
                          {student.class}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] font-medium text-[#4a4d5c]">
                    {student.examName}
                  </td>
                  <td className="px-4 py-4 text-[14px] font-semibold">
                    <span className="text-[#e55b5b]">{student.score}</span>
                    <span className="font-medium text-[#8b90a3]">
                      {" "}
                      / {student.cutoff}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[14px] font-medium text-[#8b90a3]">
                    {student.failedDate}
                  </td>
                  <td className="px-4 py-4">
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
