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
