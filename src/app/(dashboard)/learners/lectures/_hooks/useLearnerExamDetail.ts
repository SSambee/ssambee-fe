import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { learnerLectureKeys } from "@/constants/query-keys";
import { useMyEnrollmentsSVC } from "@/hooks/SVC/useEnrollmentsSVC";
import { useMyLearnerProfile } from "@/hooks/profile/useMyLearnerProfile";
import {
  fetchGradeDetailSVC,
  fetchLectureEnrollmentDetailSVC,
} from "@/services/SVC/enrollments.service";

import { resolveLectureEnrollmentFromLectureId } from "../_lib/resolveLectureEnrollment";

export type LearnerExamDetailView = {
  examTitle: string;
  examType: string;
  subjectLabel: string;
  lectureTitle: string;
  examDateLabel: string;
  studentName: string;
  score: number;
  classAverage: number;
  rank: number;
  totalExaminees: number;
  attendanceRate: number | null;
  miniTests: {
    id: string;
    categoryName: string;
    title: string;
    resultLabel: string;
  }[];
  wrongQuestions: {
    no: number;
    questionScore: number;
    typeLabel: string;
    categoryLabel: string;
    sourceLabel: string;
    resultLabel: string;
    correctRate: number;
    wrongRate: number;
  }[];
};

const resolveQuestionTypeLabel = (type: string | undefined): string => {
  if (type === "MULTIPLE") {
    return "객관식";
  }

  if (type === "ESSAY") {
    return "주관식";
  }

  return type || "미제공";
};

const STALE_TIME_MS = 1000 * 60;

const shouldRetryWithout404 = (failureCount: number, error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 404) {
    return false;
  }

  return failureCount < 3;
};

