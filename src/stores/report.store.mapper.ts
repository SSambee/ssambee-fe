import type { ExamApi, ExamStatisticsApi } from "@/types/exams";
import type { ExamGradeApi, ExamGradeReportApi } from "@/types/grades";
import type { LectureStudent } from "@/types/lectures";
import type {
  ClassExam,
  ExamStudent,
  QuestionResult,
  ReportAssignmentResult,
} from "@/types/report";
import { formatYMDFromISO } from "@/utils/date";

const koreanCollator = new Intl.Collator("ko", {
  sensitivity: "base",
  numeric: true,
});

const parseDateToTimestamp = (value?: string | null) => {
  if (!value) return 0;

  const normalized = value.includes("T")
    ? value
    : value.replace(/\./g, "-").trim();
  const timestamp = new Date(normalized).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const buildRankByEnrollment = (grades: ExamGradeApi[]) => {
  const rankByEnrollment = new Map<string, number>();

  const gradeEntries = grades
    .map((grade) => ({
      id: grade.lectureEnrollmentId ?? grade.lectureEnrollment?.id ?? grade.id,
      score: grade.score ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  let currentRank = 1;
  let previousScore: number | null = null;

  gradeEntries.forEach((entry, index) => {
    if (previousScore !== null && entry.score !== previousScore) {
      currentRank = index + 1;
    }

    rankByEnrollment.set(entry.id, currentRank);
    previousScore = entry.score;
  });

  return rankByEnrollment;
};

export const mapClassExamsFromApi = ({
  examsApi,
  statsByExamId,
  gradeCountByExamId,
}: {
  examsApi: ExamApi[];
  statsByExamId: Record<string, ExamStatisticsApi | null>;
  gradeCountByExamId: Map<string, number>;
}): ClassExam[] => {
  return [...examsApi]
    .sort((a, b) => {
      const dateDiff =
        parseDateToTimestamp(b.examDate) - parseDateToTimestamp(a.examDate);
      if (dateDiff !== 0) return dateDiff;

      const titleDiff = koreanCollator.compare(a.title, b.title);
      if (titleDiff !== 0) return titleDiff;

      return koreanCollator.compare(a.id, b.id);
    })
    .map((exam) => {
      const stats = statsByExamId[exam.id];
      const hasStatistics =
        Boolean(stats?.studentStats?.length) ||
        (stats?.examStats?.totalExaminees ?? 0) > 0;
      const totalStudents = gradeCountByExamId.get(exam.id) ?? 0;

      return {
        id: exam.id,
        examName: exam.title,
        examDate: formatYMDFromISO(exam.examDate) ?? "-",
        examType: exam.category ?? exam.subject ?? "-",
        totalStudents,
        hasStatistics,
      };
    });
};

export const mapExamStudentsFromGrades = ({
  examId,
  grades,
  stats,
  enrollments,
  className,
  selectedExamType,
}: {
  examId: string;
  grades: ExamGradeApi[];
  stats: ExamStatisticsApi | null;
  enrollments: LectureStudent[];
  className: string;
  selectedExamType: string;
}): ExamStudent[] => {
  const hasValidStats =
    Boolean(stats?.studentStats?.length) &&
    (stats?.examStats?.totalExaminees ?? 0) > 0;
  const totalStudents = hasValidStats
    ? (stats?.examStats.totalExaminees ?? 0)
    : grades.length;
  const averageScore = hasValidStats
    ? (stats?.examStats.averageScore ?? 0)
    : grades.length > 0
      ? Math.round(
          (grades.reduce((sum, grade) => sum + Number(grade.score ?? 0), 0) /
            grades.length) *
            10
        ) / 10
      : 0;

  const statsByEnrollment = new Map(
    hasValidStats
      ? (stats?.studentStats ?? []).map((item) => [
          item.lectureEnrollmentId,
          item,
        ])
      : []
  );

  const rankByEnrollment = buildRankByEnrollment(grades);
  const enrollmentsById = new Map(
    enrollments.map((enrollment) => [enrollment.id, enrollment])
  );

  return grades
    .map((grade) => {
      const lectureEnrollmentId =
        grade.lectureEnrollmentId ?? grade.lectureEnrollment?.id ?? grade.id;
      const enrollment = enrollmentsById.get(lectureEnrollmentId);
      const stat = statsByEnrollment.get(lectureEnrollmentId);
      const fallbackRank = rankByEnrollment.get(lectureEnrollmentId) ?? 0;

      return {
        id: lectureEnrollmentId,
        examId,
        examType: selectedExamType,
        gradeId: grade.id,
        name:
          grade.lectureEnrollment?.enrollment?.studentName ??
          enrollment?.name ??
          "알 수 없음",
        className,
        school: enrollment?.school,
        phone:
          grade.lectureEnrollment?.enrollment?.studentPhone ??
          enrollment?.phone,
        parentPhone: enrollment?.parentPhone,
        score: grade.score ?? 0,
        rank: stat?.rank ?? fallbackRank,
        totalStudents: stat?.totalRank ?? totalStudents,
        averageScore,
        attendance: "-",
        nextClass: "-",
        memo: "",
      } satisfies ExamStudent;
    })
    .sort((a, b) => {
      const nameDiff = koreanCollator.compare(a.name, b.name);
      if (nameDiff !== 0) return nameDiff;

      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;

      return koreanCollator.compare(a.id, b.id);
    });
};

export const mapReportDetailsToStudentFields = (
  report: ExamGradeReportApi
): {
  attendance: string;
  questionResults: QuestionResult[];
  assignmentResults: ReportAssignmentResult[];
  academyName?: string;
} => {
  const attendance =
    typeof report.attendanceRate === "number"
      ? `${report.attendanceRate}%`
      : "-";

  const questionResults: QuestionResult[] =
    report.questions?.map((question) => ({
      no: question.questionNumber ?? 0,
      content: question.content ?? question.source ?? "-",
      source: question.source ?? "-",
      type: question.category ?? "-",
      ox: question.isCorrect ? "O" : "X",
      errorRate:
        typeof question.wrongRate === "number" ? `${question.wrongRate}%` : "-",
    })) ?? [];

  const assignmentResults: ReportAssignmentResult[] =
    report.assignments?.map((assignment) => ({
      id: assignment.assignmentId,
      title: assignment.title,
      categoryName: assignment.categoryName,
      value: assignment.resultLabel?.trim() || "-",
      resultIndex: assignment.resultIndex,
    })) ?? [];

  const academyName = report.instructor?.academy?.trim() || undefined;

  return {
    attendance,
    questionResults,
    assignmentResults,
    academyName,
  };
};
