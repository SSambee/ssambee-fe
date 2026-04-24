import { z } from "zod";

import { YOUTUBE_REGEX } from "@/utils/youtubeLink";

const commonFields = {
  title: z.string().min(1, "제목을 입력해주세요."),
  writer: z.string(),
  className: z.string().optional(),
  description: z.string().optional(),
};

// 파일 검증 (edit 모드에서는 기존 파일 객체 허용)
const fileSchema = z
  .any()
  .refine(
    (file) => {
      // edit 모드: 기존 파일 객체 { name, url } 허용
      if (file !== null && typeof file === "object" && "url" in file)
        return true;
      // create 모드: File 인스턴스만 허용
      return file !== null && file instanceof File;
    },
    {
      message: "파일을 업로드해주세요.",
    }
  )
  .refine(
    (file) => {
      // edit 모드의 기존 파일은 크기 체크 생략
      if (file !== null && typeof file === "object" && "url" in file)
        return true;
      return file && file.size > 0;
    },
    {
      message: "파일을 업로드해주세요.",
    }
  );

// 시험지 폼 스키마
export const paperFormSchema = z.object({
  ...commonFields,
  file: fileSchema
    .refine(
      (file) => {
        if (!file) return false;
        // edit 모드의 기존 파일은 타입 체크 생략
        if (file !== null && typeof file === "object" && "url" in file)
          return true;

        const validTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint", // PPT
          "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
          "application/vnd.ms-excel", // XLS
          "application/vnd.ms-excel.sheet.macroEnabled.12", // XLSM
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
          "application/x-hwp", // HWP
          "application/haansofthwp", // HWP
          "application/vnd.hancom.hwp", // HWP
          "application/octet-stream", // HWP, PPT 등 (일부 브라우저)
        ];
        // 확장자로도 체크
        const fileName = file.name?.toLowerCase() || "";
        const validExtensions = [
          ".pdf",
          ".doc",
          ".docx",
          ".ppt",
          ".pptx",
          ".xls",
          ".xlsm",
          ".xlsx",
          ".hwp",
          ".hwpx",
        ];
        const hasValidExtension = validExtensions.some((ext) =>
          fileName.endsWith(ext)
        );

        // 확장자 체크(보안 강화)
        if (file.type === "application/octet-stream") {
          return hasValidExtension;
        }
        return validTypes.includes(file.type) || hasValidExtension;
      },
      {
        message:
          "PDF, Word, PowerPoint, Excel, 한글(HWP) 파일만 업로드 가능합니다.",
      }
    )
    .refine(
      (file) => {
        // edit 모드의 기존 파일은 크기 체크 생략
        if (file !== null && typeof file === "object" && "url" in file)
          return true;
        return file && file.size <= 10 * 1024 * 1024;
      },
      {
        message: "파일 크기는 10MB 이하여야 합니다.",
      }
    ),
});

// 동영상 폼 스키마
export const videoFormSchema = z.object({
  ...commonFields,
  link: z
    .string()
    .min(1, "YouTube 링크를 입력해주세요.")
    .refine((url) => YOUTUBE_REGEX.test(url), {
      message: "올바른 YouTube 링크를 입력해주세요.",
    }),
});

// 요청 자료 폼 스키마
export const requestFormSchema = z.object({
  ...commonFields,
  file: fileSchema.refine(
    (file) => {
      // edit 모드의 기존 파일은 크기 체크 생략
      if (file !== null && typeof file === "object" && "url" in file)
        return true;
      return file && file.size <= 50 * 1024 * 1024;
    },
    {
      message: "파일 크기는 50MB 이하여야 합니다.",
    }
  ),
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
  image: z
    .any()
    .refine(
      (file) => {
        // 파일이 없으면 실패 (필수)
        if (file === null) return false;
        // edit 모드: 기존 파일 객체 허용
        if (file !== null && typeof file === "object" && "url" in file)
          return true;
        return file instanceof File;
      },
      {
        message: "이미지를 업로드해주세요.",
      }
    )
    .refine(
      (file) => {
        if (!file) return false; // null 불허
        if (file !== null && typeof file === "object" && "url" in file)
          return true;
        return file.size > 0;
      },
      {
        message: "이미지를 업로드해주세요.",
      }
    )
    .refine(
      (file) => {
        if (!file) return false;
        if (file !== null && typeof file === "object" && "url" in file)
          return true;

        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const hasValidExtension = validExtensions.some((ext) =>
          file.name?.toLowerCase().endsWith(ext)
        );

        // 이미지도 octet-stream으로 올 경우 확장자 체크
        if (file.type === "application/octet-stream") {
          return hasValidExtension;
        }

        return validTypes.includes(file.type) || hasValidExtension;
      },
      { message: "이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)" }
    )
    .refine(
      (file) => {
        if (!file) return false;
        if (file !== null && typeof file === "object" && "url" in file)
          return true;
        return file.size <= 5 * 1024 * 1024;
      },
      {
        message: "이미지 크기는 5MB 이하여야 합니다.",
      }
    ),
});
