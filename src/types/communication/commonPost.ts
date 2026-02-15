import { AnswerStatus, InquiryWriterType } from "./studentPost";
import { PostType } from "./instructorPost";

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
