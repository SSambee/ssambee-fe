export type GradingStudent = {
  id: string;
  name: string;
  lectureName: string;
  isFinalSaved: boolean;
  hasDraft?: boolean;
  score?: number;
};

export type GradingQuestionStatus = "미입력" | "정답" | "오답";

export type GradingQuestionType = "객관식" | "주관식";

export type GradingQuestion = {
  id: string;
  number: number;
  title: string;
  type: GradingQuestionType;
  score: number;
  correctAnswer?: number | string;
  studentAnswer?: number | string;
  status?: GradingQuestionStatus;
};

export type GradingSummary = {
  selectedStudentName: string;
  selectedStudentLecture: string;
  currentScore: number;
  totalScore: number;
  passingScore: number;
  correctCount: number;
  totalQuestions: number;
  correctRate: number;
  isPassed: boolean;
};

export type GradingExamInfo = {
  examName: string;
  lectureName: string;
  examSubtitle: string;
};

export type AnswerState = {
  questionNumber: number;
  submittedAnswer: string;
  isCorrect: boolean;
};

export type QuestionMeta = {
  score: number;
  correctAnswer?: string | number;
};
