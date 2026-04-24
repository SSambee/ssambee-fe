export type ReportCategory = {
  id: string;
  name: string;
  presets: string[];
};

export type ExamCategoryMap = Record<string, string[]>;

export type ReportStudentSelections = Record<
  string,
  Record<string, Record<string, string>>
>;

export type ReportExamFinalizedMap = Record<string, boolean>;

export type ReportCategoryStorage = {
  categories: ReportCategory[];
  examCategoryMap: ExamCategoryMap;
  studentSelections: ReportStudentSelections;
  examFinalizedMap: ReportExamFinalizedMap;
};

const STORAGE_KEY = "eduops.report.category-config.v1";
const STORAGE_EVENT = "eduops:report-category-storage-updated";

export const defaultReportCategories: ReportCategory[] = [
  {
    id: "seed-word",
    name: "단어 테스트",
    presets: ["O", "X"],
  },
  {
    id: "seed-homework",
    name: "과제 수행",
    presets: ["A", "B", "C", "D"],
  },
];

export const defaultReportCategoryStorage: ReportCategoryStorage = {
  categories: defaultReportCategories,
  examCategoryMap: {},
  studentSelections: {},
  examFinalizedMap: {},
};

let cachedRawStorage: string | null = null;
let cachedSnapshot: ReportCategoryStorage = defaultReportCategoryStorage;

const isStorageShape = (value: unknown): value is ReportCategoryStorage => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ReportCategoryStorage>;
  return (
    Array.isArray(candidate.categories) &&
    typeof candidate.examCategoryMap === "object" &&
    candidate.examCategoryMap !== null &&
    typeof candidate.studentSelections === "object" &&
    candidate.studentSelections !== null
  );
};

export const readReportCategoryStorage = (): ReportCategoryStorage => {
  if (typeof window === "undefined") {
    return defaultReportCategoryStorage;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw === cachedRawStorage) {
      return cachedSnapshot;
    }

    if (!raw) {
      cachedRawStorage = null;
      cachedSnapshot = defaultReportCategoryStorage;
      return cachedSnapshot;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isStorageShape(parsed)) {
      cachedRawStorage = raw;
      cachedSnapshot = defaultReportCategoryStorage;
      return cachedSnapshot;
    }

    cachedRawStorage = raw;
    cachedSnapshot = {
      categories:
        parsed.categories.length > 0
          ? parsed.categories
          : defaultReportCategoryStorage.categories,
      examCategoryMap: parsed.examCategoryMap,
      studentSelections: parsed.studentSelections,
      examFinalizedMap:
        typeof (parsed as Partial<ReportCategoryStorage>).examFinalizedMap ===
          "object" &&
        (parsed as Partial<ReportCategoryStorage>).examFinalizedMap !== null
          ? ((parsed as Partial<ReportCategoryStorage>)
              .examFinalizedMap as ReportExamFinalizedMap)
          : {},
    };

    return cachedSnapshot;
  } catch {
    cachedRawStorage = null;
    cachedSnapshot = defaultReportCategoryStorage;
    return cachedSnapshot;
  }
};

export const writeReportCategoryStorage = (next: ReportCategoryStorage) => {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(next);

  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn("[report-category-storage] write failed", error);
    return;
  }

  cachedRawStorage = serialized;
  cachedSnapshot = next;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
};

export const subscribeReportCategoryStorage = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    onStoreChange();
  };

  window.addEventListener(STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
};
