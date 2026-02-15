export type ScheduleCategoryOption = {
  id: string;
  name: string;
  color: string;
};

export type ScheduleCalendarEvent = {
  id: string;
  title: string;
  name: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  categoryId: string | null;
  categoryKey: string;
  categoryName: string;
  categoryColor: string;
  description?: string;
  timeLabel: string;
};

export type ScheduleFormState = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  categoryId: string;
  description: string;
};

export type ScheduleModalMode = "create" | "view" | "edit";

export type ScheduleCategoryCreateState = {
  name: string;
  color: string;
};

export type ScheduleCategoryEditState = {
  name: string;
  color: string;
};

export type ScheduleFilters = Record<string, boolean>;

export type ScheduleTimetableDay =
  | "월"
  | "화"
  | "수"
  | "목"
  | "금"
  | "토"
  | "일";

export type ScheduleTimetableEntry = {
  id: string;
  title: string;
  day: ScheduleTimetableDay;
  startTime: string;
  endTime: string;
  color: string;
};

export type ScheduleTimetableMeta = {
  academy: string;
  term: string;
};
