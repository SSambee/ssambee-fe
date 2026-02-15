"use client";

import { Pagination } from "@/components/common/pagination/Pagination";

import { ClinicHeader } from "./_components/ClinicHeader";
import { ClinicStats } from "./_components/ClinicStats";
import { ClinicFilters } from "./_components/ClinicFilters";
import { ClinicTable } from "./_components/ClinicTable";
import { useClinicPage } from "./_hooks/useClinicPage";
import { CLINIC_ALL_VALUE } from "./_hooks/useClinicPageState";

export default function ClinicPage() {
  const {
    students,
    selectedIds,
    selectedLectureId,
    selectedExamId,
    examSearch,
    statusFilter,
    dateSort,
    incompleteFirst,
    lectureOptions,
    examOptions,
    isLectureOptionsLoading,
    isExamOptionsLoading,
    selectedExamLabel,
    sortSummary,
    isFilteredEmpty,
    emptyMessage,
    pagedStudents,
    pagination,
    isMarkingCompleted,
    setCurrentPage,
    handleLectureChange,
    handleExamChange,
    handleExamSearchChange,
    handleStatusFilterChange,
    handleSortLatest,
    handleSortIncomplete,
    handleResetFilters,
    handleSelectAll,
    handleToggleSelect,
    handleMarkCompleted,
  } = useClinicPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <ClinicHeader
        students={students}
        selectedIds={selectedIds}
        onSendNotification={handleMarkCompleted}
        isSending={isMarkingCompleted}
      />
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-10 rounded-lg border bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
          선택 {selectedIds.length}명 · 완료 처리 예정
        </div>
      )}
      <ClinicStats
        totalTargets={students.length}
        completedTargets={
          students.filter((student) => student.status === "완료").length
        }
      />
      <ClinicFilters
        lectureOptions={lectureOptions}
        examOptions={examOptions}
        lectureValue={selectedLectureId}
        examValue={selectedExamId}
        onLectureChange={handleLectureChange}
        onExamChange={handleExamChange}
        isLectureLoading={isLectureOptionsLoading}
        isExamLoading={isExamOptionsLoading}
        examSearch={examSearch}
        onExamSearchChange={handleExamSearchChange}
        isLectureSelected={selectedLectureId !== CLINIC_ALL_VALUE}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sortSummary={sortSummary}
        selectedCount={selectedIds.length}
        onMarkCompleted={handleMarkCompleted}
        isMarkingCompleted={isMarkingCompleted}
      />
      <ClinicTable
        students={pagedStudents}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        selectedExamLabel={selectedExamLabel}
        dateSort={dateSort}
        incompleteFirst={incompleteFirst}
        onSortLatest={handleSortLatest}
        onSortIncomplete={handleSortIncomplete}
        emptyMessage={emptyMessage}
        showResetButton={isFilteredEmpty}
        onResetFilters={handleResetFilters}
      />
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
