import { formatDateYMD } from "@/utils/date";
import type { Exam, ExamStatus } from "@/types/exams";
import type {
  CreateExamPayload,
  ExamApi,
  ExamDetailApi,
  GradingStatusApi,
  QuestionTypeApi,
  UpdateExamPayload,
} from "@/types/exams";
import type { ExamFormInput } from "@/validation/exam.validation";

const mapGradingStatusToView = (status: GradingStatusApi): ExamStatus => {
  const statusMap: Record<GradingStatusApi, ExamStatus> = {
    PENDING: "진행 중",
    IN_PROGRESS: "진행 중",
    COMPLETED: "채점 완료",
  };

  // TODO: 새로운 GradingStatusApi 값이 추가될 경우 기본값 또는 예외 흐름을 고민해야 함
  return statusMap[status];
};

const formatRegistrationDate = (iso?: string | null) => {
  const ymd = formatDateYMD(iso);
  if (!ymd) return "-";
  return ymd.split("-").join(". ");
};

export const mapExamApiToView = (exam: ExamApi, lectureName: string): Exam => {
  const resolvedLectureName =
    lectureName && lectureName !== "수업 미지정"
      ? lectureName
      : exam.lectureTitle || "수업 미지정";

  return {
    id: exam.id,
    lectureId: exam.lectureId,
    name: exam.title,
    subtitle: exam.source ? exam.source : "출처 미지정",
    type: exam.category ?? "기타",
    source: exam.source ?? undefined,
    lectureName: resolvedLectureName,
    registrationDate: formatRegistrationDate(exam.createdAt),
    createdAt: exam.createdAt,
    status: mapGradingStatusToView(exam.gradingStatus),
  };
};

const mapQuestionTypeToApi = (
  type: ExamFormInput["questions"][number]["type"]
): QuestionTypeApi => {
  return type === "객관식" ? "MULTIPLE" : "ESSAY";
};

const mapQuestionTypeToForm = (
  type: QuestionTypeApi
): ExamFormInput["questions"][number]["type"] => {
  return type === "MULTIPLE" ? "객관식" : "주관식";
};

const normalizeExamDateToIso = (raw?: string | null) => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }
  return trimmed;
};

export const mapExamFormToCreatePayload = (
  input: ExamFormInput
): CreateExamPayload => {
  const examDate = normalizeExamDateToIso(input.examDate);

  return {
    title: input.name.trim(),
    subject: input.subject.trim(),
    cutoffScore: input.passScore ?? 0,
    source: input.source?.trim() || undefined,
    examDate: examDate || undefined,
    category: input.category?.trim() ? input.category.trim() : undefined,
    isAutoClinic: input.isAutoClinic,
    questions: input.questions.map((question, index) => {
      const isMultiple = question.type === "객관식";
      const correctAnswer = isMultiple
        ? String(question.answer.selected ?? "")
        : (question.answer.text?.trim() ?? "");

      return {
        questionNumber: index + 1,
        content: question.content.trim(),
        type: mapQuestionTypeToApi(question.type),
        score: question.score,
        source: question.source?.trim() || undefined,
        category: question.category?.trim() || undefined,
        correctAnswer,
      };
    }),
  };
};

export const mapExamFormToUpdatePayload = (
  input: ExamFormInput
): UpdateExamPayload => {
  const examDate = normalizeExamDateToIso(input.examDate);

  return {
    title: input.name.trim(),
    subject: input.subject.trim() ? input.subject.trim() : null,
    cutoffScore: input.passScore ?? 0,
    source: input.source?.trim() ? input.source.trim() : null,
    examDate: examDate,
    category: input.category?.trim() ? input.category.trim() : null,
    isAutoClinic: input.isAutoClinic,
    questions: input.questions.map((question, index) => {
      const isMultiple = question.type === "객관식";
      const correctAnswer = isMultiple
        ? String(question.answer.selected ?? "")
        : (question.answer.text?.trim() ?? "");

      return {
        id: question.id,
        questionNumber: index + 1,
        content: question.content.trim(),
        type: mapQuestionTypeToApi(question.type),
        score: question.score,
        source: question.source?.trim() || undefined,
        category: question.category?.trim() || undefined,
        correctAnswer,
      };
    }),
  };
};

type ExamFormMappingOptions = {
  lectureSubject?: string;
  isAutoClinic?: boolean;
  category?: string;
  examDate?: string;
  autoScore?: boolean;
};

export const mapExamDetailToFormInput = (
  exam: ExamDetailApi,
  options?: ExamFormMappingOptions
): ExamFormInput => {
  const questions = [...(exam.questions ?? [])]
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .map((question) => {
      const formType = mapQuestionTypeToForm(question.type);
      const base = {
        id: question.id,
        score: question.score,
        category: question.category ?? "",
        source: question.source ?? "",
        content: question.content ?? "",
      };

      if (formType === "객관식") {
        const parsed = Number(question.correctAnswer);
        const selected =
          Number.isFinite(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 1;
        return {
          ...base,
          type: "객관식" as const,
          answer: {
            selected,
          },
        };
      }

      return {
        ...base,
        type: "주관식" as const,
        answer: {
          text: question.correctAnswer ?? "",
        },
      };
    });

  return {
    name: exam.title ?? "",
    subject:
      exam.subject ?? exam.lecture?.subject ?? options?.lectureSubject ?? "",
    category: exam.category ?? options?.category ?? "",
    examDate:
      formatDateYMD(exam.examDate ?? exam.createdAt ?? null) ??
      options?.examDate ??
      "",
    lectureId: exam.lectureId ?? "",
    source: exam.source ?? "",
    passScore: exam.cutoffScore ?? 0,
    isAutoClinic: exam.isAutoClinic ?? options?.isAutoClinic ?? true,
    autoScore: options?.autoScore ?? true,
    questions,
  };
};
