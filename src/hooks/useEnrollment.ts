"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "@/services/students.service";
import {
  AttendanceStatus,
  CreateEnrollment,
  CreateEnrollmentAttendance,
  EnrollmentListQuery,
  UpdateEnrollmentInfo,
} from "@/types/students.type";
import { getTodayYMD } from "@/utils/date";

// 강의 목록 조회
export const useLecturesList = (query?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: ["lectures", query],
    queryFn: () => api.getLecturesAPI(query),
    select: (res) => res.data.lectures,
    staleTime: 1000 * 60, // 강의 목록 1분 캐시
  });

// 전체 수강생 목록 조회
export const useEnrollmentList = (query?: EnrollmentListQuery) =>
  useQuery({
    queryKey: ["enrollments", query],
    queryFn: () => api.getEnrollmentsAPI(query),
    select: (res) => ({
      list: res.data.list,
      pagination: res.data.pagination,
    }),
    staleTime: 1000 * 30, // 30초 동안은 캐시된 데이터 사용
    placeholderData: (previousData) => previousData, // 페이지 전환 시 깜빡임 방지
  });

// 수강생 등록
export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lectureId,
      data,
    }: {
      lectureId: string;
      data: CreateEnrollment;
    }) => api.createEnrollmentAPI(lectureId, data),
    onSuccess: () => {
      // 학생 목록 무효화해서 최신화
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

// 수강생 단체 출결 등록
export const useUpdateAllAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lectureId,
      enrollmentIds,
      status = "PRESENT", // 기본값은 출석
    }: {
      lectureId: string;
      enrollmentIds: string[];
      status: AttendanceStatus;
    }) => {
      const payload = {
        date: getTodayYMD(),
        attendances: enrollmentIds.map((id) => ({
          enrollmentId: id,
          status: status,
        })),
      };
      return api.createAllAttendanceAPI(lectureId, payload);
    },
    onSuccess: () => {
      alert("일괄 출결 등록이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error) => {
      console.error("출결 등록 실패:", error);
      alert("재원 상태인 학생만 출결 등록 가능합니다.");
    },
  });
};
// 수강생 단체 강의 변경
export const useMigrateStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lectureId,
      enrollmentIds,
    }: {
      lectureId: string;
      enrollmentIds: string[];
    }) => api.migrateStudentsAPI(lectureId, enrollmentIds),
    onSuccess: () => {
      alert("수업 변경이 완료되었습니다.");
      // 학생 목록 및 관련 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error) => {
      console.error("수업 변경 실패:", error);
      alert("수업 변경 중 오류가 발생했습니다.");
    },
  });
};

// 수강생 상세 조회------------------------------------------------------
export const useEnrollmentDetail = (id: string) =>
  useQuery({
    queryKey: ["enrollments", "detail", id],
    queryFn: () => api.getEnrollmentByIdAPI(id),
    select: (res) => res.data.enrollment,
  });

// 수강생 정보 수정
export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentInfo }) =>
      api.updateEnrollmentAPI(id, data),
    onSuccess: (_, { id }) => {
      // 수강생 목록 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      // 수강생 상세 데이터 갱신
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "detail", id],
      });
    },
  });
};

// 수강생 출결 목록 조회(출결 목록 & 통계)
export const useEnrollmentAttendances = (
  lectureId: string | undefined,
  enrollmentId: string
) =>
  useQuery({
    queryKey: ["enrollments", "attendances", lectureId, enrollmentId],
    queryFn: () => api.getAttendancesAPI(lectureId!, enrollmentId),
    enabled: !!lectureId, // lectureId가 있을 때만 실행
    select: (res) => res.data,
  });

// 수강생 출결 등록
export const useCreateAttendance = (
  lectureId: string,
  enrollmentId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEnrollmentAttendance) =>
      api.createAttendanceAPI(lectureId, enrollmentId, data),

    onSuccess: () => {
      alert("출결 등록이 완료되었습니다.");

      queryClient.invalidateQueries({
        queryKey: ["enrollments", "attendances", lectureId, enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },

    onError: (error) => {
      console.error("출결 등록 실패:", error);
      alert("출결 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
