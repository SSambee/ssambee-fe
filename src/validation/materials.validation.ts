import { z } from "zod";

import { YOUTUBE_REGEX } from "@/utils/youtubeLink";

const commonFields = {
  title: z.string().min(1, "제목을 입력해주세요."),
  writer: z.string(),
  className: z.string().optional(),
  description: z.string().optional(),
};

// 파일 검증 헬퍼
const fileSchema = z
  .any()
  .refine((file) => file !== null && file instanceof File, {
    message: "파일을 업로드해주세요.",
  })
  .refine((file) => file && file.size > 0, {
    message: "파일을 업로드해주세요.",
  });

// 시험지 폼 스키마
export const paperFormSchema = z.object({
  ...commonFields,
  file: fileSchema
    .refine(
      (file) => {
        if (!file) return false;
        const validTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validTypes.includes(file.type);
      },
      { message: "PDF 또는 Word 문서만 업로드 가능합니다." }
    )
    .refine((file) => file && file.size <= 10 * 1024 * 1024, {
      message: "파일 크기는 10MB 이하여야 합니다.",
    }),
});

// 동영상 폼 스키마
export const videoFormSchema = z.object({
  ...commonFields,
  youtubeLink: z
    .string()
    .min(1, "YouTube 링크를 입력해주세요.")
    .refine((url) => YOUTUBE_REGEX.test(url), {
      message: "올바른 YouTube 링크를 입력해주세요.",
    }),
});

// 요청 자료 폼 스키마
export const requestFormSchema = z.object({
  ...commonFields,
  file: fileSchema.refine((file) => file && file.size <= 50 * 1024 * 1024, {
    message: "파일 크기는 50MB 이하여야 합니다.",
  }),
  driveLink: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return /^(http|https):\/\/[^ "]+$/.test(val);
      },
      { message: "올바른 URL 형식이 아닙니다." }
    ),
});

// 기타 자료 폼 스키마
export const otherFormSchema = z.object({
  ...commonFields,
  file: fileSchema.refine((file) => file && file.size <= 20 * 1024 * 1024, {
    message: "파일 크기는 20MB 이하여야 합니다.",
  }),
});
