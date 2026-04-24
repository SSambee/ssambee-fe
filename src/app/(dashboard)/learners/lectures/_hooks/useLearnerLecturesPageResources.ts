"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { learnerLectureKeys } from "@/constants/query-keys";
import { useMyEnrollmentsSVC } from "@/hooks/SVC/useEnrollmentsSVC";
import { useMyLearnerProfile } from "@/hooks/profile/useMyLearnerProfile";
import {
  fetchEnrollmentLectureEnrollmentsSVC,
  fetchLectureEnrollmentDetailSVC,
} from "@/services/SVC/enrollments.service";
import {
  sortAttendanceRecordsDesc,
  summarizeLectureAttendances,
  toLearnerLectureCard,
  type LearnerLectureCardVM,
} from "@/services/SVC/learners-lectures.mapper";
import type { AttendanceList } from "@/types/students.type";
import type { LearnerEnrollmentApi } from "@/types/learners-enrollment.api";

import {
  buildLectureEnrollmentResolutionMap,
  resolveLectureEnrollmentFromLectureId,
  type LectureEnrollmentResolutionMap,
} from "../_lib/resolveLectureEnrollment";

export type LearnerLectureCard = LearnerLectureCardVM;

export type LearnerLectureAttendanceSummary = {
  lateCount: number;
  absentCount: number;
  attendanceRate: number | null;
  records: AttendanceList[];
  lectureEnrollmentIdByLectureId: Record<string, string>;
};

const STALE_TIME_MS = 1000 * 60;
const EMPTY_ENROLLMENTS: LearnerEnrollmentApi[] = [];

export const useLearnerLecturesPageResources = () => {
  const {
    profile,
    isPending: isProfilePending,
    isError: isProfileError,
  } = useMyLearnerProfile();
  const isParentUser = profile?.userType === "PARENT";
  const activeChildId = isParentUser ? (profile?.children?.[0]?.id ?? "") : "";
  const learnerPhone = isParentUser ? undefined : profile?.phone;
  const learnerName = isParentUser ? undefined : profile?.name;
  const shouldFetchEnrollments =
    !!profile && (!isParentUser || !!activeChildId);

  const enrollmentsQuery = useMyEnrollmentsSVC({
    userType: profile?.userType,
    childId: activeChildId,
    enabled: shouldFetchEnrollments,
  });
  const enrollments = enrollmentsQuery.data ?? EMPTY_ENROLLMENTS;
  const isEnrollmentsPending = shouldFetchEnrollments
    ? enrollmentsQuery.isPending
    : false;
  const isEnrollmentsError = shouldFetchEnrollments
    ? enrollmentsQuery.isError
    : false;

  const {
    data: lectures = [],
    isPending: isLecturesPending,
    isError: isLecturesError,
  } = useQuery({
    queryKey: [
      ...learnerLectureKeys.enrollmentsSource(
        enrollments.map((enrollment) => enrollment.id)
      ),
      profile?.userType ?? "UNKNOWN",
      activeChildId,
    ],
    enabled:
      shouldFetchEnrollments && !isEnrollmentsPending && !isEnrollmentsError,
    staleTime: STALE_TIME_MS,
    queryFn: async () => {
      const lectureMap = new Map<string, LearnerLectureCard>();

      for (const enrollment of enrollments) {
        const lectureEnrollments =
          enrollment.lectureEnrollments &&
          enrollment.lectureEnrollments.length > 0
            ? enrollment.lectureEnrollments
            : await fetchEnrollmentLectureEnrollmentsSVC(enrollment.id, {
                childId: activeChildId || undefined,
              });

        for (const lectureEnrollment of lectureEnrollments) {
          const lectureCard = toLearnerLectureCard({
            enrollmentId: enrollment.id,
            lectureEnrollment,
          });

          if (!lectureCard || lectureMap.has(lectureCard.id)) {
            continue;
          }

          lectureMap.set(lectureCard.id, lectureCard);
        }
      }

      return Array.from(lectureMap.values());
    },
  });

  const lectureEnrollmentMap: LectureEnrollmentResolutionMap = useMemo(
    () =>
      buildLectureEnrollmentResolutionMap({
        enrollments,
        learnerPhone,
        learnerName,
      }),
    [enrollments, learnerPhone, learnerName]
  );

  const {
    data: attendanceSummary,
    isPending: isAttendancePending,
    isError: isAttendanceError,
  } = useQuery({
    queryKey: learnerLectureKeys.attendanceSummary({
      lectureIds: lectures.map((lecture) => lecture.id),
      learnerPhone,
      learnerName,
      resolutionKeys: Object.keys(lectureEnrollmentMap),
      childId: activeChildId,
    }),
    enabled:
      shouldFetchEnrollments && !isEnrollmentsError && lectures.length > 0,
    staleTime: STALE_TIME_MS,
    queryFn: async (): Promise<LearnerLectureAttendanceSummary> => {
      const records: AttendanceList[] = [];
      let lateCount = 0;
      let absentCount = 0;
      let weightedAttendanceRateSum = 0;
      let weightedTotalCount = 0;
      const lectureEnrollmentIdByLectureId: Record<string, string> = {};

      for (const lecture of lectures) {
        try {
          const mapped = lectureEnrollmentMap[lecture.id];
          let lectureEnrollmentId =
            lecture.lectureEnrollmentId ?? mapped?.lectureEnrollmentId ?? null;

          if (!lectureEnrollmentId) {
            const resolved = await resolveLectureEnrollmentFromLectureId({
              lectureId: lecture.id,
              learnerPhone,
              learnerName,
              enrollments,
            });

            lectureEnrollmentId =
              resolved.lectureEnrollmentId ?? lectureEnrollmentId;
          }

          if (lectureEnrollmentId) {
            lectureEnrollmentIdByLectureId[lecture.id] = lectureEnrollmentId;
          }

          if (!lectureEnrollmentId) continue;

          const attendanceData = await fetchLectureEnrollmentDetailSVC(
            lectureEnrollmentId,
            {
              childId: activeChildId || undefined,
            }
          );
          const metrics = summarizeLectureAttendances(
            attendanceData.attendances
          );

          lateCount += metrics.lateCount;
          absentCount += metrics.absentCount;

          if (metrics.totalCount > 0 && metrics.attendanceRate !== null) {
            weightedAttendanceRateSum +=
              metrics.attendanceRate * metrics.totalCount;
            weightedTotalCount += metrics.totalCount;
          }

          records.push(...metrics.records);
        } catch {
          continue;
        }
      }

      sortAttendanceRecordsDesc(records);

      return {
        lateCount,
        absentCount,
        attendanceRate:
          weightedTotalCount > 0
            ? Math.round(
                (weightedAttendanceRateSum / weightedTotalCount) * 10
              ) / 10
            : null,
        records,
        lectureEnrollmentIdByLectureId,
      };
    },
  });

  const instructorById = useMemo(
    () =>
      new Map(
        (profile?.instructors ?? []).map((instructor) => [
          instructor.id,
          instructor,
        ])
      ),
    [profile?.instructors]
  );

  return {
    profile,
    enrollments,
    lectures,
    attendanceSummary,
    lectureEnrollmentMap,
    instructorById,
    isProfilePending,
    isProfileError,
    isEnrollmentsPending,
    isEnrollmentsError,
    isLecturesPending,
    isLecturesError,
    isAttendancePending,
    isAttendanceError,
  };
};
