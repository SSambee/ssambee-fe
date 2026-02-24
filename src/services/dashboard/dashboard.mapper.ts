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
  status: "PENDING" | "IN_PROGRESS" | "END" | undefined
): DashboardTask["status"] => {
  if (status === "PENDING") return "대기";
  if (status === "IN_PROGRESS") return "진행 중";
  return "완료";
};

const mapTaskProgress = (
  status: "PENDING" | "IN_PROGRESS" | "END" | undefined
) => {
  if (status === "PENDING") return 0;
  if (status === "IN_PROGRESS") return 50;
  return 100;
};

const normalizeName = (value?: string | null) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const resolveAssistantName = (order: MgmtAssistantOrderItem) => {
  return (
    normalizeName(order.assistant?.name) ?? normalizeName(order.assistantName)
  );
};

const resolveTaskTarget = (
  order: MgmtAssistantOrderItem,
  viewerType?: "INSTRUCTOR" | "ASSISTANT"
) => {
  if (viewerType === "ASSISTANT") {
    const assistantName = resolveAssistantName(order);
    const instructorObjectName = normalizeName(order.instructor?.name);
    const instructorFieldName = normalizeName(order.instructorName);

    if (instructorObjectName && instructorObjectName !== assistantName) {
      return instructorObjectName;
    }

    if (instructorFieldName && instructorFieldName !== assistantName) {
      return instructorFieldName;
    }

    return "미확인";
  }

  const assistantName = resolveAssistantName(order);
  if (assistantName) return assistantName;
  return "미배정";
};

const toSingleLinePreview = (value: string, maxLength = 120) => {
  const singleLine = value.replace(/\s+/g, " ").trim();

  if (singleLine.length <= maxLength) {
    return singleLine;
  }

  return `${singleLine.slice(0, maxLength)}...`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const extractTextFromRichNode = (node: unknown): string => {
  if (!isRecord(node)) return "";

  if (typeof node.text === "string") {
    return node.text;
  }

  if (node.type === "hardBreak") {
    return "\n";
  }

  const attrsLabel =
    isRecord(node.attrs) && typeof node.attrs.label === "string"
      ? node.attrs.label
      : "";

  const childrenText = Array.isArray(node.content)
    ? node.content.map((child) => extractTextFromRichNode(child)).join(" ")
    : "";

  return [attrsLabel, childrenText].filter(Boolean).join(" ").trim();
};

const richTextToPlainText = (value?: string | null) => {
  if (!value) return "";

  try {
    const parsed: unknown = JSON.parse(value);
    const extracted = extractTextFromRichNode(parsed).trim();

    if (extracted.length > 0) {
      return extracted;
    }
  } catch {}

  return htmlToPlainText(value);
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
    const plainTitle = richTextToPlainText(item.title);
    const plainContent = richTextToPlainText(item.content);
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
  viewerType?: "INSTRUCTOR" | "ASSISTANT"
): DashboardTask[] => {
  return response.orders.map((item) => {
    const normalizedStatus = item.status ?? item.workStatus;

    return {
      id: item.id,
      title: item.title,
      target: resolveTaskTarget(item, viewerType),
      progress: mapTaskProgress(normalizedStatus),
      status: mapTaskStatus(normalizedStatus),
      note: item.memo ?? undefined,
    };
  });
};
