import { MaterialsType } from "../materials.type";

import { PaginationType } from "./commonPost";
import { CommonPostComment } from "./commonPost";

export type InquiryWriterType = "STUDENT" | "PARENT"; // 문의 작성자
export type AnswerStatus = "BEFORE" | "REGISTERED" | "COMPLETED"; // 답변 상태
export type AuthorRole = "STUDENT" | "PARENT"; // 작성자 역할

// 학생 문의 상태 변경
export type UpdateStudentPostStatusRequest = {
  status: AnswerStatus;
};

// 문의 등록 시 지정 강의 목록 조회
export type GetLecturesResponse = {
  lectures: {
    id: string;
    title: string;
    instructorId: string;
    lectureTimes: {
      id: string;
      lectureId: string;
      day: string;
      startTime: string;
      endTime: string;
    }[];
  }[];
};

// 학생 문의 생성
export type CreateStudentPostRequest = {
  title: string;
  content: string;
  lectureId: string;
};

// 학부모 문의 생성
export type CreateStudentParentPostRequest = CreateStudentPostRequest & {
  childLinkId: string;
};

// 학생 문의 수정
export type UpdateStudentPostRequest = Partial<CreateStudentPostRequest>;

// 학생 문의 전체 조회
export type GetStudentPostsResponse = {
  list: {
    id: string;
    status: AnswerStatus;
    title: string;
    content: string;
    createdAt: string;
    authorRole: AuthorRole;
    lectureId: string;
    isMine: boolean;
    enrollment: {
      appStudentId: string;
      studentName: string;
      appParentId: string;
    };
    _count: {
      comments?: number;
    };
  }[];
  pagination: PaginationType;
};

// 학생 문의 상세 조회
export type GetStudentPostDetailResponse = {
  id: string;
  status: AnswerStatus;
  title: string;
  content: string;
  createdAt: string;
  authorRole: AuthorRole;
  lectureId: string;
  lectureTitle: string | null;
  isMine: boolean;
  childLinkId?: string | null;
  enrollment: {
    studentName: string;
  };
  comments?: CommonPostComment[];
  attachments?: {
    id: string;
    materialId: string;
    material: {
      id: string;
      title: string;
      fileUrl: string | null;
      type: MaterialsType;
      externalDownloadUrl: string | null;
    };
  }[];
};

// 학생 문의 상세 댓글
// commonPostComment 타입 사용

// 학생 문의 댓글 생성 & 수정
export type CreateStudentPostCommentRequest = {
  content: string;
  materialIds?: string[];
};