export const useLearnerExamDetail = ({
  lectureEnrollmentId,
  examId,
}: {
  lectureEnrollmentId: string;
  examId: string;
}) => {
  const { profile } = useMyLearnerProfile();
  const {
    data: enrollments = [],
    isPending: isEnrollmentsPending,
    isError: isEnrollmentsError,
  } = useMyEnrollmentsSVC();
  const profilePhone = profile?.phone ?? "";
  const profileName = profile?.name ?? "";

  const {
    data: lectureEnrollmentData,
    isPending: isLecturePending,
    isError: isLectureError,
  } = useQuery({
    queryKey: learnerLectureKeys.detail(lectureEnrollmentId),
    queryFn: () => fetchLectureEnrollmentDetailSVC(lectureEnrollmentId),
    enabled: !!lectureEnrollmentId,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const resolveEnabled =
    !lectureEnrollmentData &&
    isLectureError &&
    !isLecturePending &&
    !isEnrollmentsPending &&
    !!lectureEnrollmentId &&
    !!profile;

  const {
    data: resolvedLectureEnrollmentId,
    isPending: isResolvePending,
    isError: isResolveError,
  } = useQuery({
    queryKey: learnerLectureKeys.resolveLectureEnrollmentId({
      lectureKey: lectureEnrollmentId,
      learnerPhone: profilePhone,
      learnerName: profileName,
      enrollmentsCount: enrollments.length,
    }),
    enabled: resolveEnabled,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
    queryFn: async () => {
      const resolved = await resolveLectureEnrollmentFromLectureId({
        lectureId: lectureEnrollmentId,
        learnerPhone: profilePhone,
        learnerName: profileName,
        enrollments: isEnrollmentsError ? undefined : enrollments,
      });

      return resolved.lectureEnrollmentId;
    },
  });

  const {
    data: resolvedLectureEnrollmentData,
    isPending: isResolvedLecturePending,
    isError: isResolvedLectureError,
  } = useQuery({
    queryKey: learnerLectureKeys.detail(resolvedLectureEnrollmentId ?? ""),
    queryFn: () =>
      fetchLectureEnrollmentDetailSVC(resolvedLectureEnrollmentId!),
    enabled:
      !!resolvedLectureEnrollmentId &&
      resolvedLectureEnrollmentId !== lectureEnrollmentId,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  const lectureDetail = lectureEnrollmentData ?? resolvedLectureEnrollmentData;
  const isLectureLoading =
    isLecturePending ||
    (resolveEnabled && isResolvePending) ||
    (!!resolvedLectureEnrollmentId && isResolvedLecturePending);
  const hasLectureFetchError =
    !lectureDetail &&
    (isLectureError || isResolveError || isResolvedLectureError);
  const lectureGrades = lectureDetail?.grades;
  const selectedGradeItem = useMemo(() => {
    if (!lectureGrades?.length) {
      return null;
    }

    return (
      lectureGrades.find(
        (item) => item.exam.id === examId || item.gradeId === examId
      ) ?? null
    );
  }, [lectureGrades, examId]);
  const selectedGradeId = selectedGradeItem?.gradeId ?? "";

  const {
    data: gradeDetailData,
    isPending: isGradePending,
    isError: isGradeError,
  } = useQuery({
    queryKey: ["learners", "examDetail", "grade", selectedGradeId],
    queryFn: () => fetchGradeDetailSVC(selectedGradeId),
    enabled: !!selectedGradeId,
    staleTime: STALE_TIME_MS,
    retry: shouldRetryWithout404,
  });

  if (isLectureLoading || (!!selectedGradeId && isGradePending)) {
    return {
      isPending: true,
      errorMessage: null,
      lectureTitle: lectureDetail?.lecture?.title ?? "강의 상세",
      examTitle: selectedGradeItem?.exam.title ?? "시험 상세",
      detail: null as LearnerExamDetailView | null,
    };
  }

  if (hasLectureFetchError || isGradeError || !lectureDetail) {
    return {
      isPending: false,
      errorMessage: "시험 상세 정보를 불러올 수 없습니다.",
      lectureTitle: "강의 상세",
      examTitle: "시험 상세",
      detail: null,
    };
  }

  if (!selectedGradeItem) {
    return {
      isPending: false,
      errorMessage: "해당 시험의 성적 정보를 찾을 수 없습니다.",
      lectureTitle: lectureDetail.lecture?.title ?? "강의 상세",
      examTitle: "시험 상세",
      detail: null,
    };
  }

  const resolvedLectureTitle = lectureDetail.lecture?.title ?? "강의 상세";
  const gradeStatistics = gradeDetailData?.questionStatistics ?? [];
  const questionDetails = gradeDetailData?.questionDetails ?? [];
  const questionDetailMap = new Map(
    questionDetails.map((item) => [item.questionNumber, item])
  );
  const attendanceList = lectureDetail.attendances ?? [];

  const attendanceRate =
    typeof lectureDetail.attendanceRate === "number"
      ? lectureDetail.attendanceRate
      : attendanceList.length > 0
        ? Number(
            (
              (attendanceList.filter((item) => item.status !== "ABSENT")
                .length /
                attendanceList.length) *
              100
            ).toFixed(1)
          )
        : null;

  const miniTests = (gradeDetailData?.assignmentResults ?? []).map(
    (assignment) => ({
      id: assignment.assignmentId,
      categoryName: assignment.categoryName || "카테고리",
      title: assignment.title || "과제",
      resultLabel: assignment.resultLabel || "-",
    })
  );

  const wrongQuestions = gradeStatistics.map((question) => {
    const questionDetail = questionDetailMap.get(question.questionNumber);
    const normalizedCorrectRate = Math.max(
      0,
      Math.min(question.correctRate, 100)
    );
    const wrongRate = Number((100 - normalizedCorrectRate).toFixed(1));

    return {
      no: question.questionNumber,
      questionScore: question.score,
      typeLabel: resolveQuestionTypeLabel(questionDetail?.type),
      categoryLabel: questionDetail?.category || "미제공",
      sourceLabel: questionDetail?.source || "미제공",
      resultLabel:
        questionDetail?.isCorrect === true
          ? "정답"
          : questionDetail?.isCorrect === false
            ? "오답"
            : "미제공",
      correctRate: normalizedCorrectRate,
      wrongRate,
    };
  });

  const detail: LearnerExamDetailView = {
    examTitle: gradeDetailData?.examTitle || selectedGradeItem.exam.title,
    examType:
      gradeDetailData?.examCategory ||
      selectedGradeItem.exam.examType ||
      selectedGradeItem.exam.title,
    subjectLabel: selectedGradeItem.exam.subject,
    lectureTitle: resolvedLectureTitle,
    examDateLabel: selectedGradeItem.exam.examDate,
    studentName: gradeDetailData?.studentName || lectureDetail.enrollment.name,
    score: gradeDetailData?.score ?? selectedGradeItem.grade.score,
    classAverage: gradeDetailData?.average ?? selectedGradeItem.exam.average,
    rank: gradeDetailData?.rank ?? selectedGradeItem.grade.rank,
    totalExaminees: selectedGradeItem.exam.totalExaminees,
    attendanceRate,
    miniTests,
    wrongQuestions,
  };

  return {
    isPending: false,
    errorMessage: null,
    lectureTitle: resolvedLectureTitle,
    examTitle: selectedGradeItem.exam.title,
    detail,
  };
};
