import {
  type LearnersAchievementPoint,
  type LearnersMetricCard,
  type LearnersNotice,
  type LearnersRecentExamResult,
  type LearnersUpcomingLesson,
} from "@/types/learners-dashboard";

export const learnersMetricCards: LearnersMetricCard[] = [
  {
    id: "metric-attendance",
    key: "attendance",
    label: "출석 현황",
    value: "95%",
    note: "결석 1일 · 지각 2일",
  },
  {
    id: "metric-retake",
    key: "retake",
    label: "재시험 필요",
    value: "1과목",
  },
  {
    id: "metric-schedule",
    key: "todaySchedule",
    label: "오늘 수업 일정",
    value: "1건",
  },
  {
    id: "metric-rank",
    key: "previousRank",
    label: "이전시험 석차",
    value: "12/120",
    note: "상위 12등",
  },
];

export const learnersAchievementPoints: LearnersAchievementPoint[] = [
  { dateLabel: "9/12", score: 73 },
  { dateLabel: "9/24", score: 77 },
  { dateLabel: "10/05", score: 75 },
  { dateLabel: "10/16", score: 78 },
  { dateLabel: "10/28", score: 76 },
];

export const learnersNotices: LearnersNotice[] = [
  {
    id: "notice-1",
    tag: "신규",
    title: "여름 캠프 접수 시작",
    dateLabel: "오늘",
  },
  {
    id: "notice-2",
    tag: "시험",
    title: "중간고사 일정 변경 안내",
    dateLabel: "어제",
  },
  {
    id: "notice-3",
    tag: "휴원",
    title: "10월 25일 휴원 안내",
    dateLabel: "10월 10일",
  },
];

export const learnersRecentExamResults: LearnersRecentExamResult[] = [
  {
    id: "result-1",
    subject: "수학",
    examName: "대수학 중간고사",
    examDate: "2023. 10. 12",
    scoreLabel: "92/100",
    status: "통과",
  },
  {
    id: "result-2",
    subject: "영어",
    examName: "단어 쪽지시험",
    examDate: "2023. 10. 10",
    scoreLabel: "85/100",
    status: "통과",
  },
  {
    id: "result-3",
    subject: "과학",
    examName: "물리 실험 보고서",
    examDate: "2023. 10. 08",
    scoreLabel: "78/100",
    status: "평균",
  },
];

export const learnersUpcomingLessons: LearnersUpcomingLesson[] = [
  {
    id: "upcoming-1",
    monthLabel: "10월",
    dayLabel: "14",
    title: "심화 수학",
    timeRange: "16:00 - 17:30",
    location: "302호",
  },
  {
    id: "upcoming-2",
    monthLabel: "10월",
    dayLabel: "15",
    title: "영문학",
    timeRange: "14:00 - 15:30",
    location: "105호",
  },
  {
    id: "upcoming-3",
    monthLabel: "10월",
    dayLabel: "16",
    title: "물리 실험",
    timeRange: "15:00 - 16:30",
    location: "제2실험실",
  },
];
