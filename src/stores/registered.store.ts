import { create } from "zustand";

import { AuthStore, SchoolInfoStore } from "@/types/auth.type";

export const useAuthStore = create<AuthStore>((set) => ({
  isPhoneVerified: false, // 전화번호 인증 완료 여부
  signupCode: "", // 인증 코드 입력값 -> 회원가입 데이터 객체에 포함시키기 위함
  isCodeVerified: false, // 인증 코드 서버 검증 완료 여부

  setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),
  setAuthCode: (code) => set({ signupCode: code }),
  setCodeVerified: (verified) => set({ isCodeVerified: verified }),

  resetAuth: () =>
    set({
      isPhoneVerified: false,
      signupCode: "",
      isCodeVerified: false,
    }),
}));

export const useSchoolStore = create<SchoolInfoStore>((set) => ({
  school: "", // 학교명
  schoolYear: "", // 학년
  isSchoolInfoValid: false, // 학교 정보 검증 완료 여부

  setSchoolInfo: (data) => set(data),
  setSchoolInfoValid: (valid) => set({ isSchoolInfoValid: valid }),
  resetSchoolInfo: () =>
    set({
      school: "",
      schoolYear: "",
      isSchoolInfoValid: false,
    }),
}));
