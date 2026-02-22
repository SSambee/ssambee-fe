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
    replyCount: 2,
  },
  {
    id: "inq-2",
    type: "학부모",
    name: "이은지",
    message: "주말 보충수업 시간 변경 가능 여부를 확인 부탁드립니다.",
    createdAt: "26.01.28",
    status: "대기",
  },
  {
    id: "inq-3",
    type: "학생",
    name: "박도현",
    message:
      "기말 대비반 과제 제출 기한이 오늘인지 내일인지 다시 안내 부탁드립니다.",
    createdAt: "26.01.27",
    status: "진행 중",
    replyCount: 1,
  },
  {
    id: "inq-4",
    type: "학부모",
    name: "최미영",
    message: "월말 상담 일정 조율 요청드립니다.",
    createdAt: "26.01.26",
    status: "완료",
    replyCount: 3,
  },
];

export const mockDashboardTasks: DashboardTask[] = [
  {
    id: "task-1",
    title: "고2 수학 A반 업무 점검",
    target: "박준성",
    progress: 45,
    status: "진행 중",
    note: "레포트용 영어 모의고사 채점",
  },
  {
    id: "task-2",
    title: "중간고사 오답노트 검수",
    target: "김서연",
    progress: 20,
    status: "대기",
    note: "학생별 오답 유형 태깅 필요",
  },
  {
    id: "task-3",
    title: "고3 파이널반 출결 정리",
    target: "이재민",
    progress: 100,
    status: "완료",
    note: "결석자 보강 일정 공유 완료",
  },
  {
    id: "task-4",
    title: "신규 등록생 반배정 초안 작성",
    target: "최현우",
    progress: 70,
    status: "진행 중",
    note: "난이도별 반 배치 기준 정리",
  },
  {
    id: "task-5",
    title: "주간 학부모 공지 발송",
    target: "정나연",
    progress: 100,
    status: "완료",
    note: "다음 주 시험 범위 안내 포함",
  },
  {
    id: "task-6",
    title: "클리닉 대기자 명단 업데이트",
    target: "윤태훈",
    progress: 10,
    status: "대기",
    note: "취소 인원 반영 후 재배정 예정",
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
    startTime: "08:30",
    endTime: "09:20",
    title: "고2 수학 A반",
  },
  {
    id: "tl-2",
    startTime: "09:40",
    endTime: "10:30",
    title: "고3 파이널 대비반",
  },
  {
    id: "tl-3",
    startTime: "10:40",
    endTime: "11:30",
    title: "고2 기말고사 대비반",
  },
  {
    id: "tl-4",
    startTime: "11:40",
    endTime: "12:30",
    title: "고1 영어 B반",
  },
  {
    id: "tl-5",
    startTime: "13:10",
    endTime: "14:00",
    title: "중등 심화반",
  },
  {
    id: "tl-6",
    startTime: "14:10",
    endTime: "15:00",
    title: "고2 모의고사 해설반",
  },
  {
    id: "tl-7",
    startTime: "15:10",
    endTime: "16:00",
    title: "수학 서술형 특강",
  },
  {
    id: "tl-8",
    startTime: "16:10",
    endTime: "17:00",
    title: "내신 집중 케어반",
  },
  {
    id: "tl-9",
    startTime: "17:10",
    endTime: "18:00",
    title: "학부모 상담 오리엔테이션",
  },
  {
    id: "tl-10",
    startTime: "18:10",
    endTime: "19:00",
    title: "야간 자율학습 관리",
  },
];

export const mockDashboardTimelineDateLabel = "2026. 01. 29";
