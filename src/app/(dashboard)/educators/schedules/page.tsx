"use client";

import { useCallback } from "react";
import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
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
      <SectionHeader
        title="스케줄 관리"
        description="수업, 시험, 상담 일정을 한눈에 확인하세요."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2"
              onClick={openCreateScheduleModal}
            >
              <CalendarIcon className="h-4 w-4" />
              일정 생성
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-10 gap-2"
              onClick={() => setTimetableOpen(true)}
            >
              <LayoutGrid className="h-4 w-4" />
              시간표 보기
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
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
        <p className="text-sm text-muted-foreground">
          일정을 불러오는 중입니다...
        </p>
      ) : null}

      {loadError ? (
        <p className="text-sm text-destructive">{loadError}</p>
      ) : null}

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
