"use client";

import { useMemo } from "react";

import { useLearnerLectureDetailPageActions } from "./useLearnerLectureDetailPageActions";
import { useLearnerLectureDetailPageResources } from "./useLearnerLectureDetailPageResources";
import { useLearnerLectureDetailPageState } from "./useLearnerLectureDetailPageState";

type UseLearnerLectureDetailPageParams = {
  lectureKey: string;
  push: (href: string) => void;
};

export const useLearnerLectureDetailPage = ({
  lectureKey,
  push,
}: UseLearnerLectureDetailPageParams) => {
  const state = useLearnerLectureDetailPageState();
  const resources = useLearnerLectureDetailPageResources({ lectureKey });
  const actions = useLearnerLectureDetailPageActions({
    push,
    effectiveLectureEnrollmentId: resources.effectiveLectureEnrollmentId,
  });

  const lecture = resources.lectureDetail?.lecture;
  const grades = resources.lectureDetail?.grades ?? [];

  const displayLectureTitle =
    lecture?.title ?? resources.lectureTitle ?? "강의 상세";
  const displayLectureSubject = lecture?.subject ?? "과목 정보";

  const displayInstructorName = useMemo(() => {
    if (lecture?.instructor?.name) {
      return lecture.instructor.name;
    }

    const fallbackInstructor = resources.profile?.instructors?.find(
      (item) => item.id === resources.lectureFromEnrollments?.instructorId
    );

    return fallbackInstructor?.name ?? "담당 강사";
  }, [
    lecture?.instructor?.name,
    resources.lectureFromEnrollments?.instructorId,
    resources.profile?.instructors,
  ]);

  return {
    ...state,
    ...resources,
    ...actions,
    lecture,
    grades,
    displayLectureTitle,
    displayLectureSubject,
    displayInstructorName,
  };
};
