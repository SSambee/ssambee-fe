import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";
import type {
  CreateScheduleCategoryPayload,
  CreateSchedulePayload,
  FetchSchedulesQuery,
  ScheduleApi,
  ScheduleCategoryApi,
  UpdateSchedulePayload,
  UpdateScheduleCategoryPayload,
} from "@/types/schedules";

export const fetchSchedulesAPI = async (
  query: FetchSchedulesQuery
): Promise<ScheduleApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<ScheduleApi[]>>(
    "/schedules",
    {
      params: query,
    }
  );

  return data.data ?? [];
};

export const fetchScheduleCategoriesAPI = async (): Promise<
  ScheduleCategoryApi[]
> => {
  const { data } = await axiosClient.get<ApiResponse<ScheduleCategoryApi[]>>(
    "/schedule-categories"
  );

  return data.data ?? [];
};

export const createScheduleAPI = async (
  payload: CreateSchedulePayload
): Promise<ScheduleApi> => {
  const { data } = await axiosClient.post<ApiResponse<ScheduleApi>>(
    "/schedules",
    payload
  );

  if (!data?.data) {
    throw new Error("일정 생성 결과가 비어 있습니다.");
  }

  return data.data;
};

export const updateScheduleAPI = async (
  scheduleId: string,
  payload: UpdateSchedulePayload
): Promise<ScheduleApi> => {
  const { data } = await axiosClient.patch<ApiResponse<ScheduleApi>>(
    `/schedules/${scheduleId}`,
    payload
  );

  if (!data?.data) {
    throw new Error("일정 수정 결과가 비어 있습니다.");
  }

  return data.data;
};

export const deleteScheduleAPI = async (scheduleId: string): Promise<void> => {
  await axiosClient.delete<ApiResponse<void>>(`/schedules/${scheduleId}`);
};

export const createScheduleCategoryAPI = async (
  payload: CreateScheduleCategoryPayload
): Promise<ScheduleCategoryApi> => {
  const { data } = await axiosClient.post<ApiResponse<ScheduleCategoryApi>>(
    "/schedule-categories",
    payload
  );

  if (!data?.data) {
    throw new Error("카테고리 생성 결과가 비어 있습니다.");
  }

  return data.data;
};

export const updateScheduleCategoryAPI = async (
  categoryId: string,
  payload: UpdateScheduleCategoryPayload
): Promise<ScheduleCategoryApi> => {
  const { data } = await axiosClient.patch<ApiResponse<ScheduleCategoryApi>>(
    `/schedule-categories/${categoryId}`,
    payload
  );

  if (!data?.data) {
    throw new Error("카테고리 수정 결과가 비어 있습니다.");
  }

  return data.data;
};

export const deleteScheduleCategoryAPI = async (
  categoryId: string
): Promise<void> => {
  await axiosClient.delete<ApiResponse<void>>(
    `/schedule-categories/${categoryId}`
  );
};
