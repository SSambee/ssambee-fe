export type GradeAnswerPayload = {
  questionId?: string;
  questionNumber?: number;
  submittedAnswer: string;
  isCorrect: boolean;
};

export type SubmitGradingPayload = {
  lectureEnrollmentId: string;
  answers: GradeAnswerPayload[];
  totalScore: number;
  correctCount: number;
};

export type StudentGradeAnswerApi = {
  questionId: string;
  questionNumber: number;
  type: "MULTIPLE" | "ESSAY";
  score: number;
  content: string;
  correctAnswer: string;
  submittedAnswer?: string | null;
  isCorrect?: boolean | null;
};

export type StudentGradeWithAnswersApi = {
  studentName: string;
  score: number;
  isPass: boolean;
  examTitle: string;
  questions: StudentGradeAnswerApi[];
};
