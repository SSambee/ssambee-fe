import z from "zod";

import {
  AttendanceRegisterSchema,
  classChangeSchema,
  editProfileSchema,
  studentCreateSchema,
} from "@/validation/students.validation";

// 학생 정보 타입
export type SchoolYear = "중1" | "중2" | "중3" | "고1" | "고2" | "고3";
export type LectureStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
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

// 프로필 수정 폼 데이터 타입
export type EditProfileFormDataType = EditProfileFormData & {
  id: string;
};

// 서버 응답 공통 포맷
export type ApiResponse<T> = {
  status: "success" | "error";
  data: T;
  message: string;
};

/**
 * 수강생 목록 페이지 ------------------------------------------------------------
 */

// 강의 목록 조회: GET /lectures
export type LectureListQuery = {
  lectures: {
    id: string;
    title: string;
  }[];
};

// 수강생 목록 조회 쿼리: GET /enrollments
export type EnrollmentListQuery = {
  page?: number | null;
  limit?: number | null;
  keyword?: string | null;
  year?: SchoolYear | null;
  status?: StudentStatus | null;
  lecture?: string | null;
  examId?: string | null;
};

// 전체 수강생 목록 조회: GET /enrollments
export type GetEnrollmentList = {
  id: string;
  studentName: string;
  status: StudentStatus;
  appStudentId: boolean | null;
  school: string;
  schoolYear: string;
  studentPhone: string;
  parentPhone: string;
  registeredAt: string;
  attendance: {
    id: string;
    date: string;
    status: AttendanceStatus;
  };
  lecture: {
    title: string;
  };
};

// 수강생 목록 조회 페이지네이션
export type PaginationType = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// 수강생 목록 조회 응답
export type EnrollmentListResponse = {
  list: GetEnrollmentList[];
  pagination: PaginationType;
};

// 수강생 등록: POST /lectures/:lectureId/enrollments
export type CreateEnrollment = {
  studentName: string;
  studentPhone: string;
  school: string;
  schoolYear: string;
  parentPhone: string;
  lectureId: string;
  registrationDate: string;
  memo?: string | null;
};

// 단체 수업 변경: POST /lectures/:lectureId/enrollments/migration
export type MigrateStudents = {
  enrollmentIds: string[];
  // memo?: string | null;
};

// 단체 출결 등록: POST /attendances
export type CreateAllAttendance = {
  date: string;
  attendances: {
    enrollmentId: string;
    status: AttendanceStatus;
  }[];
};

/**
 * 수강생 상세 페이지 ------------------------------------------------------------
 */

// 수강생 상세 조회 /enrollments/:id
export type GetEnrollmentDetail = {
  id: string;
  studentName: string;
  appStudentId: boolean | null;
  status: StudentStatus;
  email?: string | null; // 미등록 학생일 경우 빈 문자열
  studentPhone: string;
  parentPhone: string;
  school: string;
  schoolYear: string;
  memo: string | null;
  registeredAt: string;
  instructorName: string;
  lectures: {
    id: string;
    title: string;
    subject: string;
    schoolYear: string;
    description: string;
    status: LectureStatus;
    lectureEnrollmentId: string;
    lectureTimes: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  }[];
};

// 개별 정보 수정: PATCH /enrollments/:enrollmentId
export type UpdateEnrollmentInfo = {
  school?: string;
  schoolYear?: string;
  status?: StudentStatus;
  registeredAt?: string;
  memo?: string | null;
};

// 개별 출결 상세 조회: GET /:enrollmentId/attendances
export type GetEnrollmentAttendance = {
  id: string;
  lectureId: string;
  enrollmentId: string;
  lectureEnrollmentId: string;
  date: string;
  status: AttendanceStatus;
  enterTime?: string | null;
  leaveTime?: string | null;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Attendance 타입 (테이블 표시용)
export type AttendanceList = {
  id: string;
  date: string;
  status: AttendanceStatus;
  memo?: string | null;
};

export type GetEnrollmentAttendanceStats = {
  stats: {
    totalCount: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    earlyLeaveCount: number;
    attendanceRate: number;
    absentRate: number;
  };
  attendances: GetEnrollmentAttendance[];
};

// 개별 출결 등록: POST /:enrollmentId/attendances
export type CreateEnrollmentAttendance = {
  date: string;
  status: AttendanceStatus;
  memo?: string | null;
};

// 강의 시험 조회: GET /lectureEnrollments/:lectureEnrollmentsId
export type LectureEnrollmentDetail = {
  lectureEnrollmentId: string;
  attendanceRate?: number | null;
  attendances?: {
    id: string;
    date: string;
    status: AttendanceStatus;
    memo?: string | null;
  }[];
  lecture: {
    title: string;
    instructor: {
      name: string;
    };
    subject: string;
    schoolYear: string;
  };
  enrollment: {
    name: string;
    school: string;
    status: "ACTIVE" | "PAUSED" | "DROPPED";
  };
  grades: {
    gradeId?: string;
    exam: {
      id: string;
      title: string;
      examType?: string | null;
      examDate: string;
      subject: string;
      average: number;
      totalExaminees: number;
    };
    grade: {
      score: number;
      rank: number;
    };
  }[];
};
