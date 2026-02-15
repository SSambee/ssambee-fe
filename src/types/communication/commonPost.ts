import { AnswerStatus, InquiryWriterType } from "./studentPost";
import { PostType } from "./instructorPost";

// UI 필터 확장 타입
export type AnswerStatusFilter = AnswerStatus | "ALL";
export type InquiryWriterTypeFilter = InquiryWriterType | "ALL";
export type PostTypeFilter = PostType | "ALL";

// TabSection - Query 상태 타입
export interface PostFilterQuery extends Omit<
  CommonPostQuery,
  "answerStatus" | "writerType" | "postType"
> {
  answerStatus: AnswerStatusFilter | null;
  writerType: InquiryWriterTypeFilter | null;
  postType: PostTypeFilter | null;
}

export type CommonPostQuery = {
  page: number;
  limit: number;
  search?: string;
  // 학생 문의글 전용
  answerStatus?: AnswerStatus | null;
  writerType?: InquiryWriterType | null;
  // 강사 게시글 전용
  postType?: PostType | null;
};

export type PaginationType = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
