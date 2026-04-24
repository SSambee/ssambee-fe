"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useAuthContext } from "@/providers/AuthProvider";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import {
  signinAPI,
  signoutAPI,
  signupAssistantAPI,
  signupInstructorAPI,
  signupParentAPI,
  signupStudentAPI,
} from "@/services/auth.service";
import {
  LoginUser,
  RegisterUser,
  Role,
  SignupAssistantUser,
  SignupInstructorUser,
  SignupParentUser,
  SignupStudentUser,
} from "@/types/auth.type";

// API role 구분
export type LoginURLType = "MGMT" | "SVC";

export const API_URL_TYPE: Record<Role, LoginURLType> = {
  INSTRUCTOR: "MGMT",
  ASSISTANT: "MGMT",
  STUDENT: "SVC",
  PARENT: "SVC",
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useDialogAlert();

  const signup = async (data: RegisterUser) => {
    try {
      setLoading(true);

      let res;

      // 공통 필드 추출 (passwordConfirm 제외된 기준)
      const basePayload = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        agreePrivacy: data.agreePrivacy,
      };

      switch (data.userType) {
        case "INSTRUCTOR":
          res = await signupInstructorAPI({
            ...basePayload,
            userType: "INSTRUCTOR",
          } as SignupInstructorUser);
          break;

        case "ASSISTANT":
          res = await signupAssistantAPI({
            ...basePayload,
            userType: "ASSISTANT",
            signupCode: data.signupCode,
          } as SignupAssistantUser);
          break;

        case "STUDENT":
          res = await signupStudentAPI({
            ...basePayload,
            userType: "STUDENT",
            school: data.school,
            schoolYear: data.schoolYear,
            parentPhoneNumber: data.parentPhoneNumber,
          } as SignupStudentUser);
          break;

        case "PARENT":
          res = await signupParentAPI({
            ...basePayload,
            userType: "PARENT",
          } as SignupParentUser);
          break;

        default:
          throw new Error("알 수 없는 사용자 타입입니다.");
      }

      showAlert({ description: "회원가입 성공!" });

      // 회원가입 후 자동 로그인
      await signin({
        email: data.email,
        password: data.password,
        userType: data.userType,
        rememberMe: false,
      });

      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showAlert({
          description: err.response?.data?.message || "회원가입 실패",
        });
      } else {
        showAlert({ description: "알 수 없는 에러가 발생했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  const signin = async (data: LoginUser) => {
    try {
      setLoading(true);

      // userType 기반으로 role 결정
      const apiRole = API_URL_TYPE[data.userType];

      const res = await signinAPI(data, apiRole);

      const user = res.data?.data?.user;

      if (user) {
        showAlert({ description: "로그인 성공!" });
        setUser(user);

        // 역할별 메인 페이지(대시보드) 이동
        // TODO: 강사/조교/학생/학부모 구분한 라우팅
        if (apiRole === "MGMT") {
          router.push("/educators");
        } else {
          router.push("/learners");
        }
      } else {
        showAlert({ description: "사용자 정보를 가져오지 못했습니다." });
        return;
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showAlert({
          description: err.response?.data?.message || "로그인 실패!",
        });
      } else {
        showAlert({ description: "알 수 없는 에러가 발생했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  const signout = async (apiRole: LoginURLType) => {
    const targetPath =
      apiRole === "MGMT" ? "/educators/login" : "/learners/login";

    try {
      setLoading(true);
      await signoutAPI(apiRole);

      setUser(null);
      queryClient.clear();

      window.location.replace(targetPath);
    } catch (err) {
      console.error("로그아웃 처리 중 문제가 발생했습니다.", err);
      setLoading(false);
    }
  };

  return { signup, signin, signout, loading };
}
