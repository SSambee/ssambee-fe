"use client";

import { memo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">일정 필터</p>
              <p className="text-xs text-muted-foreground">
                표시할 일정 유형을 선택하세요.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="default"
              className="h-8 w-8 p-0"
              aria-label="분류 추가"
              onClick={onOpenCreateCategoryModal}
              disabled={isCategoryActionLocked}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.name}
                </span>
                <Checkbox
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

      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold">다가오는 일정 (오늘)</p>
            <p className="text-xs text-muted-foreground">
              오늘 예정된 일정만 모아봤어요.
            </p>
          </div>
          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                오늘 일정이 없습니다.
              </p>
            ) : (
              todayEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="flex w-full gap-3 rounded-md text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onSelectTodayEvent(event)}
                >
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-brand-25 text-brand-700">
                    <span className="text-[10px] font-semibold">
                      {format(event.start, "M월", { locale: ko })}
                    </span>
                    <span className="text-sm font-bold">
                      {format(event.start, "d", { locale: ko })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
