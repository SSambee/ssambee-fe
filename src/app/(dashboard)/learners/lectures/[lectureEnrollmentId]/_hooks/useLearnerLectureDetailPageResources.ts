"use client";

import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { learnerLectureKeys } from "@/constants/query-keys";
import { useMyEnrollmentsSVC } from "@/hooks/SVC/useEnrollmentsSVC";
import { useMyLearnerProfile } from "@/hooks/profile/useMyLearnerProfile";
import { fetchLectureEnrollmentDetailSVC } from "@/services/SVC/enrollments.service";
import {
  findLectureSummaryFromEnrollments,
  type LearnerLectureSummaryVM,
} from "@/services/SVC/learners-lecture-detail.mapper";

import { resolveLectureEnrollmentFromLectureId } from "../../_lib/resolveLectureEnrollment";

type UseLearnerLectureDetailPageResourcesParams = {
  lectureKey: string;
};

const STALE_TIME_MS = 1000 * 60;

const shouldRetryWithout404 = (failureCount: number, error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 404) {
    return false;
  }

  return failureCount < 3;
};

export const useLearnerLectureDetailPageResources = ({
  lectureKey,
}: UseLearnerLectureDetailPageResourcesParams) => {
  const { profile, isPending: isProfilePending } = useMyLearnerProfile();
  const {
    data: enrollments = [],
    isPending: isEnrollmentsPending,
    isError: isEnrollmentsError,
  } = useMyEnrollmentsSVC();

  const profilePhone = profile?.phone ?? "";
  const profileName = profile?.name ?? "";

  const {
    data: primaryLectureDetail,
    isPending: isPrimaryPending,
    isError: isPrimaryError,
  } = useQuery({
    queryKey: learnerLectureKeys.detail(lectureKey),
    queryFn: () => fetchLectureEnrollmentDetailSVC(lectureKey),
    enabled: !!lectureKey,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const isPrimaryReady = !isPrimaryError && !!primaryLectureDetail;
  const resolveEnabled =
    !isPrimaryReady &&
    !isPrimaryPending &&
    !isEnrollmentsPending &&
    !!lectureKey &&
    !!profile;

  const {
    data: resolvedLectureEnrollmentId,
    isPending: isResolvePending,
    isError: isResolveError,
  } = useQuery({
    queryKey: learnerLectureKeys.resolveLectureEnrollmentId({
      lectureKey,
      learnerPhone: profilePhone,
      learnerName: profileName,
      enrollmentsCount: enrollments.length,
    }),
    enabled: resolveEnabled,
    queryFn: async () => {
      const resolved = await resolveLectureEnrollmentFromLectureId({
        lectureId: lectureKey,
        learnerPhone: profilePhone,
        learnerName: profileName,
        enrollments: isEnrollmentsError ? undefined : enrollments,
      });

      return resolved.lectureEnrollmentId;
    },
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const {
    data: fallbackLectureDetail,
    isPending: isFallbackPending,
    isError: isFallbackError,
  } = useQuery({
    queryKey: learnerLectureKeys.detail(resolvedLectureEnrollmentId ?? ""),
    queryFn: () =>
      fetchLectureEnrollmentDetailSVC(resolvedLectureEnrollmentId!),
    enabled: !!resolvedLectureEnrollmentId,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const lectureDetail = isPrimaryReady
    ? primaryLectureDetail
    : (fallbackLectureDetail ?? null);

  const effectiveLectureEnrollmentId = useMemo(() => {
    if (isPrimaryReady) return lectureKey;
    return resolvedLectureEnrollmentId ?? lectureKey;
  }, [isPrimaryReady, lectureKey, resolvedLectureEnrollmentId]);

  const lectureFromEnrollments: LearnerLectureSummaryVM | null = useMemo(
    () =>
      findLectureSummaryFromEnrollments({
        lectureKey,
        resolvedLectureEnrollmentId: resolvedLectureEnrollmentId ?? undefined,
        enrollments,
      }),
    [enrollments, lectureKey, resolvedLectureEnrollmentId]
  );

  const lectureTitle =
    lectureDetail?.lecture?.title ??
    lectureFromEnrollments?.title ??
    "강의 상세";

  const isPending =
    isProfilePending ||
    isEnrollmentsPending ||
    isPrimaryPending ||
    (resolveEnabled && isResolvePending) ||
    (!!resolvedLectureEnrollmentId && isFallbackPending);

  const hasResolveFailure = isResolveError || isFallbackError;

  return {
    profile,
    lectureDetail,
    lectureFromEnrollments,
    lectureTitle,
    effectiveLectureEnrollmentId,
    hasResolveFailure,
    isPending,
  };
};
