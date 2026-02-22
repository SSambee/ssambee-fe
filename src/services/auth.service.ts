import type { AxiosError } from "axios";

import type { ApiResponse } from "@/types/api";
import {
  EmailVerificationData,
  LoginUser,
  SignupAssistantUser,
  SignupInstructorUser,
  SignupParentUser,
  SignupStudentUser,
} from "@/types/auth.type";

import { axiosClient, axiosClientPublic, axiosClientSVC } from "./axiosClient";

// 인증코드 검증 API
export const verifyAuthCodeAPI = async (signupCode: string) => {
  try {
    const { data } = await axiosClient.get<ApiResponse<{ isValid: boolean }>>(
      "/assistant-codes/validate",
      {
        params: { code: signupCode },
      }
    );

    if (data?.data?.isValid) {
      return { success: true, message: "인증번호 매칭 완료!" };
    }

    return {
      success: false,
      message: data?.message ?? "인증번호가 일치하지 않습니다.",
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ??
        axiosError.message ??
        "인증번호 확인 중 오류가 발생했습니다.",
    };
  }
};

// 이메일 인증 API
export const verifyEmailAPI = async (email: string, otp?: string) => {
  try {
    const { data } = await axiosClientPublic.post<
      ApiResponse<EmailVerificationData>
    >("/auth/email-verification", {
      email,
      ...(otp ? { otp } : {}), // otp가 있으면 검증, 없으면 발송
    });

    return {
      success: data.status === "success",
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "오류가 발생했습니다.",
    };
  }
};

// 전화번호 인증 API
// export const verifyPhoneAPI = async (phoneNumber: string) => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // 이미 가입된 전화번호면 인증 실패
//   if (SUBSCRIBED_PHONE_NUMBERS.includes(phoneNumber)) {
//     return { success: false, message: "이미 가입된 번호입니다." };
//   } else {
//     // 가입되지 않은 전화번호면 인증 성공
//     return { success: true, message: "전화번호 인증 완료!" };
//   }
// };

// 회원가입 API --------------------
export const signupInstructorAPI = (data: SignupInstructorUser) => {
  return axiosClient.post("/auth/instructor/signup", data);
};

export const signupAssistantAPI = (data: SignupAssistantUser) => {
  return axiosClient.post("/auth/assistant/signup", data);
};

export const signupStudentAPI = (data: SignupStudentUser) => {
  return axiosClientSVC.post("/auth/student/signup", data);
};

export const signupParentAPI = (data: SignupParentUser) => {
  return axiosClientSVC.post("/auth/parent/signup", data);
};

// 로그인 API ---------------------
export const signinAPI = (data: LoginUser, role: "MGMT" | "SVC" = "MGMT") => {
  const client = role === "MGMT" ? axiosClient : axiosClientSVC;
  return client.post("/auth/signin", data);
};
// 로그아웃 API ---------------------
export const signoutAPI = (role: "MGMT" | "SVC" = "MGMT") => {
  const client = role === "MGMT" ? axiosClient : axiosClientSVC;
  return client.post("/auth/signout");
};
// 세션 조회 API ---------------------
export const getSessionAPI = (role: "MGMT" | "SVC" = "MGMT") => {
  const client = role === "MGMT" ? axiosClient : axiosClientSVC;
  return client.get("/auth/session");
};
