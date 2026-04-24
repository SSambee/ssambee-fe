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

export type ExamGradeEnrollmentApi = {
  id: string;
  enrollment: {
    id: string;
    studentName: string;
    studentPhone: string;
    school: string;
    schoolYear: string;
  };
};

export type ExamGradeApi = {
  id: string;
  examId: string;
  lectureEnrollmentId: string;
  score: number;
  isPass: boolean;
  lectureEnrollment: ExamGradeEnrollmentApi;
};

export type ExamGradeReportApi = {
  attendanceRate?: number | null;
  assignments?: ExamGradeReportAssignmentApi[] | null;
  questions?: ExamGradeReportQuestionApi[] | null;
  instructor?: {
    name?: string | null;
    academy?: string | null;
    subject?: string | null;
  };
  gradeReport?: {
    description?: string | null;
  };
};

export type ExamGradeReportAssignmentApi = {
  assignmentId: string;
  title: string;
  categoryName: string;
  resultIndex?: number | null;
  resultLabel?: string | null;
  resultPresets?: string[] | null;
};

export type ExamGradeReportQuestionApi = {
  questionNumber: number;
  content?: string | null;
  source?: string | null;
  category?: string | null;
  isCorrect?: boolean | null;
  wrongRate?: number | null;
};
