import {
  defaultReportCategoryStorage,
  readReportCategoryStorage,
  subscribeReportCategoryStorage,
  writeReportCategoryStorage,
  type ExamCategoryMap,
  type ReportCategory,
  type ReportCategoryStorage,
  type ReportStudentSelections,
} from "@/lib/report-category-storage";

export type {
  ReportCategory,
  ExamCategoryMap,
  ReportStudentSelections,
  ReportCategoryStorage,
};

type SaveStudentSelectionParams = {
  examId: string;
  studentId: string;
  selections: Record<string, string>;
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
