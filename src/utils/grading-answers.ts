import type {
  AnswerState,
  GradingQuestion,
  QuestionMeta,
} from "@/types/grading";

export const resolveAnswers = (
  studentId: string,
  overrides: Record<string, AnswerState[]>,
  baseAnswersByStudent: Record<string, AnswerState[]>,
  defaultAnswers: AnswerState[]
) => overrides[studentId] ?? baseAnswersByStudent[studentId] ?? defaultAnswers;

export const buildAnswerMap = (answers: AnswerState[]) =>
  new Map(answers.map((answer) => [answer.questionNumber, answer]));

export const buildGradingQuestions = (
  questions: GradingQuestion[],
  selectedAnswerMap: Map<number, AnswerState>
): GradingQuestion[] =>
  questions.map((question) => {
    const answer = selectedAnswerMap.get(question.number);
    const submittedAnswer = answer?.submittedAnswer ?? "";
    const hasAnswer = submittedAnswer.trim().length > 0;
    const status = !hasAnswer ? "미입력" : answer?.isCorrect ? "정답" : "오답";

    return {
      ...question,
      studentAnswer:
        question.type === "객관식"
          ? submittedAnswer
            ? Number(submittedAnswer)
            : undefined
          : submittedAnswer || undefined,
      status,
    };
  });

export const computeScoreAndCorrectCount = (
  answers: AnswerState[],
  questionMetaMap: Map<number, QuestionMeta>
) => {
  let score = 0;
  let correct = 0;
  for (const answer of answers) {
    if (!answer.isCorrect) continue;
    const question = questionMetaMap.get(answer.questionNumber);
    if (!question) continue;
    score += question.score;
    correct += 1;
  }
  return { currentScore: score, correctCount: correct };
};

const buildDraftKey = (examId: string, studentId: string) =>
  `grading-draft:${examId}:${studentId}`;

export const saveDraft = (
  examId: string,
  studentId: string,
  answers: AnswerState[]
) => {
  if (typeof window === "undefined") return;
  const key = buildDraftKey(examId, studentId);
  window.localStorage.setItem(key, JSON.stringify(answers));
};

export const clearDraft = (examId: string, studentId: string) => {
  if (typeof window === "undefined") return;
  const key = buildDraftKey(examId, studentId);
  window.localStorage.removeItem(key);
};

export const loadDraft = (
  examId: string,
  studentId: string
): AnswerState[] | null => {
  if (typeof window === "undefined") return null;
  const key = buildDraftKey(examId, studentId);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as AnswerState[];
  } catch {
    return null;
  }
};
