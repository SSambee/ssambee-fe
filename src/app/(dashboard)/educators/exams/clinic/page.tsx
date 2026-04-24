"use client";

import { Pagination } from "@/components/common/pagination/Pagination";

import { ExamsNavigationTabs } from "../_components/ExamsNavigationTabs";

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
    <div className="container mx-auto space-y-6 p-6 xl:space-y-7">
      <ClinicHeader
        students={students}
        selectedIds={selectedIds}
        onSendNotification={handleMarkCompleted}
        isSending={isMarkingCompleted}
      />
      <ExamsNavigationTabs />
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-10 inline-flex w-fit rounded-[14px] border border-[#dce4ff] bg-[#f4f7ff]/95 px-4 py-2.5 text-[13px] font-semibold text-[#3863f6] shadow-[0_6px_20px_rgba(56,99,246,0.08)] backdrop-blur">
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
      <div className="border-t border-[#eaecf2] pt-4">
        <Pagination
          pagination={pagination}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
