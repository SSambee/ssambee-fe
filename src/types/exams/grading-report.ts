export type GradingReportOverview = {
  examDate: string;
  averageScore: number;
  top30AverageScore: number;
  maxScore: number;
};

export type GradingReportStudentRow = {
  id: string;
  name: string;
  correctCount: string;
  score: number;
  rank: string;
};

export type GradingReportQuestionStat = {
  questionNumber: number;
  correctRate: number;
  wrongRate: number;
  optionRates: number[];
};
