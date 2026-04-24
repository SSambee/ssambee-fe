import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import type { View } from "react-big-calendar";

import type {
  CreateSchedulePayload,
  FetchSchedulesQuery,
  ScheduleApi,
  ScheduleCategoryApi,
  ScheduleCalendarEvent,
  ScheduleCategoryOption,
  ScheduleFormState,
  UpdateSchedulePayload,
} from "@/types/schedules";

export const OTHER_CATEGORY_KEY = "other";

const DEFAULT_OTHER_CATEGORY: ScheduleCategoryOption = {
  id: OTHER_CATEGORY_KEY,
  name: "기타",
  color: "#f59e0b",
};

const KST_TIMEZONE = "Asia/Seoul";

const KST_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  timeZone: KST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const KST_TIME_LABEL_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KST_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const toUtcIsoFromKstLocal = (date: string, time: string) =>
  new Date(`${date}T${time}+09:00`).toISOString();

const formatDateToUtcIsoFromKstCalendar = (date: Date) => {
  const parts = KST_DATE_TIME_FORMATTER.formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  const kstOffsetDateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;

  return new Date(kstOffsetDateTime).toISOString();
};

export const normalizeScheduleCategories = (
  categories: ScheduleCategoryApi[]
): ScheduleCategoryOption[] => {
  const normalized = categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
  }));

  const hasOther = normalized.some(
    (category) => category.id === OTHER_CATEGORY_KEY
  );

  if (!hasOther) {
    normalized.push(DEFAULT_OTHER_CATEGORY);
  }

  return normalized;
};

export const buildSchedulesRangeQuery = (
  currentDate: Date,
  view: View
): FetchSchedulesQuery => {
  const startDate =
    view === "week"
      ? startOfWeek(currentDate, { weekStartsOn: 0 })
      : startOfMonth(currentDate);
  const endDate =
    view === "week"
      ? endOfWeek(currentDate, { weekStartsOn: 0 })
      : endOfMonth(currentDate);

  return {
    startTime: formatDateToUtcIsoFromKstCalendar(startDate),
    endTime: formatDateToUtcIsoFromKstCalendar(endDate),
  };
};

export const mapScheduleFormToPayload = (
  formState: ScheduleFormState
): CreateSchedulePayload => {
  const startTime = formState.isAllDay
    ? toUtcIsoFromKstLocal(formState.date, "00:00:00")
    : toUtcIsoFromKstLocal(formState.date, `${formState.startTime}:00`);
  const endTime = formState.isAllDay
    ? toUtcIsoFromKstLocal(formState.date, "23:59:59")
    : toUtcIsoFromKstLocal(formState.date, `${formState.endTime}:00`);

  return {
    title: formState.title.trim(),
    memo: formState.description.trim() || undefined,
    startTime,
    endTime,
    categoryId:
      formState.categoryId === OTHER_CATEGORY_KEY
        ? undefined
        : formState.categoryId,
  };
};

export const mapScheduleFormToUpdatePayload = (
  formState: ScheduleFormState
): UpdateSchedulePayload => {
  const startTime = formState.isAllDay
    ? toUtcIsoFromKstLocal(formState.date, "00:00:00")
    : toUtcIsoFromKstLocal(formState.date, `${formState.startTime}:00`);
  const endTime = formState.isAllDay
    ? toUtcIsoFromKstLocal(formState.date, "23:59:59")
    : toUtcIsoFromKstLocal(formState.date, `${formState.endTime}:00`);

  return {
    title: formState.title.trim(),
    memo: formState.description.trim() || undefined,
    startTime,
    endTime,
    categoryId:
      formState.categoryId === OTHER_CATEGORY_KEY ? null : formState.categoryId,
  };
};

const getCategoryFallback = (
  schedule: ScheduleApi,
  categoryMap: Map<string, ScheduleCategoryOption>
) => {
  if (!schedule.categoryId) {
    return DEFAULT_OTHER_CATEGORY;
  }

  return (
    categoryMap.get(schedule.categoryId) ?? {
      id: schedule.categoryId,
      name: "미분류",
      color: "#94a3b8",
    }
  );
};

export const mapScheduleApiToCalendarEvent = (
  schedule: ScheduleApi,
  categoryMap: Map<string, ScheduleCategoryOption>
): ScheduleCalendarEvent | null => {
  const start = new Date(schedule.startTime);
  const end = new Date(schedule.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const kstStartLabel = KST_TIME_LABEL_FORMATTER.format(start);
  const kstEndLabel = KST_TIME_LABEL_FORMATTER.format(end);
  const isAllDay = kstStartLabel === "00:00" && kstEndLabel === "23:59";

  const category =
    schedule.category && schedule.categoryId
      ? {
          id: schedule.categoryId,
          name: schedule.category.name,
          color: schedule.category.color,
        }
      : getCategoryFallback(schedule, categoryMap);

  return {
    id: schedule.id,
    title: isAllDay ? schedule.title : `${kstStartLabel} ${schedule.title}`,
    name: schedule.title,
    start,
    end,
    allDay: isAllDay,
    categoryId: schedule.categoryId ?? null,
    categoryKey: schedule.categoryId ?? OTHER_CATEGORY_KEY,
    categoryName: category.name,
    categoryColor: category.color,
    description: schedule.memo ?? undefined,
    timeLabel: isAllDay ? "종일" : `${kstStartLabel} - ${kstEndLabel}`,
  };
};
