import type { AssistantOrderApi } from "@/types/assistantOrders";
import { htmlToPlainText } from "@/utils/assistants";

export type TaskStatus = "진행 중" | "완료" | "진행전";
export type TaskPriority = "긴급" | "높음" | "보통";

export type InstructionTask = {
  id: string;
  title: string;
  subtitle: string;
  assistantName: string;
  instructorName: string;
  issuedAt: string;
  issuedAtTimestamp: number;
  dueAt: string;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  attachmentNames: string[];
  attachmentCount: number;
};

export const PAGE_LIMIT = 5;

export const statusOptions: Array<TaskStatus | "전체"> = [
  "전체",
  "진행 중",
  "완료",
  "진행전",
];
export const priorityOptions: Array<TaskPriority | "전체"> = [
  "전체",
  "긴급",
  "높음",
  "보통",
];
export const periodOptions = ["최근 1개월", "최근 3개월", "전체"] as const;

export const statusColorMap: Record<TaskStatus, "blue" | "green" | "gray"> = {
  "진행 중": "blue",
  완료: "green",
  진행전: "gray",
};

export const priorityClassMap: Record<TaskPriority, string> = {
  긴급: "bg-red-50 text-red-600",
  높음: "bg-red-50 text-red-600",
  보통: "bg-blue-50 text-blue-600",
};

export const priorityDetailLabelMap: Record<TaskPriority, string> = {
  긴급: "긴급",
  높음: "높음",
  보통: "보통",
};

export const priorityDetailClassMap: Record<TaskPriority, string> = {
  긴급: "bg-red-100 text-red-600",
  높음: "bg-red-100 text-red-600",
  보통: "bg-blue-100 text-blue-700",
};

const toKoreanDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}. ${month}. ${day} ${hour}:${minute}`;
};

const toTimestamp = (value?: string | null) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const normalizePriority = (
  priority: AssistantOrderApi["priority"]
): TaskPriority => {
  if (priority === "URGENT") return "긴급";
  if (priority === "HIGH") return "높음";
  if (priority === "NORMAL") return "보통";
  return "보통";
};

const normalizeStatus = (status: AssistantOrderApi["status"]): TaskStatus => {
  if (status === "END") return "완료";
  if (status === "IN_PROGRESS") return "진행 중";
  if (status === "PENDING") return "진행전";
  return "진행전";
};

const normalizeAttachmentNames = (
  attachments: AssistantOrderApi["attachments"]
) => {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  return attachments.map((attachment, index) => {
    const filename = attachment.filename?.trim();
    if (filename) {
      return filename;
    }

    const materialId = attachment.materialId?.trim();
    if (materialId) {
      return `자료 ${materialId}`;
    }

    return `첨부파일 ${index + 1}`;
  });
};

export const mapAssistantOrderApiToTask = (
  order: AssistantOrderApi
): InstructionTask => {
  const attachmentNames = normalizeAttachmentNames(order.attachments);

  return {
    id: order.id,
    title: order.title,
    subtitle: order.lecture?.title ?? "",
    assistantName: order.assistant?.name ?? "-",
    instructorName: order.instructor?.name ?? "-",
    issuedAt: toKoreanDateTime(order.createdAt),
    issuedAtTimestamp: toTimestamp(order.createdAt),
    dueAt: toKoreanDateTime(order.deadlineAt),
    priority: normalizePriority(order.priority),
    status: normalizeStatus(order.status),
    description: htmlToPlainText(order.memo),
    attachmentNames,
    attachmentCount: attachmentNames.length,
  };
};

export function getDateByPeriod(period: (typeof periodOptions)[number]) {
  if (period === "전체") {
    return null;
  }

  const base = new Date();
  if (period === "최근 1개월") {
    base.setMonth(base.getMonth() - 1);
    return base;
  }

  base.setMonth(base.getMonth() - 3);
  return base;
}
