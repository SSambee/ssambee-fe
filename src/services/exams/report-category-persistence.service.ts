import {
  defaultReportCategoryStorage,
  readReportCategoryStorage,
  subscribeReportCategoryStorage,
  writeReportCategoryStorage,
  type ExamCategoryMap,
  type ReportExamFinalizedMap,
  type ReportCategory,
  type ReportCategoryStorage,
  type ReportStudentSelections,
} from "@/lib/report-category-storage";

export type {
  ReportCategory,
  ExamCategoryMap,
  ReportStudentSelections,
  ReportExamFinalizedMap,
  ReportCategoryStorage,
};

type SaveStudentSelectionParams = {
  examId: string;
  studentId: string;
  selections: Record<string, string>;
};

type SaveExamFinalizedParams = {
  examId: string;
  finalized: boolean;
};

export const readReportCategoryStorageConfig = (): ReportCategoryStorage => {
  return readReportCategoryStorage();
};

export const defaultReportCategoryStorageConfig = defaultReportCategoryStorage;

export const subscribeReportCategoryStorageConfig = (
  onStoreChange: () => void
) => {
  return subscribeReportCategoryStorage(onStoreChange);
};

export const saveReportCategoryStorageConfig = (
  next: ReportCategoryStorage
): ReportCategoryStorage => {
  writeReportCategoryStorage(next);
  return next;
};

export const saveReportStudentSelections = ({
  examId,
  studentId,
  selections,
}: SaveStudentSelectionParams): ReportCategoryStorage => {
  // TODO: [BE-준비] 학생별 결과 저장을 BE assignment-results API로 전환하고 현재 로컬 저장은 fallback 캐시로만 유지
  const current = readReportCategoryStorage();

  const next: ReportCategoryStorage = {
    ...current,
    studentSelections: {
      ...current.studentSelections,
      [examId]: {
        ...(current.studentSelections[examId] ?? {}),
        [studentId]: {
          ...(current.studentSelections[examId]?.[studentId] ?? {}),
          ...selections,
        },
      },
    },
  };

  writeReportCategoryStorage(next);
  return next;
};

export const saveReportExamFinalized = ({
  examId,
  finalized,
}: SaveExamFinalizedParams): ReportCategoryStorage => {
  // TODO: [BE-준비] BE 계약 확정 후 로컬 finalized map을 서버 기준 finalize 상태로 전환
  const current = readReportCategoryStorage();

  const next: ReportCategoryStorage = {
    ...current,
    examFinalizedMap: {
      ...current.examFinalizedMap,
      [examId]: finalized,
    },
  };

  writeReportCategoryStorage(next);
  return next;
};
