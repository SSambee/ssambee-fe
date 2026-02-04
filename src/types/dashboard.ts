export type DashboardStatKey = "students" | "lectures" | "exams";

export type DashboardStat = {
  id: string;
  key: DashboardStatKey;
  label: string;
  value: number;
  unit: string;
  note?: string;
};

export type DashboardInquiryType = "학생" | "학부모";
export type DashboardInquiryStatus = "진행 중" | "대기" | "완료" | "답변 완료";

export type DashboardInquiry = {
  id: string;
  type: DashboardInquiryType;
  name: string;
  message: string;
  createdAt: string;
  status: DashboardInquiryStatus;
};

export type DashboardTaskStatus = "진행 중" | "대기" | "완료";

export type DashboardTask = {
  id: string;
  title: string;
  target: string;
  progress: number;
  status: DashboardTaskStatus;
  note?: string;
};

export type DashboardClinicItem = {
  id: string;
  date: string;
  title: string;
  meta?: string;
};

export type DashboardScheduleItem = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle?: string;
};
