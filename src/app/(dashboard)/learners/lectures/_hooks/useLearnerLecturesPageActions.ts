"use client";

import { createElement, type ReactNode, useCallback } from "react";

import type { AttendanceList } from "@/types/students.type";

import AttendanceDetailModal from "../_components/AttendanceDetailModal";
import type { LectureEnrollmentResolutionMap } from "../_lib/resolveLectureEnrollment";

import type {
  LearnerLectureAttendanceSummary,
  LearnerLectureCard,
} from "./useLearnerLecturesPageResources";

type UseLearnerLecturesPageActionsParams = {
  openModal: (node: ReactNode) => void;
  push: (href: string) => void;
  lectureEnrollmentMap: LectureEnrollmentResolutionMap;
  attendanceSummary?: LearnerLectureAttendanceSummary;
};

export const useLearnerLecturesPageActions = ({
  openModal,
  push,
  lectureEnrollmentMap,
  attendanceSummary,
}: UseLearnerLecturesPageActionsParams) => {
  const handleOpenAttendanceDetail = useCallback(
    (studentName: string, attendancesList: AttendanceList[]) => {
      openModal(
        createElement(AttendanceDetailModal, {
          studentName,
          attendancesList,
        })
      );
    },
    [openModal]
  );

  const handleMoveLectureDetail = useCallback(
    (lecture: LearnerLectureCard) => {
      const lectureId = lecture.id;
      const lectureEnrollmentId =
        lecture.lectureEnrollmentId ??
        lectureEnrollmentMap[lectureId]?.lectureEnrollmentId ??
        attendanceSummary?.lectureEnrollmentIdByLectureId?.[lectureId];

      if (!lectureEnrollmentId) {
        return;
      }

      push(`/learners/lectures/${lectureEnrollmentId}`);
    },
    [
      attendanceSummary?.lectureEnrollmentIdByLectureId,
      lectureEnrollmentMap,
      push,
    ]
  );

  return {
    handleOpenAttendanceDetail,
    handleMoveLectureDetail,
  };
};
