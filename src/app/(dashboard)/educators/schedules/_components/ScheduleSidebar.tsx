"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { scheduleCategoryOptions } from "@/data/schedules.mock";
import type { CalendarEvent } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEvents";
import type { ScheduleFilters } from "@/app/(dashboard)/educators/schedules/_hooks/useScheduleEvents";

type ScheduleSidebarProps = {
  filters: ScheduleFilters;
  onFilterChange: (
    updater: ScheduleFilters | ((prev: ScheduleFilters) => ScheduleFilters)
  ) => void;
  todayEvents: CalendarEvent[];
  categoryLabelMap: Record<string, string>;
};

export function ScheduleSidebar({
  filters,
  onFilterChange,
  todayEvents,
  categoryLabelMap,
}: ScheduleSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold">일정 필터</p>
            <p className="text-xs text-muted-foreground">
              표시할 일정 유형을 선택하세요.
            </p>
          </div>
          <div className="space-y-3">
            {scheduleCategoryOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                </span>
                <Checkbox
                  checked={filters[option.value]}
                  onCheckedChange={(checked) =>
                    onFilterChange((prev) => ({
                      ...prev,
                      [option.value]: Boolean(checked),
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
                <div key={event.id} className="flex gap-3">
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
                      {event.timeLabel} · {categoryLabelMap[event.category]}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            전체 일정 보기 →
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
