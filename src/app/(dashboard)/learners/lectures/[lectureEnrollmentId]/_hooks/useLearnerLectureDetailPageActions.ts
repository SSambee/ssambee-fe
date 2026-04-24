"use client";

import { useCallback } from "react";

import type { LectureEnrollmentDetail } from "@/types/students.type";

type UseLearnerLectureDetailPageActionsParams = {
  push: (href: string) => void;
  effectiveLectureEnrollmentId: string;
};

export const useLearnerLectureDetailPageActions = ({
  push,
  effectiveLectureEnrollmentId,
}: UseLearnerLectureDetailPageActionsParams) => {
  const handleOpenExamDetail = useCallback(
    (examItem: LectureEnrollmentDetail["grades"][number]) => {
      const detailKey = examItem.exam.id || examItem.gradeId;

      if (!detailKey) {
        return;
      }

      push(
        `/learners/lectures/${effectiveLectureEnrollmentId}/exams/${detailKey}`
      );
    },
    [effectiveLectureEnrollmentId, push]
  );

  const handleMoveList = useCallback(() => {
    push("/learners/lectures");
  }, [push]);

  return {
    handleOpenExamDetail,
    handleMoveList,
  };
};
