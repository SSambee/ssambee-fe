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
