export type ReportTemplateType = "premium" | "simple";

export type ReportFormState = {
  template: ReportTemplateType;
  message: string;
  reviewTest: string;
  homeworkWord: string;
  homeworkTask: string;
  homeworkExtra: string;
  weaknessType: string;
  attendanceRate: string;
};

export type ExamCommonPayload = {
  template?: ReportTemplateType;
  message: string;
};

export type StudentReportPayload = {
  template?: ReportTemplateType;
  reviewTest: string;
  homeworkWord: string;
  homeworkTask: string;
  homeworkExtra: string;
  weaknessType: string;
  attendanceRate: string;
};

export const splitPayloadForSave = (formState: ReportFormState) => {
  const commonPayload: ExamCommonPayload = {
    template: formState.template,
    message: formState.message,
  };

  const studentPayload: StudentReportPayload = {
    template: formState.template,
    reviewTest: formState.reviewTest,
    homeworkWord: formState.homeworkWord,
    homeworkTask: formState.homeworkTask,
    homeworkExtra: formState.homeworkExtra,
    weaknessType: formState.weaknessType,
    attendanceRate: formState.attendanceRate,
  };

  return {
    commonPayload,
    studentPayload,
  };
};
