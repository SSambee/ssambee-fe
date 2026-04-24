import { axiosClient, axiosClientSVC } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";
import type {
  MyProfileApiResponse,
  UpdateMyProfilePayload,
} from "@/types/profile.api";

type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
};

export const fetchMyProfileAPI = async (): Promise<MyProfileApiResponse> => {
  const { data } =
    await axiosClient.get<ApiResponse<MyProfileApiResponse>>("/me");

  return data.data;
};

export const updateMyProfileAPI = async (
  payload: UpdateMyProfilePayload
): Promise<MyProfileApiResponse> => {
  const { data } = await axiosClient.patch<ApiResponse<MyProfileApiResponse>>(
    "/me",
    payload
  );

  return data.data;
};

export const changeMyPasswordAPI = async (
  payload: ChangeMyPasswordPayload,
  role: "MGMT" | "SVC" = "MGMT"
): Promise<void> => {
  const client = role === "MGMT" ? axiosClient : axiosClientSVC;

  await client.patch<ApiResponse<unknown>>("/me/password", payload);
};
