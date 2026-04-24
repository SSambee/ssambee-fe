"use client";

import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { profile, isPending: isProfilePending } = useMyLearnerProfile();
  const isParentUser = profile?.userType === "PARENT";
  const selectedChildId = searchParams.get("childId");
  const activeChildId = isParentUser
    ? (profile?.children?.find((child) => child.id === selectedChildId)?.id ??
      profile?.children?.[0]?.id ??
      "")
    : "";
  const shouldFetchEnrollments =
    !!profile && (!isParentUser || !!activeChildId);
  const {
    data: enrollments = [],
    isPending: isEnrollmentsPending,
    isError: isEnrollmentsError,
  } = useMyEnrollmentsSVC({
    userType: profile?.userType,
    childId: activeChildId,
    enabled: shouldFetchEnrollments,
  });

  const learnerPhone = isParentUser ? undefined : profile?.phone;
  const learnerName = isParentUser ? undefined : profile?.name;

  const {
    data: primaryLectureDetail,
    isPending: isPrimaryPending,
    isError: isPrimaryError,
  } = useQuery({
    queryKey: learnerLectureKeys.detail(lectureKey),
    queryFn: () =>
      fetchLectureEnrollmentDetailSVC(lectureKey, {
        childId: activeChildId || undefined,
      }),
    enabled: !!lectureKey && shouldFetchEnrollments,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const isPrimaryReady = !isPrimaryError && !!primaryLectureDetail;
  const resolveEnabled =
    !isPrimaryReady &&
    !isPrimaryPending &&
    shouldFetchEnrollments &&
    !isEnrollmentsError &&
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
      learnerPhone,
      learnerName,
      enrollmentsCount: enrollments.length,
      childId: activeChildId,
    }),
    enabled: resolveEnabled,
    queryFn: async () => {
      const resolved = await resolveLectureEnrollmentFromLectureId({
        lectureId: lectureKey,
        learnerPhone,
        learnerName,
        enrollments,
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
      fetchLectureEnrollmentDetailSVC(resolvedLectureEnrollmentId!, {
        childId: activeChildId || undefined,
      }),
    enabled: !!resolvedLectureEnrollmentId && shouldFetchEnrollments,
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
    (shouldFetchEnrollments && isEnrollmentsPending) ||
    (shouldFetchEnrollments && isPrimaryPending) ||
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
