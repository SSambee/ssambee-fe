import { Lecture, LectureStatusOption, WeekdayOption } from "@/types/lectures";

export const LECTURE_SUBJECTS = [
  "수학",
  "영어",
  "국어",
  "과학",
  "사회",
  "기타",
] as const;

export const LECTURE_GRADES = [
  "중1",
  "중2",
  "중3",
  "고1",
  "고2",
  "고3",
  "미지정",
] as const;

export const LECTURE_STATUS_OPTIONS: LectureStatusOption[] = [
  { label: "개강전", value: "개강전" },
  { label: "진행중", value: "진행중" },
  { label: "완료", value: "완료" },
];

export const WEEKDAY_OPTIONS: WeekdayOption[] = [
  { label: "월", value: "월" },
  { label: "화", value: "화" },
  { label: "수", value: "수" },
  { label: "목", value: "목" },
  { label: "금", value: "금" },
  { label: "토", value: "토" },
  { label: "일", value: "일" },
];

/**
 * 요일 정렬 순서 (일요일 = 0)
 * - 스케줄 정렬에 활용
 */
export const DAY_ORDER: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
} as const;

export const DEFAULT_LECTURE: Lecture = {
  id: "",
  name: "",
  subject: "",
  schoolYear: "",
  instructor: "",
  currentStudents: 0,
  maxStudents: 0,
  schedule: { days: [], time: "일정 없음" },
};

export const LECTURE_STATUS_BADGE_CLASSES = {
  개강전: "bg-blue-100 text-blue-800",
  진행중: "bg-green-100 text-green-800",
  완료: "bg-gray-100 text-gray-800",
} as const;
