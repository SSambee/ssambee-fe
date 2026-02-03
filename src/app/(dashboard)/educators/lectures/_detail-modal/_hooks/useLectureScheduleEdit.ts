"use client";

import { useCallback, useMemo, useState } from "react";

import { WEEKDAY_OPTIONS } from "@/constants/lectures.constants";
import type { LectureSchedule, LectureTime } from "@/types/lectures";

import type { EditTimeRow } from "./types";

export const useLectureScheduleEdit = () => {
  const [localSchedule, setLocalSchedule] = useState<LectureSchedule>({
    days: [],
    time: "일정 없음",
  });
  const [editTimes, setEditTimes] = useState<EditTimeRow[]>([]);

  const dayOptions = useMemo(() => [...WEEKDAY_OPTIONS], []);

  const createTimeRow = useCallback(
    (overrides?: Partial<EditTimeRow>): EditTimeRow => ({
      id: `${Date.now()}-${Math.random()}`,
      day: "",
      startTime: "",
      endTime: "",
      ...overrides,
    }),
    []
  );

  const handleAddSchedule = useCallback(() => {
    setEditTimes((prev) => [...prev, createTimeRow()]);
  }, [createTimeRow]);

  const handleRemoveSchedule = useCallback((id: string) => {
    setEditTimes((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleScheduleChange = useCallback(
    (id: string, field: keyof Omit<EditTimeRow, "id">, value: string) => {
      setEditTimes((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    },
    []
  );

  const scheduleSummary = useCallback(
    (fallbackSchedule: LectureSchedule, isEditing: boolean): string => {
      const source = isEditing ? localSchedule : fallbackSchedule;
      if (source.days.length === 0) return "일정 없음";
      return `${source.days.join(", ")} · ${source.time}`;
    },
    [localSchedule]
  );

  const buildScheduleFromTimes = useCallback((): LectureSchedule => {
    const validRows = editTimes.filter(
      (row) => row.day && row.startTime && row.endTime
    );
    if (validRows.length === 0) {
      return { days: [], time: "일정 없음" };
    }
    const days = validRows.map((row) => row.day);
    const [first] = validRows;
    const isSameTime = validRows.every(
      (row) =>
        row.startTime === first.startTime && row.endTime === first.endTime
    );
    const time = isSameTime
      ? `${first.startTime} - ${first.endTime}`
      : "시간표 상이";
    return { days, time };
  }, [editTimes]);

  const resetSchedule = useCallback(
    (schedule: LectureSchedule, lectureTimes?: LectureTime[]) => {
      setLocalSchedule(schedule);

      if (lectureTimes && lectureTimes.length > 0) {
        const rows = lectureTimes.map((time) =>
          createTimeRow({
            day: time.day ?? "",
            startTime: time.startTime ?? "",
            endTime: time.endTime ?? "",
          })
        );
        setEditTimes(rows);
        return;
      }

      if (schedule.days.length > 0) {
        const [startTime, endTime] = schedule.time
          .split("-")
          .map((v) => v.trim());
        const rows = schedule.days.map((day) =>
          createTimeRow({
            day,
            startTime: startTime || "",
            endTime: endTime || "",
          })
        );
        setEditTimes(rows);
      } else {
        setEditTimes([createTimeRow()]);
      }
    },
    [createTimeRow]
  );

  const hasInvalidSchedule = useCallback(() => {
    return editTimes.some((row) => !row.day || !row.startTime || !row.endTime);
  }, [editTimes]);

  const getValidLectureTimes = useCallback(() => {
    return editTimes
      .filter((row) => row.day && row.startTime && row.endTime)
      .map((row) => ({
        day: row.day,
        startTime: row.startTime,
        endTime: row.endTime,
      }));
  }, [editTimes]);

  return {
    localSchedule,
    editTimes,
    dayOptions,
    handleAddSchedule,
    handleRemoveSchedule,
    handleScheduleChange,
    scheduleSummary,
    resetSchedule,
    setLocalSchedule,
    hasInvalidSchedule,
    getValidLectureTimes,
    buildScheduleFromTimes,
  };
};
