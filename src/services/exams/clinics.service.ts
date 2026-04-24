import { axiosClient } from "@/services/axiosClient";
import { ApiResponse } from "@/types/api";
import type {
  ClinicListItemApi,
  CompleteGradingPayload,
  CompleteGradingResponse,
  FetchClinicsQuery,
  UpdateClinicsPayload,
} from "@/types/clinics";

export const completeGradingAPI = async (
  examId: string,
  payload: CompleteGradingPayload = {}
): Promise<CompleteGradingResponse> => {
  const { data } = await axiosClient.post<ApiResponse<CompleteGradingResponse>>(
    `/exams/${examId}/grades/complete`,
    payload
  );

  return data.data;
};

export const fetchClinicsAPI = async (
  query: FetchClinicsQuery = {}
): Promise<ClinicListItemApi[]> => {
  const { data } = await axiosClient.get<ApiResponse<ClinicListItemApi[]>>(
    "/clinics",
    { params: query }
  );

  return data.data ?? [];
};

export const updateClinicsAPI = async (
  payload: UpdateClinicsPayload
): Promise<CompleteGradingResponse> => {
  const { data } = await axiosClient.patch<
    ApiResponse<CompleteGradingResponse>
  >("/clinics", payload);

  return data.data;
};
