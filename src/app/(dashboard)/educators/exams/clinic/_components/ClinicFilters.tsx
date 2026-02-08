"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  value: string;
  label: string;
};

type ClinicFiltersProps = {
  lectureOptions: FilterOption[];
  examOptions: FilterOption[];
  lectureValue: string;
  examValue: string;
  onLectureChange: (value: string) => void;
  onExamChange: (value: string) => void;
  examSearch: string;
  onExamSearchChange: (value: string) => void;
  isLectureSelected?: boolean;
  isLectureLoading?: boolean;
  isExamLoading?: boolean;
  statusFilter: "all" | "pending" | "completed";
  onStatusFilterChange: (value: "all" | "pending" | "completed") => void;
  sortSummary: string;
  selectedCount: number;
  onMarkCompleted: () => void;
  isMarkingCompleted?: boolean;
};

export function ClinicFilters({
  lectureOptions,
  examOptions,
  lectureValue,
  examValue,
  onLectureChange,
  onExamChange,
  examSearch,
  onExamSearchChange,
  isLectureSelected = false,
  isLectureLoading = false,
  isExamLoading = false,
  statusFilter,
  onStatusFilterChange,
  sortSummary,
  selectedCount,
  onMarkCompleted,
  isMarkingCompleted = false,
}: ClinicFiltersProps) {
  const handleMarkCompleted = () => {
    if (selectedCount > 0) {
      onMarkCompleted();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 좌측 필터 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">수업:</span>
            <Select
              value={lectureValue}
              onValueChange={onLectureChange}
              disabled={isLectureLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="수업 선택" />
              </SelectTrigger>
              <SelectContent>
                {lectureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">시험:</span>
            <Select
              value={examValue === "all" ? "" : examValue}
              onValueChange={onExamChange}
              disabled={isExamLoading || !isLectureSelected}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="시험 선택(옵션)" />
              </SelectTrigger>
              <SelectContent>
                {examOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">검색:</span>
            <Input
              value={examSearch}
              onChange={(e) => onExamSearchChange(e.target.value)}
              placeholder="학생/시험/날짜 검색"
              className="w-[220px]"
              disabled={!isLectureSelected}
            />
          </div>
        </div>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkCompleted}
            disabled={selectedCount === 0 || isMarkingCompleted}
          >
            완료 표시
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">빠른 필터:</span>
          {[
            { key: "all", label: "전체" },
            { key: "pending", label: "알림 예정만" },
            { key: "completed", label: "완료만" },
          ].map((item) => {
            const isActive = statusFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  onStatusFilterChange(
                    item.key as "all" | "pending" | "completed"
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">정렬: {sortSummary}</p>
      </div>
    </div>
  );
}
