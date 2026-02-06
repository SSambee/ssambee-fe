export type ScheduleCategory = "exam" | "clinic" | "misc";

export type ScheduleSeed = {
  id: string;
  title: string;
  date: string;
  time: string;
  category: ScheduleCategory;
  description?: string;
};

export const scheduleCategoryOptions = [
  { value: "exam", label: "시험", color: "#ef4444" },
  { value: "clinic", label: "클리닉", color: "#16a34a" },
  { value: "misc", label: "기타", color: "#f59e0b" },
] as const;

export const scheduleSeeds: ScheduleSeed[] = [
  {
    id: "schedule-1",
    title: "2월 1주차 중간 테스트",
    date: "2026-02-05",
    time: "18:00",
    category: "exam",
    description: "1관 203호",
  },
  {
    id: "schedule-2",
    title: "영어 단기 클리닉 (2관 304호)",
    date: "2026-02-08",
    time: "18:00",
    category: "clinic",
    description: "클리닉 대상자 전원 참석",
  },
  {
    id: "schedule-3",
    title: "고2 중간고사 모의시험 (반 2B)",
    date: "2026-02-12",
    time: "19:30",
    category: "exam",
    description: "시험지 배포 10분 전 입실",
  },
  {
    id: "schedule-4",
    title: "학부모 상담 (상담실 1)",
    date: "2026-02-18",
    time: "14:00",
    category: "misc",
    description: "상담 전 메모 공유",
  },
  {
    id: "schedule-5",
    title: "클리닉 보충 수업 (2관 201호)",
    date: "2026-02-24",
    time: "17:00",
    category: "clinic",
    description: "클리닉 대상 재시험 대비",
  },
];

export type TimetableDay = "월" | "화" | "수" | "목" | "금" | "토";

export type TimetableEntry = {
  id: string;
  title: string;
  day: TimetableDay;
  startTime: string;
  endTime: string;
  color: string;
};

export const timetableMeta = {
  academy: "모티브에듀 서초학원",
  term: "2025 1학기 시간표",
};

export const timetableEntries: TimetableEntry[] = [
  {
    id: "timetable-1",
    title: "고1 영어 A반",
    day: "월",
    startTime: "17:00",
    endTime: "18:00",
    color: "#bfe3ff",
  },
  {
    id: "timetable-2",
    title: "고3 파이널 대비반",
    day: "월",
    startTime: "20:00",
    endTime: "21:00",
    color: "#b4c6ff",
  },
  {
    id: "timetable-3",
    title: "고2 수학 A반",
    day: "화",
    startTime: "17:00",
    endTime: "19:00",
    color: "#ffe6a7",
  },
  {
    id: "timetable-4",
    title: "고2 영어 실전반",
    day: "수",
    startTime: "18:00",
    endTime: "19:00",
    color: "#b9f3c3",
  },
  {
    id: "timetable-5",
    title: "고1 수학 B반",
    day: "금",
    startTime: "11:00",
    endTime: "12:00",
    color: "#f7c2d5",
  },
];
