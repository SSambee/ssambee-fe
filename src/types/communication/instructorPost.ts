import { MaterialsType } from "../materials.type";

import { PaginationType } from "./commonPost";

export type PostType = "NOTICE" | "SHARE"; // 게시글 분류
export type PostScope = "GLOBAL" | "LECTURE" | "SELECTED"; // 강사 게시글 스코프
export type TargetRole = "ALL" | "STUDENT" | "PARENT"; // 알림 수신 대상
export type SchoolYear = "중1" | "중2" | "중3" | "고1" | "고2" | "고3";

// 강사 게시글 알림 대상 조회
export type GetInstructorPostTargetsQuery = {
  lectures: {
    lectureId: string;
    lectureTitle: string;
    students: {
      enrollmentId: string;
      studentName: string;
      school: string;
      schoolYear: SchoolYear;
    }[];
  }[];
};

// 강사 게시글 생성
export type CreateInstructorPostRequest = {
  title: string; // 제목
  content: string; // 내용
  isImportant: boolean; // 중요 여부(공지/자료공유)
  scope: PostScope; // 알림 대상 범위
  targetRole: TargetRole; // 알림 수신 대상
  lectureId: string | null; // 강의 ID
  targetEnrollmentIds?: string[]; // 알림 수신 대상 학생 ID 목록
  materialIds?: string[]; // 첨부파일 ID 목록
};

// 강사 게시글 수정
export type UpdateInstructorPostRequest = Partial<CreateInstructorPostRequest>;

// 강사 게시글 목록 전체 조회
export type GetInstructorPostsResponse = {
  list: {
    id: string;
    scope: PostScope; // 알림 대상 범위
    targetRole: TargetRole; // 대상 역할
    title: string; // 제목
    content: string; // 내용
    isImportant: boolean; // 중요 여부(공지/자료공유)
    lectureId: string | null; // 강의 ID - SELECTED 스코프 시 필수
    lectureTitle: string | null; // 강의 제목
    instructorId: string; // 강사 ID
    authorAssistantId: string | null;
    createdAt: string;
    updatedAt: string;
    authorRole: string; // 작성자 역할
    instructor: {
      user: { name: string };
    };
    authorAssistant: {
      user: { name: string };
    } | null;
    attachments?: {
      id: string;
      materialId: string;
      filename: string;
      material: unknown;
    }[];
    targets: {
      id: string;
      enrollmentId: string;
      enrollment: {
        appStudentId: string;
        studentName: string;
      };
    }[];
    _count: {
      comments?: number;
    };
  }[];
  pagination: PaginationType;
  stats: {
    totalCount: number;
    increaseRate: string;
    unansweredCount: number;
    unansweredCriteria: number;
    answeredThisMonthCount: number;
    processingCount: number;
  };
};

// 강사 게시글 상세 조회
export type GetInstructorPostDetailResponse = {
  id: string;
  scope: PostScope; // 알림 대상 범위
  targetRole: TargetRole; // 대상 역할
  title: string; // 제목
  content: string; // 내용
  lectureId: string | null; // 강의 ID - SELECTED 스코프 시 필수
  isImportant: boolean; // 중요 여부(공지/자료공유)
  instructorId: string; // 강사 ID
  authorAssistantId: string | null;
  createdAt: string;
  updatedAt: string;
  authorRole: string; // 작성자 역할
  lectureTitle: string | null; // 강의 제목
  isMine: boolean;
  instructor: {
    user: { name: string };
  };
  authorAssistant: {
    user: { name: string };
  } | null;
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
  targets: {
    id: string;
    enrollmentId: string;
    enrollment: {
      appStudentId: string;
      studentName: string;
    };
  }[];
  comments?: InstructorPostDetailComment[];
};

// 강사 게시글 상세 댓글
export type InstructorPostDetailComment = {
  id: string;
  content: string;
  createdAt: string;
  isMine: boolean;
  instructor: {
    user: { name: string };
  } | null;
  assistant: {
    user: { name: string };
  } | null;
};

// 강사 게시글 댓글 생성 & 수정
export type CreateInstructorPostCommentRequest = {
  content: string;
  materialIds?: string[];
};
