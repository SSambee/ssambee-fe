import { type Assistant, type AssistantStatus } from "@/types/assistants";
import type { AssistantApi, AssistantSignStatus } from "@/types/assistants";

export type ApprovalStatus = "승인 대기" | "승인 완료" | "반려됨";

export type AssistantApprovalApplication = {
  id: string;
  name: string;
  phone: string;
  email: string;
  appliedAt: string;
  appliedAtTimestamp: number;
  mentor: string;
  role: string;
  status: ApprovalStatus;
};

const assistantBadgeMap: Record<AssistantStatus, string> = {
  근무전: "bg-amber-300/20 text-amber-100",
  근무중: "bg-emerald-400/20 text-emerald-200",
  퇴사: "bg-slate-500/20 text-slate-300",
};

export const mapAssistantSignStatusToViewStatus = (
  signStatus: AssistantSignStatus
): AssistantStatus => {
  if (signStatus === "PENDING") {
    return "근무전";
  }

  if (signStatus === "SIGNED") {
    return "근무중";
  }

  return "퇴사";
};

const toKoreanDateTime = (value?: string) => {
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

const toTimestamp = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const mapAssistantApiToView = (assistant: AssistantApi): Assistant => {
  const status = mapAssistantSignStatusToViewStatus(assistant.signStatus);

  return {
    id: assistant.id,
    name: assistant.name,
    email: assistant.user?.email ?? "-",
    subject: "미지정",
    phone: assistant.phoneNumber ?? "-",
    className: "-",
    task: "업무 배정 예정",
    memo: assistant.memo ?? "",
    status,
    badge: assistantBadgeMap[status],
  };
};

export const mapAssistantsApiToView = (assistants: AssistantApi[]) =>
  assistants.map(mapAssistantApiToView);

export const mapAssistantsApiToApprovalApplications = (
  assistants: AssistantApi[],
  status: ApprovalStatus
): AssistantApprovalApplication[] =>
  assistants.map((assistant) => ({
    id: assistant.id,
    name: assistant.name,
    phone: assistant.phoneNumber ?? "-",
    email: assistant.user?.email ?? "-",
    appliedAt: toKoreanDateTime(assistant.createdAt),
    appliedAtTimestamp: toTimestamp(assistant.createdAt),
    mentor: "담당 강사",
    role: "조교",
    status,
  }));
