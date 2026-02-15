import { z } from "zod";

import {
  paperFormSchema,
  videoFormSchema,
  requestFormSchema,
  otherFormSchema,
} from "@/validation/materials.validation";

// 시험지, 동영상, 요청 자료, 기타
export type MaterialsType = "PAPER" | "VIDEO" | "REQUEST" | "OTHER";
export type SortOption = "LATEST" | "OLDEST";

// 폼 모드
export type FormMode = "create" | "view" | "edit";

// RHF
export type PaperFormData = z.infer<typeof paperFormSchema>;
export type VideoFormData = z.infer<typeof videoFormSchema>;
export type RequestFormData = z.infer<typeof requestFormSchema>;
export type OtherFormData = z.infer<typeof otherFormSchema>;

export type MaterialQueryParams = {
  page?: number;
  limit?: number;
  type?: MaterialsType | "ALL";
  lectureId?: string;
  sort?: "latest" | "oldest";
  search?: string;
};

export type MaterialsPagination = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type MaterialsResponse = {
  status: string;
  data: { materials: Materials[]; pagination: MaterialsPagination };
  message: string;
};

export type Materials = {
  id: string;
  title: string; // 제목
  description: string; // 소개 또는 세부 내용
  type: MaterialsType; // 자료 유형
  writer: string; // 작성자
  date: string; // 등록일
  classId?: string | null; // 강의 ID
  className?: string | null; // 강의명
  file?: { name: string; url: string }; // 파일 정보 (PAPER, REQUEST, OTHER)
  link?: string; // 동영상 링크
};

export type MaterialsDetailResponse = {
  status: string;
  data: Materials;
  message: string;
};

export type DownloadResponse = {
  status: string;
  data: {
    url: string;
    type: "file" | "youtube";
  };
  message: string;
};
