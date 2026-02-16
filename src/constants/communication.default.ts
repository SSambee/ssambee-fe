// options label - 문의 탭 필터
export const ANSWER_STATUS_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "답변 전", value: "BEFORE" },
  { label: "답변 등록", value: "REGISTERED" },
  { label: "답변 완료", value: "COMPLETED" },
];

export const WRITER_TYPE_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "학생", value: "STUDENT" },
  { label: "학부모", value: "PARENT" },
];

// 공지 탭 필터
export const CONTENT_TYPE_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "공지", value: "NOTICE" },
  { label: "자료 공유", value: "SHARE" },
];

// 알림 대상 옵션
export const NOTICE_TYPE_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "학생", value: "STUDENT" },
  { label: "학부모", value: "PARENT" },
];

export const NOTICE_TYPE_LABEL = {
  ALL: { label: "전체", color: "gray" },
  STUDENT: { label: "학생", color: "blue" },
  PARENT: { label: "학부모", color: "yellow" },
} as const;

// color label
export const INQUIRY_STATUS_LABEL = {
  BEFORE: { label: "답변 전", color: "red" },
  REGISTERED: { label: "답변 등록", color: "blue" },
  COMPLETED: { label: "답변 완료", color: "green" },
} as const;

export const CONTENT_TYPE_LABEL = {
  NOTICE: { label: "공지", color: "blue" },
  SHARE: { label: "자료", color: "green" },
} as const;

export const WRITER_TYPE_LABEL = {
  STUDENT: { label: "학생", color: "blue" },
  PARENT: { label: "학부모", color: "green" },
} as const;
