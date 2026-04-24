export type LectureStatus = "개강전" | "진행중" | "완료";

export type LectureSelectOption = {
  label: string;
  value: string;
};

export type LectureStatusOption = {
  label: string;
  value: LectureStatus;
};

export type WeekdayOption = {
  label: string;
  value: string;
};

export type LectureSchedule = {
  days: string[]; // 요일 (예: ['월', '수', '금'])
  time: string; // 시간 (예: 18:00 - 20:00)
};

export type LectureTime = {
  day: string;
  startTime: string;
  endTime: string;
};

export type LectureStudent = {
  id: string;
  name: string;
  school: string;
  schoolYear: string;
  phone: string;
  parentPhone: string;
};

export type Lecture = {
  id: string;
  name: string; // 수업명 (예: 고2 수학 A반)
  subject: string; // 과목 (예: 수학)
  schoolYear: string; // 학년 (예: 고2, 고3)
  instructor: string; // 강사명
  currentStudents: number; // 현재 인원
  maxStudents?: number;
  schedule: LectureSchedule;
  lectureTimes?: LectureTime[];
  startDate?: string; // 개강일 (예: 2026-01-31) - B1 데이터
  status?: LectureStatus; // 수업 상태 - B1 데이터
  assistant?: string; // 담당 조교 - B1 데이터
  students?: LectureStudent[]; // 등록 학생 목록
};
