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
import { ButtonGroup } from "@/components/ui/button-group";
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

type ScheduleCalendarProps = {
  view: View;
  currentDate: Date;
  events: ScheduleCalendarEvent[];
  onViewChange: (view: View) => void;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: ScheduleCalendarEvent) => void;
};

const getReadableTextColor = (hexColor: string) => {
  const normalized = hexColor.replace("#", "");
  if (normalized.length !== 6) {
    return "#1f2937";
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance >= 160 ? "#1f2937" : "#ffffff";
};

function CalendarToolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<ScheduleCalendarEvent, object>) {
  const label = format(date, "yyyy년 M월", { locale: ko });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 pb-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => onNavigate("PREV")}
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => onNavigate("NEXT")}
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="default"
          onClick={() => onNavigate("TODAY")}
        >
          오늘
        </Button>
        <span className="ml-2 text-lg font-semibold text-foreground">
          {label}
        </span>
      </div>
      <ButtonGroup className="rounded-lg border border-input bg-background p-1 shadow-sm">
        {[{ label: "월별", value: Views.MONTH }].map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={view === option.value ? "default" : "outline"}
            size="default"
            className={cn(
              "h-8 px-4 text-sm font-semibold",
              view === option.value
                ? "bg-primary text-primary-foreground"
                : "border-transparent"
            )}
            onClick={() => onView(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
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
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
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
              backgroundColor: event.categoryColor,
              color: getReadableTextColor(event.categoryColor),
            },
          })}
          components={{
            toolbar: CalendarToolbar,
          }}
          messages={calendarMessages}
          className="eduops-calendar"
          style={{ height: 720 }}
        />
      </CardContent>
    </Card>
  );
}

export const ScheduleCalendar = memo(ScheduleCalendarComponent);
ScheduleCalendar.displayName = "ScheduleCalendar";
