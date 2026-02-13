import type {
  ActiveStatusFilter,
  Assistant,
  AssistantDetailDraft,
  AssistantStatus,
  ContractStatus,
} from "@/types/assistants";

export const DEFAULT_ACTIVE_STATUS_FILTER: ActiveStatusFilter = "근무중";

export const ACTIVE_STATUS_FILTER_OPTIONS: readonly ActiveStatusFilter[] = [
  "근무중",
  "근무전",
  "퇴사",
  "전체",
];

export const editableStatusOptions = ["근무전", "근무중"] as const;

export const createAssistantDetailDraft = (
  assistant?: Assistant
): AssistantDetailDraft => ({
  status: assistant?.status ?? "근무중",
  memo: assistant?.memo ?? "",
});

export const statusColorMap: Record<
  AssistantStatus,
  "green" | "yellow" | "gray"
> = {
  근무전: "yellow",
  근무중: "green",
  퇴사: "gray",
};

export const contractStatusClassMap: Record<ContractStatus, string> = {
  "서명 완료": "bg-emerald-100 text-emerald-700",
  "서명 대기": "bg-amber-100 text-amber-700",
  "재전송 필요": "bg-rose-100 text-rose-700",
};

export const contractTemplateOptions = [
  "표준 근로계약서 (2024)",
  "단기 근로계약서 (파트타임)",
  "조교 계약 연장 양식",
] as const;

export const resourceCategoryOptions = [
  "전체",
  "수업자료",
  "평가자료",
  "운영문서",
] as const;

export const PAGE_LIMIT = 5;
