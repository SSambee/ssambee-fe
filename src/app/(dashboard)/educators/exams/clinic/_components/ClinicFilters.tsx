"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-3.5 rounded-[24px] border border-[#eaecf2] bg-white p-5 shadow-none sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: "전체" },
          { key: "pending", label: "알림 예정만" },
          { key: "completed", label: "완료만" },
        ].map((item) => {
          const isActive = statusFilter === item.key;
          return (
            <Button
              key={item.key}
              variant="outline"
              className={cn(
                "h-9 rounded-full px-3.5 text-[12px] font-semibold",
                isActive
                  ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                  : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              )}
              onClick={() =>
                onStatusFilterChange(
                  item.key as "all" | "pending" | "completed"
                )
              }
              disabled={!isLectureSelected}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
        <Select
          value={lectureValue}
          onValueChange={onLectureChange}
          disabled={isLectureLoading}
        >
          <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[13px] font-medium text-[#4a4d5c] xl:w-[204px]">
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

        <Select
          value={examValue}
          onValueChange={onExamChange}
          disabled={isExamLoading || !isLectureSelected}
        >
          <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[13px] font-medium text-[#4a4d5c] xl:w-[204px]">
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

        <div className="relative flex-1 xl:max-w-[360px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b0b4c2]" />
          <Input
            value={examSearch}
            onChange={(event) => onExamSearchChange(event.target.value)}
            placeholder="학생/시험/날짜 검색"
            className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-10 text-[13px] font-medium tracking-[-0.13px] placeholder:text-[#8b90a3]"
            disabled={!isLectureSelected}
          />
        </div>

        <div className="flex items-center gap-2 xl:ml-auto">
          <Button
            variant="outline"
            className={cn(
              "h-10 rounded-[12px] px-4 text-[12px] font-semibold",
              selectedCount > 0
                ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            )}
            onClick={onMarkCompleted}
            disabled={selectedCount === 0 || isMarkingCompleted}
          >
            완료 표시
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eaecf2] pt-2.5">
        <p className="text-[12px] font-semibold text-[#8b90a3]">
          정렬: {sortSummary}
        </p>
        <p className="text-[12px] font-semibold text-[#8b90a3]">
          선택 {selectedCount}명
        </p>
      </div>
    </div>
  );
}
