"use client";

import { type ReactNode, useCallback } from "react";

import { formatLectureTimes } from "@/utils/formatLectureTimes";

import { useLearnerLecturesPageActions } from "./useLearnerLecturesPageActions";
import {
  useLearnerLecturesPageResources,
  type LearnerLectureCard,
} from "./useLearnerLecturesPageResources";
import { useLearnerLecturesPageState } from "./useLearnerLecturesPageState";

type UseLearnerLecturesPageParams = {
  openModal: (node: ReactNode) => void;
  push: (href: string) => void;
};

export const useLearnerLecturesPage = ({
  openModal,
  push,
}: UseLearnerLecturesPageParams) => {
  const state = useLearnerLecturesPageState();
  const resources = useLearnerLecturesPageResources();
  const actions = useLearnerLecturesPageActions({
    openModal,
    push,
    lectureEnrollmentMap: resources.lectureEnrollmentMap,
    attendanceSummary: resources.attendanceSummary,
  });

  const getScheduleMeta = useCallback(
    (lectureTimes: LearnerLectureCard["lectureTimes"]) => {
      if (lectureTimes.length === 0) {
        return {
          hasSchedule: false,
          scheduleDays: "일정 없음",
          scheduleTime: "-",
        };
      }

      const firstTimeRange = `${lectureTimes[0].startTime} - ${lectureTimes[0].endTime}`;
      const hasSingleTimeRange = lectureTimes.every(
        (lectureTime) =>
          `${lectureTime.startTime} - ${lectureTime.endTime}` === firstTimeRange
      );

      if (hasSingleTimeRange) {
        return {
          hasSchedule: true,
          scheduleDays: lectureTimes
            .map((lectureTime) => lectureTime.day)
            .join(", "),
          scheduleTime: firstTimeRange,
        };
      }

      return {
        hasSchedule: false,
        scheduleDays: formatLectureTimes(lectureTimes),
        scheduleTime: "-",
      };
    },
    []
  );

  const isPending =
    resources.isProfilePending ||
    resources.isEnrollmentsPending ||
    resources.isLecturesPending;
  const isError =
    resources.isProfileError ||
    resources.isEnrollmentsError ||
    resources.isLecturesError ||
    !resources.profile;

  return {
    ...state,
    ...resources,
    ...actions,
    getScheduleMeta,
    isPending,
    isError,
  };
};
