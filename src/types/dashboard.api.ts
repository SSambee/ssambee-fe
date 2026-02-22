export type MgmtDashboardApi = {
  totalEnrollmentCount: number;
  inProgressLectureCount: number;
  scheduledLectureCount: number;
  ungradedExamCount: number;
  newEnrollmentsCount: number;
  ongoingLecturesToday: Array<{
    lectureName: string;
    startTime: string;
    endTime: string;
    day: string;
  }>;
  latestClinics: Array<{
    studentName: string | null;
    examTitle: string;
    clinicName: string;
    createdAt: string;
    deadline: string | null;
    status: string;
  }>;
};

export type MgmtStudentPostsQuery = {
  page: number;
  limit: number;
  orderBy?: "latest" | "oldest";
};

export type MgmtStudentPostListItem = {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  status: "BEFORE" | "REGISTERED" | "COMPLETED";
  authorRole: "STUDENT" | "PARENT";
  enrollment?: {
    studentName?: string | null;
  } | null;
  _count?: {
    comments?: number;
  } | null;
};

export type MgmtStudentPostsApi = {
  list: MgmtStudentPostListItem[];
  pagination: {
    totalCount?: number;
    totalPage?: number;
    currentPage?: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats?: unknown;
};

export type MgmtAssistantOrdersQuery = {
  page: number;
  limit: number;
  status?: "PENDING" | "IN_PROGRESS" | "END";
};

export type MgmtAssistantOrderItem = {
  id: string;
  title: string;
  memo?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "END";
  assistant?: {
    id: string;
    name: string;
  } | null;
  instructor?: {
    id: string;
    name?: string;
  } | null;
};

export type MgmtAssistantOrdersApi = {
  orders: MgmtAssistantOrderItem[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
  stats?: {
    totalCount: number;
    inProgressCount: number;
    completedCount: number;
  };
};
