import {
  ApiResponse,
  EnrollmentListQuery,
  GetEnrollmentList,
  CreateEnrollment,
  GetEnrollmentDetail,
  UpdateEnrollmentInfo,
  CreateAllAttendance,
  CreateEnrollmentAttendance,
  PaginationType,
  GetEnrollmentAttendanceStats,
  LectureStatus,
  MigrateStudents,
  LectureEnrollmentDetail,
} from "@/types/students.type";

import { axiosClient } from "../shared/common/api/axiosClient";

// 수강생 리스트 API ---------------------

// 전체 수강생 목록 조회
export const getEnrollmentsAPI = (query?: EnrollmentListQuery) =>
  axiosClient
    .get<
      ApiResponse<{ list: GetEnrollmentList[]; pagination: PaginationType }>
    >("/enrollments", { params: query })
    .then((res) => res.data);

// 수강생 등록
export const createEnrollmentAPI = (
  lectureId: string,
  data: Omit<CreateEnrollment, "lectureId"> // payload에서 lectureId를 제외한 나머지
) =>
  axiosClient
    .post<
      ApiResponse<CreateEnrollment>
    >(`/lectures/${lectureId}/enrollments`, { ...data, lectureId })
    .then((res) => res.data);

// 강의 목록 조회
export const getLecturesAPI = (query?: { page?: number; limit?: number }) =>
  axiosClient
    .get<
      ApiResponse<{
        lectures: {
          id: string;
          title: string;
          status?: LectureStatus;
        }[];
        pagination: PaginationType;
      }>
    >("/lectures", { params: query })
    .then((res) => res.data);

// 수강생 단체 강의 변경
export const migrateStudentsAPI = (
  lectureId: string,
  payload: MigrateStudents
) =>
  axiosClient
    .post<
      ApiResponse<MigrateStudents>
    >(`/lectures/${lectureId}/enrollments/migration`, payload)
    .then((res) => res.data);

// 수강생 단체 출결 등록
export const createAllAttendanceAPI = (
  lectureId: string,
  data: CreateAllAttendance
) =>
  axiosClient
    .post<
      ApiResponse<CreateAllAttendance>
    >(`/lectures/${lectureId}/enrollments/attendances`, data)
    .then((res) => res.data);

// 수강생 상세 조회------------------------------------------------------
export const getEnrollmentByIdAPI = (id: string) =>
  axiosClient
    .get<ApiResponse<{ enrollment: GetEnrollmentDetail }>>(`/enrollments/${id}`)
    .then((res) => res.data);

// 수강생 개별 정보 수정
export const updateEnrollmentAPI = (
  enrollmentId: string,
  data: UpdateEnrollmentInfo
) =>
  axiosClient
    .patch<
      ApiResponse<{ enrollment: GetEnrollmentDetail }>
    >(`/enrollments/${enrollmentId}`, data)
    .then((res) => res.data);

// 수강생 개별 출결 조회
export const getAttendancesAPI = (lectureId: string, enrollmentId: string) =>
  axiosClient
    .get<
      ApiResponse<GetEnrollmentAttendanceStats>
    >(`/lectures/${lectureId}/enrollments/${enrollmentId}/attendances`)
    .then((res) => res.data);

// 수강생 개별 출결 등록
export const createAttendanceAPI = (
  lectureId: string,
  enrollmentId: string,
  data: CreateEnrollmentAttendance
) =>
  axiosClient
    .post<
      ApiResponse<CreateEnrollmentAttendance>
    >(`/lectures/${lectureId}/enrollments/${enrollmentId}/attendances`, data)
    .then((res) => res.data);

// 수강생 개별 출결 삭제
export const deleteAttendanceAPI = (attendanceId: string) =>
  axiosClient.delete(`/attendances/${attendanceId}`);

// 강의 성적 차트 조회
export const getLectureEnrollmentDetailAPI = (lectureEnrollmentId: string) =>
  axiosClient
    .get<
      ApiResponse<LectureEnrollmentDetail>
    >(`/lectureEnrollments/${lectureEnrollmentId}`)
    .then((res) => res.data);
