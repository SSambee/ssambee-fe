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

export const WORK_STATUS_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "대기", value: "PENDING" },
  { label: "진행중", value: "IN_PROGRESS" },
  { label: "완료", value: "END" },
];

export const PRIORITY_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "보통", value: "NORMAL" },
  { label: "높음", value: "HIGH" },
  { label: "긴급", value: "URGENT" },
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

export const WORK_STATUS_LABEL = {
  PENDING: { label: "대기", color: "gray" },
  IN_PROGRESS: { label: "진행중", color: "blue" },
  END: { label: "완료", color: "green" },
} as const;

export const PRIORITY_LABEL = {
  NORMAL: { label: "보통", color: "gray" },
  HIGH: { label: "높음", color: "yellow" },
  URGENT: { label: "긴급", color: "red" },
} as const;

// 자료 분류 필터 옵션
export const MATERIALS_TYPE_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "시험지", value: "PAPER" },
  { label: "동영상", value: "VIDEO" },
  { label: "요청 자료", value: "REQUEST" },
  { label: "기타", value: "OTHER" },
];

// 자료 분류 라벨
export const MATERIALS_TYPE_LABEL = {
  ALL: "전체",
  PAPER: "시험지",
  VIDEO: "동영상",
  REQUEST: "요청 자료",
  OTHER: "기타",
} as const;
