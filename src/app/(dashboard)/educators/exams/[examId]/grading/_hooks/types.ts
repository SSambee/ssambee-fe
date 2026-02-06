export type AnswerState = {
  questionNumber: number;
  submittedAnswer: string;
  isCorrect: boolean;
};

export type QuestionMeta = {
  score: number;
  correctAnswer?: string | number;
};
