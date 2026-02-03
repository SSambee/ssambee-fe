"use client";

import type { Exam } from "@/types/exams";
import type { Lecture } from "@/types/lectures";
import { useExamsListState } from "@/app/(dashboard)/educators/exams/_hooks/useExamsListState";

import { ExamsFilterBar } from "./list/ExamsFilterBar";
import { ExamsPaginationBar } from "./list/ExamsPaginationBar";
import { ExamsTable } from "./list/ExamsTable";

type ExamsListProps = {
  exams: Exam[];
  lectures: Lecture[];
  selectedLectureId: string;
  onLectureChange: (lectureId: string) => void;
  isLoading?: boolean;
};

export function ExamsList({
  exams,
  lectures,
  selectedLectureId,
  onLectureChange,
  isLoading = false,
}: ExamsListProps) {
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedIds,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalPages,
    sortedExams,
    paginatedExams,
    isSelectionDisabled,
    isPaginationDisabled,
    emptyMessage,
    handleSelectAll,
    handleSelectExam,
    handleDeleteSelected,
    handleLectureChange,
  } = useExamsListState({
    exams,
    selectedLectureId,
    onLectureChange,
    isLoading,
    hasLectures: lectures.length > 0,
  });

  return (
    <div className="space-y-6">
      <ExamsFilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        lectures={lectures}
        selectedLectureId={selectedLectureId}
        onLectureChange={handleLectureChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
        isLoading={isLoading}
        isSelectionDisabled={isSelectionDisabled}
      />

      <ExamsTable
        exams={paginatedExams}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectExam={handleSelectExam}
        isSelectionDisabled={isSelectionDisabled}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />

      <ExamsPaginationBar
        totalCount={sortedExams.length}
        totalPages={totalPages}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isDisabled={isPaginationDisabled}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
