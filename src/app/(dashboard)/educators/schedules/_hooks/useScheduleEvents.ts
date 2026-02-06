"use client";

import { useMemo, useState } from "react";
import type { View } from "react-big-calendar";
import { format, isSameDay } from "date-fns";

import {
  scheduleCategoryOptions,
  scheduleSeeds,
  type ScheduleCategory,
} from "@/data/schedules.mock";

export type CalendarEvent = {
  id: string;
  title: string;
  name: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  category: ScheduleCategory;
  description?: string;
  timeLabel: string;
};

const buildInitialEvents = (): CalendarEvent[] =>
  scheduleSeeds.map((seed) => {
    const start = new Date(`${seed.date}T${seed.time}:00`);
    const displayTitle = `${seed.time} ${seed.title}`;

    return {
      id: seed.id,
      title: displayTitle,
      name: seed.title,
      start,
      end: start,
      allDay: true,
      category: seed.category,
      description: seed.description,
      timeLabel: seed.time,
    };
  });

export type ScheduleFormState = {
  title: string;
  date: string;
  time: string;
  category: ScheduleCategory;
  description: string;
};

export type ScheduleFilters = Record<ScheduleCategory, boolean>;

export function useScheduleEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    buildInitialEvents()
  );
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const [timetableOpen, setTimetableOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>({
    title: "",
    date: "",
    time: "",
    category: "exam" as ScheduleCategory,
    description: "",
  });
  const [filters, setFilters] = useState<ScheduleFilters>({
    exam: true,
    clinic: true,
    misc: true,
  });

  const categoryLabelMap = useMemo(() => {
    return scheduleCategoryOptions.reduce<Record<ScheduleCategory, string>>(
      (acc, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {} as Record<ScheduleCategory, string>
    );
  }, []);

  const filteredEvents = useMemo(
    () => events.filter((event) => filters[event.category]),
    [events, filters]
  );

  const todayEvents = useMemo(() => {
    const today = new Date();
    return filteredEvents
      .filter((event) => isSameDay(event.start, today))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [filteredEvents]);

  const handleCreateSubmit = () => {
    if (!formState.title || !formState.date || !formState.time) {
      setFormError("일정 제목, 날짜, 시간을 모두 입력해 주세요.");
      return;
    }

    const start = new Date(`${formState.date}T${formState.time}:00`);
    const newEvent: CalendarEvent = {
      id: `schedule-${Date.now()}`,
      title: `${formState.time} ${formState.title}`,
      name: formState.title,
      start,
      end: start,
      allDay: true,
      category: formState.category,
      description: formState.description || undefined,
      timeLabel: formState.time,
    };

    setEvents((prev) => [...prev, newEvent]);
    setCurrentDate(start);
    setCreateOpen(false);
    setFormState({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      category: "exam",
      description: "",
    });
    setFormError(null);
  };

  return {
    view,
    currentDate,
    events,
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
  };
}
