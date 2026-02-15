export type ReportClass = {
  id: string;
  name: string;
  instructorName?: string | null;
};

export type ReportStudent = {
  id: string;
  name: string;
  className: string;
  school?: string;
  academyName?: string;
  phone?: string;
  parentPhone?: string;
};

export type ClassExam = {
  id: string;
  examName: string;
  examDate: string;
  examType?: string;
  totalStudents: number;
  hasStatistics: boolean;
};

export type ExamStudent = ReportStudent & {
  examId: string;
  examType?: string;
  gradeId?: string;
  score: number;
  rank: number;
  totalStudents: number;
  averageScore: number;
  attendance: string;
  nextClass: string;
  memo: string;
  questionResults?: QuestionResult[];
  assignmentResults?: ReportAssignmentResult[];
};

export type ReportExam = {
  id: string;
  studentId: string;
  examName: string;
  examDate: string;
  score: number;
  rank: number;
  totalStudents: number;
  averageScore: number;
  attendance: string;
  nextClass: string;
  memo: string;
};

export type QuestionResult = {
  no: number;
  content?: string;
  source: string;
  type: string;
  ox: "O" | "X";
  errorRate: string;
};

export type ReportAssignmentResult = {
  id: string;
  title: string;
  categoryName: string;
  value: string;
  resultIndex?: number | null;
};

export type ScoreHistory = {
  round: string;
  score: number;
};
