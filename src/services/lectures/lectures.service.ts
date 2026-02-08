import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type { LectureStudent } from "@/types/lectures";
import type {
  LectureApi,
  LectureCreatePayload,
  LectureDetailApi,
  LectureEnrollmentDetailApi,
  LectureEnrollmentApi,
  LectureUpdatePayload,
  LecturesListApiResponse,
  LecturesListQuery,
} from "@/types/lectures";

export type {
  LectureCreatePayload,
  LectureUpdatePayload,
  LecturesListQuery,
  LecturesPagination,
} from "@/types/lectures";

export {
  mapLectureApiToView,
  mapLectureDetailApiToView,
  mapLectureStatusToApi,
} from "@/services/lectures/lectures.mapper";

export const fetchLecturesAPI = async (
  query: LecturesListQuery
): Promise<LecturesListApiResponse> => {
  const { data } = await axiosClient.get<ApiResponse<LecturesListApiResponse>>(
    "/lectures",
    { params: query }
  );

  return data.data;
};

export const fetchLectureDetailAPI = async (
  id: string
): Promise<LectureDetailApi> => {
  const { data } = await axiosClient.get<ApiResponse<LectureDetailApi>>(
    `/lectures/${id}`
  );

  return data.data;
};

export const fetchLectureEnrollmentsAPI = async (
  lectureId: string
): Promise<LectureStudent[]> => {
  const { data } = await axiosClient.get<
    ApiResponse<{ enrollments: LectureEnrollmentApi[] }>
  >(`/lectures/${lectureId}/enrollments`);
  const payload = data.data?.enrollments;

  if (!payload) return [];

  return payload.map((enrollment) => ({
    id: enrollment.id,
    name: enrollment.studentName,
    school: enrollment.school,
    schoolYear: enrollment.schoolYear,
    phone: enrollment.studentPhone,
    parentPhone: enrollment.parentPhone,
  }));
};

export const fetchLectureEnrollmentDetailAPI = async (
  lectureEnrollmentId: string
): Promise<LectureEnrollmentDetailApi> => {
  const { data } = await axiosClient.get<
    ApiResponse<LectureEnrollmentDetailApi>
  >(`/lectureEnrollments/${lectureEnrollmentId}`);

  if (!data?.data) {
    throw new Error("수강생 성적 정보를 찾을 수 없습니다.");
  }

  return data.data;
};

export const createLectureAPI = async (payload: LectureCreatePayload) => {
  const { data } = await axiosClient.post<ApiResponse<LectureApi>>(
    "/lectures",
    payload
  );
  return data;
};

export const updateLectureAPI = async (
  id: string,
  payload: LectureUpdatePayload
) => {
  const { data } = await axiosClient.patch<ApiResponse<LectureApi>>(
    `/lectures/${id}`,
    payload
  );
  return data;
};

export const deleteLectureAPI = async (id: string) => {
  const { data } = await axiosClient.delete<ApiResponse<void>>(
    `/lectures/${id}`
  );
  return data;
};
