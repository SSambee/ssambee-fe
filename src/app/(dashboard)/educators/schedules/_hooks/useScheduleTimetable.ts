"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchLecturesAPI } from "@/services/lectures/lectures.service";
import type {
  ScheduleTimetableDay,
  ScheduleTimetableEntry,
  ScheduleTimetableMeta,
} from "@/types/schedules";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

const TIMETABLE_COLOR_MIN_SATURATION = 64;
const TIMETABLE_COLOR_SATURATION_RANGE = 12;
const TIMETABLE_COLOR_MIN_LIGHTNESS = 82;
const TIMETABLE_COLOR_LIGHTNESS_RANGE = 8;

const TIMETABLE_DAY_ORDER: Record<ScheduleTimetableDay, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
};

const DAY_ALIAS_MAP: Record<string, ScheduleTimetableDay> = {
  월: "월",
  화: "화",
  수: "수",
  목: "목",
  금: "금",
  토: "토",
  일: "일",
  MON: "월",
  MONDAY: "월",
  TUE: "화",
  TUESDAY: "화",
  WED: "수",
  WEDNESDAY: "수",
  THU: "목",
  THURSDAY: "목",
  FRI: "금",
  FRIDAY: "금",
  SAT: "토",
  SATURDAY: "토",
  SUN: "일",
  SUNDAY: "일",
};

const getTimetableErrorMessage = (error: unknown) => {
  const normalizedError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  if (typeof normalizedError.response?.data?.message === "string") {
    return normalizedError.response.data.message;
  }

  if (typeof normalizedError.message === "string" && normalizedError.message) {
    return normalizedError.message;
  }

  return "시간표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

const normalizeLectureDay = (
  day?: string | null
): ScheduleTimetableDay | null => {
  const normalizedDay = day?.trim();
  if (!normalizedDay) {
    return null;
  }

  return (
    DAY_ALIAS_MAP[normalizedDay] ??
    DAY_ALIAS_MAP[normalizedDay.toUpperCase()] ??
    null
  );
};

const normalizeLectureTime = (time?: string | null) => {
  const normalizedTime = time?.trim();
  if (!normalizedTime) {
    return null;
  }

  const [hourRaw, minuteRaw] = normalizedTime.split(":");

  if (hourRaw === undefined || minuteRaw === undefined) {
    return null;
  }

  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const getHashBySeed = (seed: string) => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const getTimetableColorBySeed = (seed: string) => {
  const hash = getHashBySeed(seed);
  const hue = hash % 360;
  const saturation =
    TIMETABLE_COLOR_MIN_SATURATION + (hash % TIMETABLE_COLOR_SATURATION_RANGE);
  const lightness =
    TIMETABLE_COLOR_MIN_LIGHTNESS +
    (Math.floor(hash / 360) % TIMETABLE_COLOR_LIGHTNESS_RANGE);

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

const isServerColorHex = (value: string) => HEX_COLOR_REGEX.test(value);

const isServerColorValid = (value: string) => {
  if (isServerColorHex(value)) {
    return true;
  }

  if (
    typeof window !== "undefined" &&
    typeof window.CSS !== "undefined" &&
    typeof window.CSS.supports === "function"
  ) {
    return window.CSS.supports("color", value);
  }

  return false;
};

const getTimetableColor = (lectureId: string, serverColor?: string | null) => {
  const normalizedServerColor = serverColor?.trim();

  if (normalizedServerColor && isServerColorValid(normalizedServerColor)) {
    return isServerColorHex(normalizedServerColor)
      ? normalizedServerColor.toUpperCase()
      : normalizedServerColor;
  }

  return getTimetableColorBySeed(lectureId);
};

export function useScheduleTimetable() {
  const [timetableOpen, setTimetableOpen] = useState(false);
  const [timetableEntries, setTimetableEntries] = useState<
    ScheduleTimetableEntry[]
  >([]);
  const [timetableMeta, setTimetableMeta] = useState<ScheduleTimetableMeta>({
    academy: "개설 강의 시간표",
    term: `${new Date().getFullYear()} 주간 시간표`,
  });
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);

  const loadTimetable = useCallback(async () => {
    setIsTimetableLoading(true);

    try {
      const response = await fetchLecturesAPI({
        page: 1,
        limit: 100,
      });

      const nextEntries = response.lectures
        .flatMap((lecture, lectureIndex) => {
          return (lecture.lectureTimes ?? []).flatMap(
            (lectureTime, timeIndex) => {
              const day = normalizeLectureDay(lectureTime.day);
              const startTime = normalizeLectureTime(lectureTime.startTime);
              const endTime = normalizeLectureTime(lectureTime.endTime);

              if (!day || !startTime || !endTime) {
                return [];
              }

              return {
                id: `${lecture.id}-${lectureIndex}-${timeIndex}`,
                title: lecture.title,
                day,
                startTime,
                endTime,
                color: getTimetableColor(lecture.id, lecture.color),
              };
            }
          );
        })
        .sort((a, b) => {
          const dayOrderDiff =
            TIMETABLE_DAY_ORDER[a.day] - TIMETABLE_DAY_ORDER[b.day];
          if (dayOrderDiff !== 0) {
            return dayOrderDiff;
          }

          return a.startTime.localeCompare(b.startTime);
        });

      const firstInstructorName = response.lectures.find((lecture) => {
        return (
          typeof lecture.instructorName === "string" &&
          lecture.instructorName.trim().length > 0
        );
      })?.instructorName;

      setTimetableEntries(nextEntries);
      setTimetableMeta({
        academy: firstInstructorName
          ? `${firstInstructorName} 강사 개설 시간표`
          : "개설 강의 시간표",
        term: `${new Date().getFullYear()} 주간 시간표`,
      });
      setTimetableError(null);
    } catch (error) {
      setTimetableEntries([]);
      setTimetableError(getTimetableErrorMessage(error));
    } finally {
      setIsTimetableLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!timetableOpen) {
      return;
    }

    void loadTimetable();
  }, [loadTimetable, timetableOpen]);

  return {
    timetableOpen,
    setTimetableOpen,
    timetableEntries,
    timetableMeta,
    isTimetableLoading,
    timetableError,
    reloadTimetable: loadTimetable,
  };
}
