"use client";

import { useCallback } from "react";
import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useScheduleEvents } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEvents";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { ScheduleCalendar } from "@/app/(dashboard)/educators/schedules/_components/ScheduleCalendar";
import { ScheduleSidebar } from "@/app/(dashboard)/educators/schedules/_components/ScheduleSidebar";
import { ScheduleCreateModal } from "@/app/(dashboard)/educators/schedules/_modals/ScheduleCreateModal";
import { ScheduleCategoryManageModal } from "@/app/(dashboard)/educators/schedules/_modals/ScheduleCategoryManageModal";
import { ScheduleTimetableModal } from "@/app/(dashboard)/educators/schedules/_modals/ScheduleTimetableModal";

export default function EducatorsSchedulesPage() {
  useSetBreadcrumb([{ label: "스케줄 관리" }]);

  const {
    view,
    currentDate,
    filteredEvents,
    todayEvents,
    categories,
    categoryLabelMap,
    filters,
    isSchedulesLoading,
    isScheduleCreating,
    isScheduleUpdating,
    isScheduleDeleting,
    isCategoryCreating,
    isCategoryUpdating,
    isCategoryDeleting,
    isCategoryModalOpen,
    loadError,
    setView,
    setCurrentDate,
    setFilters,
    createOpen,
    scheduleModalMode,
    timetableOpen,
    setTimetableOpen,
    timetableEntries,
    timetableMeta,
    isTimetableLoading,
    timetableError,
    formState,
    categoryCreateState,
    deletingCategoryId,
    editingCategoryId,
    categoryEditState,
    setFormState,
    setCategoryCreateState,
    setCategoryEditState,
    formError,
    categoryCreateError,
    categoryUpdateError,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    enableScheduleEdit,
    handleStartScheduleEdit,
    handleCreateSubmit,
    handleDeleteSchedule,
    handleCreateCategory,
    handleStartCategoryEdit,
    handleCancelCategoryEdit,
    handleUpdateCategory,
    handleDeleteCategory,
    openCreateCategoryModal,
    closeCategoryModal,
  } = useScheduleEvents();

  const handleCreateModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeCreateScheduleModal();
      }
    },
    [closeCreateScheduleModal]
  );

  const handleCategoryModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeCategoryModal();
      }
    },
    [closeCategoryModal]
  );

  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          스케줄 관리
        </h1>
        <p className="mt-[6px] text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          수업, 시험, 상담 일정을 한눈에 확인하세요
        </p>
      </section>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none"
            onClick={openCreateScheduleModal}
          >
            <CalendarIcon className="h-5 w-5" />
            일정 생성
          </Button>
          <Button
            type="button"
            variant="default"
            className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
            onClick={() => setTimetableOpen(true)}
          >
            <LayoutGrid className="h-5 w-5" />
            시간표 보기
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px] xl:items-start">
          <ScheduleCalendar
            view={view}
            currentDate={currentDate}
            events={filteredEvents}
            onViewChange={setView}
            onNavigate={setCurrentDate}
            onSelectEvent={handleStartScheduleEdit}
          />
          <ScheduleSidebar
            categories={categories}
            filters={filters}
            onFilterChange={setFilters}
            todayEvents={todayEvents}
            onSelectTodayEvent={handleStartScheduleEdit}
            categoryLabelMap={categoryLabelMap}
            isCategoryActionLocked={
              isCategoryCreating || isCategoryUpdating || isCategoryDeleting
            }
            onOpenCreateCategoryModal={openCreateCategoryModal}
          />
        </div>

        {isSchedulesLoading ? (
          <p className="text-sm text-neutral-400">
            일정을 불러오는 중입니다...
          </p>
        ) : null}

        {loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : null}
      </div>

      <ScheduleCreateModal
        open={createOpen}
        onOpenChange={handleCreateModalOpenChange}
        categoryOptions={categories}
        isSubmitting={isScheduleCreating || isScheduleUpdating}
        mode={scheduleModalMode}
        isDeleting={isScheduleDeleting}
        formState={formState}
        onFormChange={setFormState}
        formError={formError}
        onEnableEdit={enableScheduleEdit}
        onSubmit={handleCreateSubmit}
        onDelete={handleDeleteSchedule}
      />

      <ScheduleCategoryManageModal
        open={isCategoryModalOpen}
        categories={categories}
        isCategoryCreating={isCategoryCreating}
        isCategoryUpdating={isCategoryUpdating}
        deletingCategoryId={deletingCategoryId}
        categoryCreateState={categoryCreateState}
        onCategoryCreateStateChange={setCategoryCreateState}
        categoryCreateError={categoryCreateError}
        onCreateCategory={handleCreateCategory}
        editingCategoryId={editingCategoryId}
        categoryEditState={categoryEditState}
        onCategoryEditStateChange={setCategoryEditState}
        categoryUpdateError={categoryUpdateError}
        onStartCategoryEdit={handleStartCategoryEdit}
        onCancelCategoryEdit={handleCancelCategoryEdit}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onOpenChange={handleCategoryModalOpenChange}
      />

      <ScheduleTimetableModal
        open={timetableOpen}
        onOpenChange={setTimetableOpen}
        entries={timetableEntries}
        meta={timetableMeta}
        isLoading={isTimetableLoading}
        errorMessage={timetableError}
      />
    </div>
  );
}
