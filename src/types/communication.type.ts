export type ContentsType = "NOTICE" | "SHARE"; // 게시글 분류
export type NoticeType = "ALL" | "STUDENT" | "PARENT"; // 알림 수신 대상
export type ReadPermissionType = "ALL" | "STUDENT" | "PARENT"; // 열람 권한

export type AnswerStatus = "BEFORE" | "REGISTERED" | "COMPLETED"; // 답변 상태
export type InquiryWriterType = "STUDENT" | "PARENT"; // 문의 작성자

/**
 * 게시글 목록 페이지--------------------------------------------------------
 */
// 문의글 작성자 타입 (학생/학부모)
export type InquiryContentsWriter = {
  name: string;
  type: InquiryWriterType;
};

// 학생/학부모가 작성한 문의글
export type LearnersWriteInquiry = {
  id: string;
  title: string; // 제목
  contents: string; // 내용
  file?: File; // 첨부파일
  writer: InquiryContentsWriter; // 작성자
  status: AnswerStatus; // 답변 상태
  date: string; // 작성일
  answers?: AnswerComment[]; // 댓글
};

// 강사가 작성한 게시글(공지/자료공유)
export type InstructorWriteContents = {
  id: string;
  title: string; // 제목
  contents: string; // 내용
  file?: File; // 첨부파일
  name: string; // 작성자(강사 자신)
  contentsType: ContentsType; // 게시글 분류(공지/자료공유)
  classId: string | null; // 클래스 ID (null이면 전체 클래스)
  className?: string; // 클래스명
  readPermission: ReadPermissionType; // 열람 권한(전체/학생/학부모)
  notifyTargetIds: string[]; // 알림 대상 학생 ID 목록
  notifyType: NoticeType; // 알림 수신 대상(전체/학생/학부모)
  date: string; // 작성일
  answers?: AnswerComment[]; // 댓글
};

// 댓글
export type AnswerComment = {
  id: string;
  contents: string; // 내용
  date: string; // 작성일
  writer: string; // 작성자
  file?: File; // 첨부파일(강사만)
};
