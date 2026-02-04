import type { ExamFormInput } from "@/validation/exam.validation";

export const EXAMS_UI_ONLY = true; // 삭제/채점 액션은 추후 연동

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
  examType: "",
  examDate: "",
  lectureId: "",
  source: "",
  passScore: undefined,
  autoRetest: true,
  autoScore: true,
  questions: [],
};
