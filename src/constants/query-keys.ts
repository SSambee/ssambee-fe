import type { LecturesListQuery } from "@/types/lectures";

/**
 * Lecture Query Keys Factory
 * 추후 업데이트를 한다면 queryOptions 으로 수정예정
 * - 일관된 쿼리 키 관리
 * - 타입 안전성 보장
 * - 캐시 무효화 용이
 */
export const lectureKeys = {
  all: ["lectures"] as const,
  lists: () => [...lectureKeys.all, "list"] as const,
  list: (query: LecturesListQuery) => [...lectureKeys.lists(), query] as const,
  details: () => [...lectureKeys.all, "detail"] as const,
  detail: (id: string) => [...lectureKeys.details(), id] as const,
  todays: () => [...lectureKeys.all, "today"] as const,
  today: (day: number) => [...lectureKeys.todays(), day] as const,
};

/**
 * Exam Query Keys Factory
 */
export const examKeys = {
  all: ["exams"] as const,
  lists: () => [...examKeys.all, "list"] as const,
  listAll: () => [...examKeys.lists(), "all"] as const,
  listByLecture: (lectureId: string) =>
    [...examKeys.lists(), { lectureId }] as const,
  details: () => [...examKeys.all, "detail"] as const,
  detail: (examId: string) => [...examKeys.details(), examId] as const,
  grades: (examId: string) =>
    [...examKeys.details(), examId, "grades"] as const,
  gradeDetail: (gradeId: string) =>
    [...examKeys.details(), "grade", gradeId] as const,
  statistics: (examId: string) =>
    [...examKeys.details(), examId, "statistics"] as const,
};

/**
 * Clinic Query Keys Factory
 */
export const clinicKeys = {
  all: ["clinics"] as const,
  lists: () => [...clinicKeys.all, "list"] as const,
  list: (query: Record<string, string | undefined>) =>
    [...clinicKeys.lists(), query] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  learnerMe: () => [...profileKeys.all, "learner", "me"] as const,
};

type DashboardHomeQuery = {
  inquiryPage: number;
  inquiryLimit: number;
  inquiryOrderBy: "latest" | "oldest";
  taskPage: number;
  taskLimit: number;
  taskStatus?: "PENDING" | "IN_PROGRESS" | "END";
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  educatorsHome: () => [...dashboardKeys.all, "educators-home"] as const,
  educatorsHomeWithQuery: (query: DashboardHomeQuery) =>
    [...dashboardKeys.educatorsHome(), query] as const,
};
