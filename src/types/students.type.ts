import z from "zod";

import {
  AttendanceRegisterSchema,
  classChangeSchema,
  editProfileSchema,
  studentCreateSchema,
} from "@/validation/students.validation";

// 학생 정보 타입
export type SchoolYear = "중1" | "중2" | "중3" | "고1" | "고2" | "고3";
export type StudentStatus = "ACTIVE" | "DROPPED" | "PAUSED"; // 학생 수강 상태
export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EARLY_LEAVE"; // 출석 상태
export type ExamClinicStatus = "PENDING" | "COMPLETED"; // 클리닉 상태

// RHF 폼 데이터 타입
export type StudentCreateFormData = z.infer<typeof studentCreateSchema>;
export type ClassChangeFormData = z.infer<typeof classChangeSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type AttendanceRegisterFormData = z.infer<
  typeof AttendanceRegisterSchema
>;

export type EditProfileFormDataType = EditProfileFormData & {
  id: string;
};

// 서버 응답 공통 포맷
export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T;
};

// 학생 목록 조회 쿼리 타입
export type Student = {
  id: string;
  studentName: string;
  email?: string | null; // 미등록 학생일 경우 빈 문자열
  studentPhone: string;
  parentPhone: string;
  school: string;
  schoolYear: string;
  status: StudentStatus;
  memo: string | null;
  registeredAt: string;
  appStudentId: boolean | null;
  profileImage?: string | null;
  attendanceRate?: number; // 데이터가 없음!
  lecture: {
    id: string;
    title: string;
    subject?: string;
    instructor?: {
      id: string;
      name: string;
    };
  };
};

// 출결 정보 (개별 객체)
export type Attendance = {
  id: string;
  enrollmentId?: string;
  date: string;
  status: AttendanceStatus;
  enterTime?: string | null;
  leaveTime?: string | null;
  memo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationType = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// GET /enrollments 응답 데이터
export type EnrollmentListResponse = {
  list: Student[];
  pagination: PaginationType;
};

// GET /enrollments/:id 응답 데이터
export type EnrollmentDetailResponse = {
  enrollment: Student & {
    attendances: Pick<Attendance, "id" | "date" | "status">[];
  };
};

// GET /enrollments/:id/attendances 응답 데이터 (통계 포함)
export type AttendanceListWithStatsResponse = {
  stats: {
    totalCount: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    earlyLeaveCount: number;
    attendanceRate: number;
    absentRate: number;
  };
  attendances: Attendance[];
};

// GET /enrollments 쿼리 파라미터
export type StudentListQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  year?: SchoolYear | null;
  status?: StudentStatus | null;
  lectureId?: string | null;
  includeClosed?: boolean; // 종강 포함 여부? //TODO: 클래스 상태 관련 필터 없음
};

// PATCH /enrollments/:id 요청 바디
export type UpdateStudentRequest = Partial<
  Pick<Student, "school" | "schoolYear" | "memo" | "status">
>;

// export type UpdateStudentRequest = {
//   school?: string;
//   schoolYear?: string;
//   status?: StudentStatus;
//   memo?: string | null;
// };

// POST /enrollments/:id/attendances 요청 바디
export type CreateAttendanceRequest = {
  date: string;
  status: AttendanceStatus;
  enterTime?: string;
  leaveTime?: string;
  memo?: string | null;
};

// mock data type 삭제 예정
export type StudentEnrollmentStatus = "재원" | "휴원" | "퇴원";
export type StudentEnrollment = {
  enrollmentId: string;
  registeredAt: string;
  status: StudentEnrollmentStatus;
  id: string | null;
  name: string;
  email: string;
  phoneNumber: string;
  parentPhone: string;
  school: string;
  schoolYear: string;
  profileImage?: string;
  isAppUser: boolean;
  lecture: {
    id: string;
    title: string;
    subject?: string;
    isActive: boolean;
  };
  attendance: {
    percentage: number;
    summary: {
      PRESENT?: number;
      LATE?: number;
      ABSENT?: number;
      EARLY_LEAVE?: number;
    };
    records: {
      date: string;
      status: AttendanceStatus;
      memo?: string | null;
    }[];
  };
  exams: {
    id: string;
    title: string;
    score: number;
    cutoffScore: number;
    isPass: boolean;
    clinics: {
      id: string;
      title: string;
      status: ExamClinicStatus;
      deadline?: string;
    }[];
  }[];
  extraInfo?: {
    memo?: string;
    consultationRecords?: string[];
  };
};
