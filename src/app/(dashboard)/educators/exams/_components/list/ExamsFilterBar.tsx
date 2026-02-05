"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lecture } from "@/types/lectures";
import type {
  ExamsSortOrder,
  ExamsStatusFilter,
} from "@/app/(dashboard)/educators/exams/_hooks/useExamsListState";

type ExamsFilterBarProps = {
  statusFilter: ExamsStatusFilter;
  onStatusChange: (value: ExamsStatusFilter) => void;
  lectures: Lecture[];
  selectedLectureId: string;
  onLectureChange: (lectureId: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: ExamsSortOrder;
  onSortChange: (value: ExamsSortOrder) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  isLoading?: boolean;
  isSelectionDisabled?: boolean;
};

export function ExamsFilterBar({
  statusFilter,
  onStatusChange,
  lectures,
  selectedLectureId,
  onLectureChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  selectedCount,
  onDeleteSelected,
  isLoading = false,
  isSelectionDisabled = false,
}: ExamsFilterBarProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onStatusChange("all")}
          disabled={isLoading || !selectedLectureId}
        >
          전체
        </Button>
        <Button
          variant={statusFilter === "in_progress" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onStatusChange("in_progress")}
          disabled={isLoading || !selectedLectureId}
        >
          진행 중
        </Button>
        <Button
          variant={statusFilter === "completed" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onStatusChange("completed")}
          disabled={isLoading || !selectedLectureId}
        >
          채점 완료
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={selectedLectureId || undefined}
          onValueChange={onLectureChange}
          disabled={lectures.length === 0 || isLoading}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="수업 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {lectures.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                {isLoading
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
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="시험 검색"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            disabled={isLoading || !selectedLectureId}
            className="pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
        </div>
        <Select
          value={sortOrder}
          onValueChange={onSortChange}
          disabled={isLoading || !selectedLectureId}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
              disabled={isSelectionDisabled || selectedCount === 0}
            >
              선택 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>선택한 시험을 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedCount}개의 시험이 삭제됩니다. 이 작업은 되돌릴 수
                없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteSelected}
                disabled={isSelectionDisabled || selectedCount === 0}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
