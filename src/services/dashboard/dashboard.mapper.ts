import {
  DashboardClinicItem,
  DashboardInquiry,
  DashboardScheduleItem,
  DashboardStat,
  DashboardTask,
} from "@/types/dashboard";
import {
  MgmtAssistantOrderItem,
  MgmtAssistantOrdersApi,
  MgmtDashboardApi,
  MgmtStudentPostsApi,
} from "@/types/dashboard.api";
import { htmlToPlainText } from "@/utils/assistants";

const formatDateYYMMDD = (iso?: string | null) => {
  if (!iso) return "-";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  const text = date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const [year, month, day] = text.split("-");

  return `${year.slice(2)}.${month}.${day}`;
};

const formatTimelineDateLabel = (date = new Date()) => {
  const text = date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const [year, month, day] = text.split("-");

  return `${year}. ${month}. ${day}`;
};

const normalizeClinicText = (value?: string | null) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[\[\]\(\)]/g, "");
};

const shouldHideExamMeta = (clinicName?: string | null, examTitle?: string) => {
  const normalizedClinic = normalizeClinicText(clinicName);
  const normalizedExam = normalizeClinicText(examTitle);

  if (!normalizedClinic || !normalizedExam) return true;

  return (
    normalizedClinic === normalizedExam ||
    normalizedClinic.includes(normalizedExam) ||
    normalizedExam.includes(normalizedClinic)
  );
};

const mapInquiryStatus = (
  status: "BEFORE" | "REGISTERED" | "COMPLETED"
): DashboardInquiry["status"] => {
  if (status === "BEFORE") return "대기";
  if (status === "REGISTERED") return "답변 완료";
  return "완료";
};

const mapTaskStatus = (
  status: "PENDING" | "IN_PROGRESS" | "END"
): DashboardTask["status"] => {
  if (status === "PENDING") return "대기";
  if (status === "IN_PROGRESS") return "진행 중";
  return "완료";
};

const mapTaskProgress = (status: "PENDING" | "IN_PROGRESS" | "END") => {
  if (status === "PENDING") return 0;
  if (status === "IN_PROGRESS") return 50;
  return 100;
};

const resolveTaskTarget = (
  order: MgmtAssistantOrderItem,
  fallbackTargetName?: string
) => {
  if (order.assistant?.name) return order.assistant.name;
  if (fallbackTargetName) return fallbackTargetName;
  if (order.instructor?.name) return order.instructor.name;
  return "-";
};

const toSingleLinePreview = (value: string, maxLength = 120) => {
  const singleLine = value.replace(/\s+/g, " ").trim();

  if (singleLine.length <= maxLength) {
    return singleLine;
  }

  return `${singleLine.slice(0, maxLength)}...`;
};

export const mapMgmtDashboardToStats = (
  dashboard: MgmtDashboardApi
): DashboardStat[] => {
  return [
    {
      id: "stat-students",
      key: "students",
      label: "재원 학생",
      value: dashboard.totalEnrollmentCount,
      unit: "명",
      note: `최근 48시간 신규 ${dashboard.newEnrollmentsCount}명`,
    },
    {
      id: "stat-lectures",
      key: "lectures",
      label: "운영 중 수업",
      value: dashboard.inProgressLectureCount,
      unit: "개",
      note: `예정 수업 ${dashboard.scheduledLectureCount}개`,
    },
    {
      id: "stat-exams",
      key: "exams",
      label: "현재 시험 목록",
      value: dashboard.ungradedExamCount,
      unit: "개",
      note: "채점 미완료",
    },
  ];
};

export const mapMgmtDashboardToTimeline = (
  dashboard: MgmtDashboardApi
): { items: DashboardScheduleItem[]; dateLabel: string } => {
  const items = dashboard.ongoingLecturesToday.map((item, index) => ({
    id: `timeline-${index}-${item.lectureName}-${item.startTime}`,
    startTime: item.startTime,
    endTime: item.endTime,
    title: item.lectureName,
  }));

  return {
    items,
    dateLabel: formatTimelineDateLabel(),
  };
};

export const mapMgmtDashboardToClinics = (
  dashboard: MgmtDashboardApi
): DashboardClinicItem[] => {
  return dashboard.latestClinics.map((clinic, index) => {
    const title = clinic.clinicName || clinic.examTitle;
    const hideExamMeta = shouldHideExamMeta(
      clinic.clinicName,
      clinic.examTitle
    );

    return {
      id: `clinic-${index}-${clinic.examTitle}-${clinic.clinicName}`,
      date: formatDateYYMMDD(clinic.deadline ?? clinic.createdAt),
      title,
      studentName: clinic.studentName ?? undefined,
      meta: hideExamMeta ? undefined : clinic.examTitle,
    };
  });
};

export const mapMgmtStudentPostsToInquiries = (
  response: MgmtStudentPostsApi
): DashboardInquiry[] => {
  return response.list.map((item) => {
    const plainTitle = htmlToPlainText(item.title);
    const plainContent = htmlToPlainText(item.content);
    const messageSource = plainContent || plainTitle;

    return {
      id: item.id,
      type: item.authorRole === "PARENT" ? "학부모" : "학생",
      name: item.enrollment?.studentName || "-",
      message: toSingleLinePreview(messageSource),
      replyCount: item._count?.comments,
      createdAt: formatDateYYMMDD(item.createdAt),
      status: mapInquiryStatus(item.status),
    };
  });
};

export const mapMgmtAssistantOrdersToTasks = (
  response: MgmtAssistantOrdersApi,
  fallbackTargetName?: string
): DashboardTask[] => {
  return response.orders.map((item) => ({
    id: item.id,
    title: item.title,
    target: resolveTaskTarget(item, fallbackTargetName),
    progress: mapTaskProgress(item.status),
    status: mapTaskStatus(item.status),
    note: item.memo ?? undefined,
  }));
};
