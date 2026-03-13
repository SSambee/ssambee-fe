import type {
  ExamDetailApi,
  ExamStatisticsApi,
  GradingReportOverview,
  GradingReportQuestionStat,
  GradingReportStudentRow,
} from "@/types/exams";
import { formatDateYMD } from "@/utils/date";

type GradingReportData = {
  overview: GradingReportOverview;
  studentRows: GradingReportStudentRow[];
  questionStats: GradingReportQuestionStat[];
};

export const buildEmptyQuestionStats = (
  questions: ExamDetailApi["questions"] = []
): GradingReportQuestionStat[] =>
  [...questions]
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .map((question) => ({
      questionNumber: question.questionNumber,
      correctRate: 0,
      wrongRate: 0,
      optionRates: [0, 0, 0, 0, 0],
    }));

const roundToOneDecimal = (value: number) => Number(value.toFixed(1));

const calculateTop30Average = (scores: number[]) => {
  if (scores.length === 0) return 0;
  const sortedScores = [...scores].sort((a, b) => b - a);
  const topCount = Math.max(1, Math.ceil(sortedScores.length * 0.3));
  const topScores = sortedScores.slice(0, topCount);
  return roundToOneDecimal(
    topScores.reduce((sum, score) => sum + score, 0) / topScores.length
  );
};

const resolveExamDate = (
  examDetail: ExamDetailApi,
  statistics?: ExamStatisticsApi | null
) =>
  formatDateYMD(
    statistics?.examStats?.examDate ??
      examDetail.examDate ??
      examDetail.createdAt ??
      null
  ) ?? "-";

const buildStudentRows = (
  statistics: ExamStatisticsApi | null
): GradingReportStudentRow[] =>
  (statistics?.studentStats ?? []).map((stat) => ({
    id: stat.lectureEnrollmentId,
    name: stat.studentName,
    correctCount: String(stat.correctCount ?? 0),
    score: stat.score ?? 0,
    rank: String(stat.rank ?? ""),
  }));

const buildQuestionStats = (
  questions: ExamDetailApi["questions"],
  statistics: ExamStatisticsApi | null
): GradingReportQuestionStat[] => {
  const baseQuestionStats = buildEmptyQuestionStats(questions ?? []);
  const questionStatsMap = new Map<
    number,
    ExamStatisticsApi["questionStats"][number]
  >();

  statistics?.questionStats?.forEach((stat) => {
    if (typeof stat.questionNumber === "number") {
      questionStatsMap.set(stat.questionNumber, stat);
    }
  });

  return baseQuestionStats.map((base) => {
    const stat = questionStatsMap.get(base.questionNumber);
    if (!stat) return base;

    const totalSubmissions = stat.totalSubmissions ?? 0;
    const correctRate = stat.correctRate ?? 0;
    const wrongRate = totalSubmissions ? Math.max(0, 100 - correctRate) : 0;
    const optionRates = [1, 2, 3, 4, 5].map(
      (idx) => stat.choiceRates?.[String(idx)] ?? 0
    );

    return {
      questionNumber: base.questionNumber,
      correctRate,
      wrongRate,
      optionRates,
    };
  });
};

export const buildDefaultOverview = (
  examDetail?: ExamDetailApi
): GradingReportOverview => ({
  examDate:
    formatDateYMD(examDetail?.examDate ?? examDetail?.createdAt ?? null) ?? "-",
  averageScore: 0,
  top30AverageScore: 0,
  maxScore: 0,
});

export const buildReportFromStatistics = (
  examDetail: ExamDetailApi,
  statistics: ExamStatisticsApi | null
): GradingReportData => {
  const scores = statistics?.studentStats?.map((stat) => stat.score ?? 0) ?? [];
  const top30AverageScore = calculateTop30Average(scores);
  const averageScore = roundToOneDecimal(
    statistics?.examStats?.averageScore ?? 0
  );
  const apiHighestScore = statistics?.examStats?.highestScore;
  const maxScoreFromRows = scores.length > 0 ? Math.max(...scores) : 0;
  const maxScore =
    apiHighestScore != null
      ? Math.max(apiHighestScore, maxScoreFromRows)
      : maxScoreFromRows;

  return {
    overview: {
      examDate: resolveExamDate(examDetail, statistics),
      averageScore,
      top30AverageScore,
      maxScore,
    },
    studentRows: buildStudentRows(statistics),
    questionStats: buildQuestionStats(examDetail.questions, statistics),
  };
};
