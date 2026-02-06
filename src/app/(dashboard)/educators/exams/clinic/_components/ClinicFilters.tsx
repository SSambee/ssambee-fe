"use client";

import { Button } from "@/components/ui/button";
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
  isLectureLoading?: boolean;
  isExamLoading?: boolean;
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
  isLectureLoading = false,
  isExamLoading = false,
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
    <div className="flex items-center justify-between rounded-lg border p-4">
      {/* 좌측 필터 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">수업:</span>
          <Select
            value={lectureValue}
            onValueChange={onLectureChange}
            disabled={isLectureLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="전체 수업" />
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
            value={examValue}
            onValueChange={onExamChange}
            disabled={isExamLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="모든 시험" />
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
  );
}
