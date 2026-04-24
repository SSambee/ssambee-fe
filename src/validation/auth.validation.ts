import { z } from "zod";

import { KR_PHONE_REGEX } from "@/constants/regex";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().trim().min(1, "비밀번호를 입력해주세요"),
  rememberMe: z.boolean(),
});

export const registerBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "실명을 입력해주세요")
    .min(2, "실명은 최소 2자 이상이어야 합니다"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "연락처를 입력해주세요")
    .regex(KR_PHONE_REGEX, "전화번호 형식이 올바르지 않습니다"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .trim()
    .min(1, "비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다"
    ),
  passwordConfirm: z.string().trim().min(1, "비밀번호 확인을 입력해주세요"),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
});

// 폼 입력용
export const registerFormSchema = registerBaseSchema.refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  }
);

// 서버 요청용
export const registerRequestSchema = registerBaseSchema.omit({
  passwordConfirm: true,
});

export const authCodeSchema = z.object({
  signupCode: z
    .string()
    .trim()
    .min(1, "인증 코드를 입력해주세요")
    .length(6, "인증 코드는 6자리여야 합니다"),
});

export const schoolInfoSchema = z.object({
  school: z.string().trim().min(1, "학교명을 입력해주세요"),
  schoolYear: z.string().min(1, "학년을 선택해주세요"),
});

export const parentPhoneSchema = z.object({
  parentPhoneNumber: z
    .string()
    .trim()
    .min(1, "학부모 연락처를 입력해주세요")
    .regex(KR_PHONE_REGEX, "전화번호 형식이 올바르지 않습니다"),
});
