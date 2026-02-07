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

// RHF
export type PaperFormData = z.infer<typeof paperFormSchema>;
export type VideoFormData = z.infer<typeof videoFormSchema>;
export type RequestFormData = z.infer<typeof requestFormSchema>;
export type OtherFormData = z.infer<typeof otherFormSchema>;

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
  file?: File | null; // 첨부파일(시험지, 요청 자료)
  link?: string; // 동영상 링크
  writer: string; // 작성자
  date: string; // 작성일
  type: MaterialsType; // 자료 유형
  classId?: string; // 반 아이디
  className?: string; // 반 이름
};
