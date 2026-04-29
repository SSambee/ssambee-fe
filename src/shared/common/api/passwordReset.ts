import type { AxiosError } from "axios";

import type { ApiResponse } from "@/shared/common/types/api";

import { axiosClientPublic } from "./axiosClient";

type AuthStatusMessage = Pick<ApiResponse<unknown>, "status" | "message">;

export const postFindPassword = async (email: string) => {
  try {
    const { data } = await axiosClientPublic.post<AuthStatusMessage>(
      "/auth/find-password",
      { email }
    );

    return {
      success: data.status === "success",
      message: data.message ?? "",
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      message:
        axiosError.response?.data?.message ??
        axiosError.message ??
        "요청 처리 중 오류가 발생했습니다.",
    };
  }
};

export type ResetPasswordBody = {
  email: string;
  otp: string;
  newPassword: string;
};

export const postResetPassword = async (body: ResetPasswordBody) => {
  try {
    const { data } = await axiosClientPublic.post<AuthStatusMessage>(
      "/auth/reset-password",
      body
    );

    return {
      success: data.status === "success",
      message: data.message ?? "",
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const statusCode = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message ?? "";

    return {
      success: false,
      message:
        statusCode === 400
          ? "이메일 또는 인증번호를 확인해주세요."
          : serverMessage ||
            axiosError.message ||
            "요청 처리 중 오류가 발생했습니다.",
    };
  }
};
