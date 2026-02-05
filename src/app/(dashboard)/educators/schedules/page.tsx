"use client";

import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { useScheduleEvents } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEvents";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { ScheduleCalendar } from "@/app/(dashboard)/educators/schedules/_components/ScheduleCalendar";
import { ScheduleSidebar } from "@/app/(dashboard)/educators/schedules/_components/ScheduleSidebar";
import { ScheduleCreateModal } from "@/app/(dashboard)/educators/schedules/_modals/ScheduleCreateModal";
import { ScheduleTimetableModal } from "@/app/(dashboard)/educators/schedules/_modals/ScheduleTimetableModal";

export default function EducatorsSchedulesPage() {
  useSetBreadcrumb([{ label: "스케줄 관리" }]);

  const {
    view,
    currentDate,
    filteredEvents,
    todayEvents,
    categoryLabelMap,
    filters,
    setView,
    setCurrentDate,
    setFilters,
    createOpen,
    setCreateOpen,
    timetableOpen,
    setTimetableOpen,
    formState,
    setFormState,
    formError,
    setFormError,
    handleCreateSubmit,
  } = useScheduleEvents();

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
              onClick={() => setCreateOpen(true)}
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
        />
        <ScheduleSidebar
          filters={filters}
          onFilterChange={setFilters}
          todayEvents={todayEvents}
          categoryLabelMap={categoryLabelMap}
        />
      </div>

      <ScheduleCreateModal
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            setFormError(null);
          }
        }}
        formState={formState}
        onFormChange={setFormState}
        formError={formError}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <ScheduleTimetableModal
        open={timetableOpen}
        onOpenChange={setTimetableOpen}
      />
    </div>
  );
}
