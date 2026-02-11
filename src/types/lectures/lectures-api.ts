/**
 * Lectures API 타입 정의
 * - 백엔드 API 요청/응답 타입
 * - View 타입(lectures.ts)과 분리
 */

// ============================================
// API 상태 타입
// ============================================
export type LectureApiStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

// ============================================
// API 요청 타입
// ============================================
export type LecturesListQuery = {
  page: number;
  limit: number;
  search?: string;
  day?: number;
};

export type LectureTimeApi = {
  day: string;
  startTime: string;
  endTime: string;
};

export type LectureEnrollmentCreateApi = {
  school: string;
  schoolYear: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
};

export type LectureCreatePayload = {
  title: string;
  schoolYear?: string;
  subject?: string;
  description?: string;
  status?: LectureApiStatus;
  startAt?: string | null;
  endAt?: string | null;
  lectureTimes?: LectureTimeApi[];
  enrollments?: LectureEnrollmentCreateApi[];
};

export type LectureUpdatePayload = Partial<
  Omit<LectureCreatePayload, "enrollments">
>;

// ============================================
// API 응답 타입
// ============================================
export type LecturesPagination = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type LectureApi = {
  id: string;
  title: string;
  color?: string | null;
  schoolYear?: string | null;
  subject?: string | null;
  description?: string | null;
  status?: LectureApiStatus | null;
  startAt?: string | null;
  endAt?: string | null;
  instructorName?: string | null;
  enrollmentsCount?: number | null;
  lectureTimes?: LectureTimeApi[];
};

export type LectureDetailStudentApi = {
  id: string;
  name: string;
  school: string;
  phone: string;
  parentPhone: string;
};

export type LectureDetailApi = LectureApi & {
  students?: LectureDetailStudentApi[];
};

export type LecturesListApiResponse = {
  lectures: LectureApi[];
  pagination: LecturesPagination;
};

export type LectureEnrollmentApi = {
  id: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  school: string;
  schoolYear: string;
};

export type LectureEnrollmentGradeItemApi = {
  exam: {
    title: string;
    examDate: string | null;
    subject?: string | null;
    average: number;
    totalExaminees: number;
  };
  grade: {
    score: number;
    rank: number;
  };
};

export type LectureEnrollmentDetailApi = {
  lectureEnrollmentId: string;
  lecture: {
    title: string;
    instructor: { name: string };
    subject?: string | null;
    schoolYear?: string | null;
  };
  enrollment: {
    name: string;
    school: string;
    status: string;
  };
  grades: LectureEnrollmentGradeItemApi[];
};
