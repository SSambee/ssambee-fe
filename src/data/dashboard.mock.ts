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
    name: "김민준",
    message: "고2 수학 A반 추가 상담 일정 문의",
    createdAt: "10/12 14:00",
    status: "진행 중",
  },
  {
    id: "inq-2",
    type: "학부모",
    name: "김민준 학부모",
    message: "고2 수학 A반 보충 수업 좌석 문의",
    createdAt: "10/11 13:01",
    status: "대기",
  },
  {
    id: "inq-3",
    type: "학생",
    name: "박서연",
    message: "고2 수학 A반 교재 환불 요청",
    createdAt: "10/10 12:02",
    status: "완료",
  },
  {
    id: "inq-4",
    type: "학부모",
    name: "이준호 학부모",
    message: "고2 수학 A반 시험 일정 문의",
    createdAt: "10/09 11:03",
    status: "답변 완료",
  },
];

export const mockDashboardTasks: DashboardTask[] = [
  {
    id: "task-1",
    title: "고2 수학 A반 업무 점검",
    target: "김민수",
    progress: 62,
    status: "진행 중",
    note: "리포트용 영어 모의평가 채점",
  },
  {
    id: "task-2",
    title: "고1 영어 B반 성적표 정리",
    target: "이서준",
    progress: 100,
    status: "완료",
    note: "성적표 발송 후 안내 메시지",
  },
];

export const mockDashboardClinics: DashboardClinicItem[] = [
  {
    id: "clinic-1",
    date: "1월 13일",
    title: "[A반] 영어 듣기 평가 (30명)",
  },
  {
    id: "clinic-2",
    date: "1월 18일",
    title: "[B반] 단어 테스트 (10명)",
  },
];

export const mockDashboardSchedule: DashboardScheduleItem[] = [
  {
    id: "schedule-1",
    startTime: "18:00",
    endTime: "20:00",
    title: "고2 수학 A반",
    subtitle: "2관 304호",
  },
  {
    id: "schedule-2",
    startTime: "20:00",
    endTime: "22:30",
    title: "고3 파이널 대비반",
    subtitle: "본관 502호",
  },
  {
    id: "schedule-3",
    startTime: "10:00",
    endTime: "13:00",
    title: "고1 수학 B반",
    subtitle: "2관 201호",
  },
];
