import { z } from "zod";

import {
  loginSchema,
  authCodeSchema,
  schoolInfoSchema,
  registerRequestSchema,
  registerFormSchema,
  parentPhoneSchema,
} from "@/validation/auth.validation";

// 역할 타입
export type EducatorRole = "INSTRUCTOR" | "ASSISTANT";
export type LearnerRole = "STUDENT" | "PARENT";
export type Role = "INSTRUCTOR" | "ASSISTANT" | "STUDENT" | "PARENT";

// 역할 선택 버튼
export type RoleOption<T extends Role> = {
  label: string;
  value: T;
};

// RHF 폼 데이터 타입
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type RegisterRequestFormData = z.infer<typeof registerRequestSchema>;
export type AuthCodeFormData = z.infer<typeof authCodeSchema>;
export type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;
export type ParentPhoneFormData = z.infer<typeof parentPhoneSchema>;

// 로그인 전송 데이터 타입
export type LoginUser = LoginFormData & { userType: Role };

// 회원가입 전송 데이터 타입
export type RegisterUser = RegisterRequestFormData & {
  signupCode?: string;
  school?: string;
  schoolYear?: string;
  userType: Role;
};

export type SignupInstructorUser = RegisterRequestFormData & {
  userType: "INSTRUCTOR";
};

export type SignupAssistantUser = RegisterRequestFormData & {
  signupCode?: string;
  userType: "ASSISTANT";
};

export type SignupStudentUser = RegisterRequestFormData & {
  school?: string;
  schoolYear?: string;
  userType: "STUDENT";
};

export type SignupParentUser = RegisterRequestFormData & {
  userType: "PARENT";
};

// store 타입-----------------------------------------------
// 인증 코드 & 전화번호
export type AuthStore = {
  // 전화번호 인증
  isPhoneVerified: boolean;

  // 인증 코드
  signupCode?: string; // 입력값
  isCodeVerified: boolean; // 서버 검증 성공 여부

  // 상태 업데이트 함수
  setPhoneVerified: (verified: boolean) => void;
  setAuthCode: (code: string) => void; // 인증코드 저장
  setCodeVerified: (verified: boolean) => void; // 서버 검증 성공 여부
  resetAuth: () => void;
};

// 학생용 - 학교 정보
export type SchoolInfoStore = {
  school: string; // 학교명
  schoolYear: string; // 학년
  isSchoolInfoValid: boolean; // 학교 정보 검증 완료 여부

  setSchoolInfo: (data: SchoolInfoFormData) => void; // 학교 정보 저장
  setSchoolInfoValid: (valid: boolean) => void; // 검증 상태 업데이트
  resetSchoolInfo: () => void;
};

// 학생용 - 학부모 전화번호
export type ParentPhoneStore = {
  parentPhoneNumber: string; // 학부모 전화번호
  isParentPhoneValid: boolean; // 학부모 전화번호 검증 완료 여부

  setParentPhone: (data: ParentPhoneFormData) => void; // 학부모 전화번호 저장
  setParentPhoneValid: (valid: boolean) => void; // 검증 상태 업데이트
  resetParentPhone: () => void;
};
