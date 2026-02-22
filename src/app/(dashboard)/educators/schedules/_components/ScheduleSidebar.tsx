"use client";

import { memo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type {
  ScheduleCalendarEvent,
  ScheduleCategoryOption,
  ScheduleFilters,
} from "@/types/schedules";

type ScheduleSidebarProps = {
  categories: ScheduleCategoryOption[];
  filters: ScheduleFilters;
  onFilterChange: (
    updater: ScheduleFilters | ((prev: ScheduleFilters) => ScheduleFilters)
  ) => void;
  todayEvents: ScheduleCalendarEvent[];
  onSelectTodayEvent: (event: ScheduleCalendarEvent) => void;
  categoryLabelMap: Record<string, string>;
  isCategoryActionLocked: boolean;
  onOpenCreateCategoryModal: () => void;
};

function ScheduleSidebarComponent({
  categories,
  filters,
  onFilterChange,
  todayEvents,
  onSelectTodayEvent,
  categoryLabelMap,
  isCategoryActionLocked,
  onOpenCreateCategoryModal,
}: ScheduleSidebarProps) {
  return (
    <div className="space-y-5">
      <Card className="rounded-[20px] border border-neutral-100 shadow-none">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xl font-bold tracking-[-0.02em] text-neutral-700">
                일정 필터
              </p>
              <p className="mt-1 text-sm font-medium tracking-[-0.01em] text-neutral-400">
                표시할 일정 분류를 선택하세요
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="default"
              className="h-10 w-10 rounded-lg border-brand-50 p-0 text-brand-700 shadow-none hover:bg-brand-25"
              aria-label="분류 추가"
              onClick={onOpenCreateCategoryModal}
              disabled={isCategoryActionLocked}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map((option) => (
              <label
                key={option.id}
                htmlFor={`schedule-filter-${option.id}`}
                className="flex items-center justify-between rounded-xl px-1 py-1 transition-colors hover:bg-neutral-50"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: option.color }}
                    aria-hidden
                  />
                  <span className="text-lg font-semibold tracking-[-0.01em] text-neutral-700">
                    {option.name}
                  </span>
                </span>
                <Checkbox
                  id={`schedule-filter-${option.id}`}
                  className="h-8 w-8 rounded-lg border-2 border-label-disable data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
                  checked={filters[option.id] ?? true}
                  onCheckedChange={(checked) =>
                    onFilterChange((prev) => ({
                      ...prev,
                      [option.id]: Boolean(checked),
                    }))
                  }
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[20px] border border-neutral-100 shadow-none">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-bold tracking-[-0.02em] text-neutral-700">
              오늘 일정
            </p>
            <button
              type="button"
              className="cursor-not-allowed rounded-full px-2.5 py-1 text-sm font-semibold text-neutral-300 opacity-60"
              aria-disabled="true"
              disabled
              title="준비 중"
            >
              전체 일정보기
            </button>
          </div>

          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-sm text-neutral-400">오늘 일정이 없습니다.</p>
            ) : (
              todayEvents.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-1 py-1 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onSelectTodayEvent(event)}
                >
                  <div
                    className={cn(
                      "flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-3",
                      index === 0
                        ? "border-brand-50 bg-brand-25"
                        : "border-neutral-100 bg-surface-elevated-light"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-semibold leading-5 tracking-[-0.01em]",
                        index === 0 ? "text-neutral-600" : "text-neutral-500"
                      )}
                    >
                      {format(event.start, "M월", { locale: ko })}
                    </span>
                    <span
                      className={cn(
                        "text-xl font-bold leading-7 tracking-[-0.02em]",
                        index === 0 ? "text-brand-700" : "text-neutral-600"
                      )}
                    >
                      {format(event.start, "d", { locale: ko })}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="truncate text-base font-semibold leading-6 tracking-[-0.01em] text-neutral-700">
                      {event.name}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold leading-5 tracking-[-0.01em] text-neutral-400">
                      {event.timeLabel} ·{" "}
                      {categoryLabelMap[event.categoryKey] ??
                        event.categoryName}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const ScheduleSidebar = memo(ScheduleSidebarComponent);
ScheduleSidebar.displayName = "ScheduleSidebar";
