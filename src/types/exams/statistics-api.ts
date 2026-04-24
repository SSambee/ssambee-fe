export type ExamStatisticsApi = {
  examStats: ExamStatisticsSummaryApi;
  questionStats: ExamQuestionStatisticApi[];
  studentStats: ExamStudentStatisticApi[];
};

export type ExamStatisticsSummaryApi = {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalExaminees: number;
  examDate: string | null;
};

export type ExamQuestionStatisticApi = {
  questionId: string;
  questionNumber?: number | null;
  totalSubmissions: number;
  correctRate: number;
  choiceRates: Record<string, number> | null;
};

export type ExamStudentStatisticApi = {
  lectureEnrollmentId: string;
  enrollmentId: string;
  studentName: string;
  school: string;
  correctCount: number;
  score: number;
  rank: number;
  totalRank: number;
};
