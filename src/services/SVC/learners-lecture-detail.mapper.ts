import type { LearnerEnrollmentApi } from "@/types/learners-enrollment.api";

export type LearnerLectureSummaryVM = {
  title: string;
  instructorId: string;
  lectureTimes: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
};

export const findLectureSummaryFromEnrollments = ({
  lectureKey,
  resolvedLectureEnrollmentId,
  enrollments,
}: {
  lectureKey: string;
  resolvedLectureEnrollmentId?: string;
  enrollments: LearnerEnrollmentApi[];
}): LearnerLectureSummaryVM | null => {
  const candidateKeys = new Set<string>([lectureKey]);

  if (resolvedLectureEnrollmentId) {
    candidateKeys.add(resolvedLectureEnrollmentId);
  }

  for (const enrollment of enrollments) {
    for (const lectureEnrollment of enrollment.lectureEnrollments ?? []) {
      const lectureEnrollmentId =
        lectureEnrollment.id ?? lectureEnrollment.lectureEnrollmentId;
      const lectureId =
        lectureEnrollment.lectureId ?? lectureEnrollment.lecture?.id;

      if (
        (lectureEnrollmentId && candidateKeys.has(lectureEnrollmentId)) ||
        (lectureId && candidateKeys.has(lectureId))
      ) {
        return {
          title: lectureEnrollment.lecture?.title ?? "강의 상세",
          instructorId: lectureEnrollment.lecture?.instructorId ?? "",
          lectureTimes: (lectureEnrollment.lecture?.lectureTimes ?? []).map(
            (lectureTime) => ({
              day: lectureTime.day,
              startTime: lectureTime.startTime,
              endTime: lectureTime.endTime,
            })
          ),
        };
      }
    }
  }

  return null;
};
