import { z } from "zod";

import { KR_PHONE_REGEX } from "@/constants/regex";

export const learnersProfileUpdateSchema = z.object({
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
  school: z.string().trim().optional(),
  schoolYear: z.string().trim().optional(),
  parentPhoneNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || KR_PHONE_REGEX.test(value),
      "전화번호 형식이 올바르지 않습니다"
    ),
});

export type LearnersProfileUpdateFormData = z.infer<
  typeof learnersProfileUpdateSchema
>;

export const linkChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "자녀 이름을 입력해주세요")
    .min(2, "이름은 최소 2자 이상이어야 합니다"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "전화번호를 입력해주세요")
    .refine(
      (value) => KR_PHONE_REGEX.test(value.replace(/-/g, "")),
      "전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678)"
    ),
});

export type LinkChildFormData = z.infer<typeof linkChildSchema>;
