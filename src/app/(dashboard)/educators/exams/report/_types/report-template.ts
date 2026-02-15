import type { QuestionResult, ReportAssignmentResult } from "@/types/report";

export type ReportTemplateExamData = {
  id: string;
  examId: string;
  gradeId?: string;
  studentId: string;
  examName: string;
  examDate: string;
  examType?: string;
  score: number;
  rank: number;
  totalStudents: number;
  averageScore: number;
  attendance: string;
  nextClass: string;
  memo: string;
  questionResults?: QuestionResult[];
  assignmentResults?: ReportAssignmentResult[];
  studentName: string;
  className: string;
  schoolName?: string;
  instructorName?: string | null;
  phone?: string;
  parentPhone?: string;
};
