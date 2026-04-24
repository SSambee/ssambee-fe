import type { ExamFormInput } from "@/validation/exam.validation";

export const EXAMS_UI_ONLY = false; // 삭제 연동 완료

export const createDefaultQuestion =
  (): ExamFormInput["questions"][number] => ({
    type: "객관식",
    score: 0,
    category: "",
    source: "",
    content: "",
    answer: {
      selected: 1,
    },
  });

export const EXAM_FORM_DEFAULTS: ExamFormInput = {
  name: "",
  subject: "",
  category: "",
  examDate: "",
  lectureId: "",
  source: "",
  passScore: undefined,
  isAutoClinic: true,
  autoScore: true,
  questions: [],
};

export const MAX_VISIBLE_STUDENTS = 10;
export const MAX_INCLUDED_ASSIGNMENTS = 4;
export const TABLE_HEADER_HEIGHT_PX = 56;
export const TABLE_ROW_HEIGHT_PX = 60;
export const STUDENT_TABLE_MAX_HEIGHT_PX =
  TABLE_HEADER_HEIGHT_PX + MAX_VISIBLE_STUDENTS * TABLE_ROW_HEIGHT_PX;
