import axios, { AxiosError } from "axios";

import { ApiResponse } from "@/types/api";

export const axiosClientPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_PUBLIC,
  headers: {},
  withCredentials: true,
});

// 강사 및 조교 전용
export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {},
  withCredentials: true, // better-auth는 쿠키로 세션 전달
});

// 학생 및 학부모 전용
export const axiosClientSVC = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_SVC,
  headers: {},
  withCredentials: true,
});

const getErrorMessage = (error: AxiosError<ApiResponse<unknown>>) => {
  if (!error.response) {
    return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  const status = error.response.status;
  const apiMessage = error.response.data?.message;

  if (apiMessage) return apiMessage;
  if (status === 401) return "인증이 필요합니다.";
  if (status === 403) return "접근 권한이 없습니다.";
  if (status >= 500) return "서버 오류가 발생했습니다.";

  return "요청 처리 중 오류가 발생했습니다.";
};

const attachErrorInterceptor = (client: typeof axiosClient) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse<unknown>>) => {
      const message = getErrorMessage(error);

      if (error.response?.data && typeof error.response.data === "object") {
        if (!("message" in error.response.data)) {
          (error.response.data as { message?: string }).message = message;
        }
      }

      error.message = message;
      return Promise.reject(error);
    }
  );
};

attachErrorInterceptor(axiosClient);
attachErrorInterceptor(axiosClientSVC);
