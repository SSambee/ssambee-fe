export type LearnersMetricKey =
  | "attendance"
  | "retake"
  | "todaySchedule"
  | "previousRank";

export type LearnersMetricCard = {
  id: string;
  key: LearnersMetricKey;
  label: string;
  value: string;
  note?: string;
  cta?: string;
};

export type LearnersMiniScheduleItem = {
  id: string;
  timeRange: string;
  title: string;
};

export type LearnersAchievementPoint = {
  dateLabel: string;
  score: number;
};

export type LearnersNoticeTag = "신규" | "시험" | "휴원";

export type LearnersNotice = {
  id: string;
  tag: LearnersNoticeTag;
  title: string;
  dateLabel: string;
};

export type LearnersRecentExamResultStatus = "통과" | "평균";

export type LearnersRecentExamResult = {
  id: string;
  subject: "수학" | "영어" | "과학";
  examName: string;
  examDate: string;
  scoreLabel: string;
  status: LearnersRecentExamResultStatus;
};

export type LearnersUpcomingLesson = {
  id: string;
  monthLabel: string;
  dayLabel: string;
  title: string;
  timeRange: string;
  location: string;
};
