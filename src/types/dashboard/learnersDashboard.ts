type Announcement = {
  id: string;
  title: string;
  createdAt: string;
};

type TodaySchedule = {
  lectureTitle: string;
  lectureTime: string;
};

type RecentExam = {
  id: string;
  title: string;
  score: number;
  examDate: string;
};

type LatestExam = {
  title: string;
  rank: number;
  totalParticipants: number;
  score: number;
};

export type LearnersDashboardResponse = {
  today: string;
  clinicsCount: number;
  attendanceRate: number;
  latestExam: LatestExam;
  announcements: Announcement[];
  todaySchedule: TodaySchedule[];
  recentExams: RecentExam[];
};
