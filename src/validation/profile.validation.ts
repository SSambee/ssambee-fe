import { z } from "zod";

import { KR_PHONE_REGEX } from "@/constants/regex";

// 프로필 수정 스키마
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  subjects: z.array(z.string()).optional(),
  academyName: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  imageFile: z.instanceof(File).nullable().optional(),
});

// 전화번호 변경 스키마
export const phoneChangeSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "전화번호를 입력해주세요")
    .regex(KR_PHONE_REGEX, "전화번호 형식이 올바르지 않습니다"),
});

// 인증번호 스키마
export const verificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "인증번호를 입력해주세요")
    .length(6, "인증번호는 6자리여야 합니다"),
});

// 비밀번호 변경 스키마
export const passwordChangeBaseSchema = z.object({
  currentPassword: z.string().trim().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z
    .string()
    .trim()
    .min(1, "새 비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다"
    ),
  confirmPassword: z.string().trim().min(1, "비밀번호 확인을 입력해주세요"),
});

// 비밀번호 확인 검증 포함
export const passwordChangeSchema = passwordChangeBaseSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  }
);

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PhoneChangeFormData = z.infer<typeof phoneChangeSchema>;
export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
