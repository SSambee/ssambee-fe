import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  fetchGradeDetailSVC,
  fetchLectureEnrollmentDetailSVC,
} from "@/services/SVC/enrollments.service";

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

export const useLearnerExamDetail = ({
  lectureEnrollmentId,
  examId,
}: {
  lectureEnrollmentId: string;
  examId: string;
}) => {
  const {
    data: lectureEnrollmentData,
    isPending: isLecturePending,
    isError: isLectureError,
  } = useQuery({
    queryKey: [
      "learners",
      "examDetail",
      "lectureEnrollment",
      lectureEnrollmentId,
    ],
    queryFn: async () => ({
      data: await fetchLectureEnrollmentDetailSVC(lectureEnrollmentId),
    }),
    enabled: !!lectureEnrollmentId,
    staleTime: 1000 * 60,
  });

  const lectureDetail = lectureEnrollmentData?.data;
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
    queryFn: async () => ({
      data: await fetchGradeDetailSVC(selectedGradeId),
    }),
    enabled: !!selectedGradeId,
    staleTime: 1000 * 60,
  });

  if (isLecturePending || (!!selectedGradeId && isGradePending)) {
    return {
      isPending: true,
      errorMessage: null,
      lectureTitle: lectureDetail?.lecture?.title ?? "강의 상세",
      examTitle: selectedGradeItem?.exam.title ?? "시험 상세",
      detail: null as LearnerExamDetailView | null,
    };
  }

  if (isLectureError || isGradeError || !lectureDetail) {
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
  const gradeStatistics = gradeDetailData?.data?.questionStatistics ?? [];
  const questionDetails = gradeDetailData?.data?.questionDetails ?? [];
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

  const miniTests = (gradeDetailData?.data?.assignmentResults ?? []).map(
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
    examTitle: gradeDetailData?.data?.examTitle || selectedGradeItem.exam.title,
    examType:
      gradeDetailData?.data?.examCategory ||
      selectedGradeItem.exam.examType ||
      selectedGradeItem.exam.title,
    subjectLabel: selectedGradeItem.exam.subject,
    lectureTitle: resolvedLectureTitle,
    examDateLabel: selectedGradeItem.exam.examDate,
    studentName:
      gradeDetailData?.data?.studentName || lectureDetail.enrollment.name,
    score: gradeDetailData?.data?.score ?? selectedGradeItem.grade.score,
    classAverage:
      gradeDetailData?.data?.average ?? selectedGradeItem.exam.average,
    rank: gradeDetailData?.data?.rank ?? selectedGradeItem.grade.rank,
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
