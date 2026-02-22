"use client";

import { memo } from "react";
import {
  Calendar,
  Views,
  dateFnsLocalizer,
  type ToolbarProps,
  type View,
} from "react-big-calendar";
import { format, getDay, isSameDay, parse, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScheduleCalendarEvent } from "@/types/schedules";

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const calendarMessages = {
  today: "오늘",
  previous: "이전",
  next: "다음",
  month: "월",
  day: "일",
  date: "날짜",
  time: "시간",
  event: "일정",
  noEventsInRange: "표시할 일정이 없습니다.",
};

const toRgba = (hexColor: string, alpha: number) => {
  const normalized = hexColor.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return `rgba(56, 99, 246, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type ScheduleCalendarProps = {
  view: View;
  currentDate: Date;
  events: ScheduleCalendarEvent[];
  onViewChange: (view: View) => void;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: ScheduleCalendarEvent) => void;
};

function CalendarEvent({ event }: { event: ScheduleCalendarEvent }) {
  const compactLabel =
    event.allDay || event.timeLabel === "종일"
      ? event.name
      : `${event.timeLabel} · ${event.name}`;

  return (
    <div className="eduops-calendar-event-card">
      <p className="eduops-calendar-event-title">{compactLabel}</p>
    </div>
  );
}

function CalendarToolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<ScheduleCalendarEvent, object>) {
  const label = format(date, "yyyy년 M월", { locale: ko });

  return (
    <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <Button
        type="button"
        variant="outline"
        size="default"
        className="h-14 w-[100px] rounded-xl border-neutral-100 bg-surface-normal-light-alternative text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:bg-neutral-100"
        onClick={() => onNavigate("TODAY")}
      >
        오늘
      </Button>

      <div className="flex items-center justify-center gap-8">
        <Button
          type="button"
          variant="outline"
          size="default"
          className="h-10 w-10 rounded-full border-transparent p-0 text-neutral-500 shadow-none hover:bg-neutral-100"
          onClick={() => onNavigate("PREV")}
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="default"
          className="h-10 w-10 rounded-full border-transparent p-0 text-neutral-500 shadow-none hover:bg-neutral-100"
          onClick={() => onNavigate("NEXT")}
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <span className="text-xl font-bold tracking-[-0.02em] text-neutral-700 md:text-[22px] md:leading-[30px]">
          {label}
        </span>
      </div>

      <div className="flex items-center rounded-[20px] bg-neutral-50 p-2">
        <button
          type="button"
          className="h-[42px] w-[100px] rounded-xl bg-neutral-700 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)]"
          onClick={() => onView(Views.MONTH)}
          aria-pressed={view === Views.MONTH}
        >
          월별
        </button>
      </div>
    </div>
  );
}

function ScheduleCalendarComponent({
  view,
  currentDate,
  events,
  onViewChange,
  onNavigate,
  onSelectEvent,
}: ScheduleCalendarProps) {
  return (
    <Card className="rounded-[24px] border border-neutral-100 shadow-none">
      <CardContent className="p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH]}
          view={view}
          date={currentDate}
          onView={(nextView: View) => onViewChange(nextView)}
          onNavigate={(nextDate: Date) => onNavigate(nextDate)}
          onSelectEvent={onSelectEvent}
          popup
          tooltipAccessor={(event: ScheduleCalendarEvent) =>
            event.description ?? event.title
          }
          dayPropGetter={(date: Date) => {
            const isWeekend = [0, 6].includes(date.getDay());
            const isToday = isSameDay(date, new Date());
            return {
              className: cn(
                "eduops-calendar-day",
                isWeekend && "is-weekend",
                isToday && "is-today"
              ),
            };
          }}
          eventPropGetter={(event: ScheduleCalendarEvent) => ({
            className: "eduops-calendar-event",
            style: {
              backgroundColor: toRgba(event.categoryColor, 0.16),
              color: "#4a4d5c",
              border: `2px solid ${event.categoryColor}`,
            },
          })}
          components={{
            toolbar: CalendarToolbar,
            event: CalendarEvent,
          }}
          messages={calendarMessages}
          className="eduops-calendar"
          style={{ height: 872 }}
        />
      </CardContent>
    </Card>
  );
}

export const ScheduleCalendar = memo(ScheduleCalendarComponent);
ScheduleCalendar.displayName = "ScheduleCalendar";
