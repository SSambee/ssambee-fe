export type ReportClass = {
  id: string;
  name: string;
};

export type ReportStudent = {
  id: string;
  name: string;
  className: string;
  phone?: string;
  parentPhone?: string;
};

export type ClassExam = {
  id: string;
  examName: string;
  examDate: string;
  totalStudents: number;
  hasStatistics: boolean;
};

export type ExamStudent = ReportStudent & {
  examId: string;
  score: number;
  rank: number;
  totalStudents: number;
  averageScore: number;
  attendance: string;
  nextClass: string;
  memo: string;
  questionResults?: QuestionResult[];
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

export type ScoreHistory = {
  round: string;
  score: number;
};
