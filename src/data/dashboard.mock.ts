import {
  DashboardClinicItem,
  DashboardInquiry,
  DashboardScheduleItem,
  DashboardStat,
  DashboardTask,
} from "@/types/dashboard";

export const mockDashboardStats: DashboardStat[] = [
  {
    id: "stat-1",
    key: "students",
    label: "재원 학생",
    value: 19,
    unit: "명",
    note: "추가 1명",
  },
  {
    id: "stat-2",
    key: "lectures",
    label: "운영 중 수업",
    value: 6,
    unit: "개",
    note: "신규 개설 1개",
  },
  {
    id: "stat-3",
    key: "exams",
    label: "현재 시험 목록",
    value: 3,
    unit: "개",
    note: "시험지 등록",
  },
];

export const mockDashboardInquiries: DashboardInquiry[] = [
  {
    id: "inq-1",
    type: "학생",
    name: "김철수",
    message: "수학(하) 2단원 문제 풀이 질문입니다.",
    createdAt: "26.01.29",
    status: "답변 완료",
  },
  {
    id: "inq-2",
    type: "학생",
    name: "김철수",
    message: "수학(하) 2단원 문제 풀이 질문입니다.",
    createdAt: "26.01.29",
    status: "답변 완료",
  },
  {
    id: "inq-3",
    type: "학생",
    name: "김철수",
    message: "수학(하) 2단원 문제 풀이 질문입니다.",
    createdAt: "26.01.29",
    status: "답변 완료",
  },
  {
    id: "inq-4",
    type: "학생",
    name: "김철수",
    message: "수학(하) 2단원 문제 풀이 질문입니다.",
    createdAt: "26.01.29",
    status: "답변 완료",
  },
];

export const mockDashboardTasks: DashboardTask[] = [
  {
    id: "task-1",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "진행 중",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-2",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "진행 중",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-3",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "완료",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-4",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "진행 중",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-5",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "완료",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-6",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 62,
    status: "진행 중",
    note: "레포트용 영어 모의고사 채점",
  },
];

export const mockDashboardClinics: DashboardClinicItem[] = [
  {
    id: "clinic-1",
    date: "26.02.18",
    title: "[A반] 영어 듣기 평가 (30명)",
  },
  {
    id: "clinic-2",
    date: "26.02.18",
    title: "[A반] 영어 듣기 평가 (30명)",
  },
  {
    id: "clinic-3",
    date: "26.02.18",
    title: "[A반] 영어 듣기 평가 (30명)",
  },
  {
    id: "clinic-4",
    date: "26.02.18",
    title: "[A반] 영어 듣기 평가 (30명)",
  },
];

export const mockDashboardSchedule: DashboardScheduleItem[] = [
  {
    id: "schedule-1",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 B반",
    subtitle: "2관 304호",
  },
  {
    id: "schedule-2",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 B반",
    subtitle: "2관 304호",
  },
  {
    id: "schedule-3",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 B반",
    subtitle: "2관 304호",
  },
  {
    id: "schedule-4",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 B반",
    subtitle: "2관 304호",
  },
];

export const mockDashboardTimeline: DashboardScheduleItem[] = [
  {
    id: "tl-1",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-2",
    startTime: "10:00",
    endTime: "12:00",
    title: "고3 파이널 대비반",
  },
  {
    id: "tl-3",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 기말고사 대비반",
  },
  {
    id: "tl-4",
    startTime: "10:00",
    endTime: "12:00",
    title: "고1 영어 B반",
  },
  {
    id: "tl-5",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-6",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-7",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-8",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-9",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
  {
    id: "tl-10",
    startTime: "10:00",
    endTime: "12:00",
    title: "고2 수학 A반",
  },
];
