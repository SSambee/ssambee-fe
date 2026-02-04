export type GradingStatusApi = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type QuestionTypeApi = "MULTIPLE" | "ESSAY";

export type QuestionApi = {
  id: string;
  examId: string;
  lectureId: string;
  questionNumber: number;
  content: string;
  type: QuestionTypeApi;
  score: number;
  choices?: Record<string, string> | null;
  source?: string | null;
  correctAnswer: string;
};

export type ExamApi = {
  id: string;
  lectureId: string;
  instructorId?: string | null;
  title: string;
  cutoffScore: number;
  source?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  gradingStatus: GradingStatusApi;
};

export type EnrollmentGradeInfoApi = {
  lectureEnrollmentId: string;
  studentName: string;
  appStudentId?: string | null;
  schoolYear: string;
  hasGrade: boolean;
  score?: number;
};

export type ExamDetailApi = ExamApi & {
  questions: QuestionApi[];
  lecture?: { title: string };
  enrollments?: EnrollmentGradeInfoApi[];
};

export type QuestionCreatePayload = {
  questionNumber: number;
  content: string;
  type?: QuestionTypeApi;
  score: number;
  choices?: Record<string, string>;
  source?: string;
  correctAnswer: string;
};

export type QuestionUpsertPayload = QuestionCreatePayload & {
  id?: string;
};

export type CreateExamPayload = {
  title: string;
  cutoffScore: number;
  source?: string;
  questions: QuestionCreatePayload[];
};

export type UpdateExamPayload = {
  title?: string;
  cutoffScore?: number;
  source?: string | null;
  questions?: QuestionUpsertPayload[];
};
