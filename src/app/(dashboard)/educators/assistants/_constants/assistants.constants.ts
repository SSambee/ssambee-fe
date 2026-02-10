import type { ActiveStatusFilter } from "@/app/(dashboard)/educators/assistants/_types/assistants.page.types";

export const DEFAULT_ACTIVE_STATUS_FILTER: ActiveStatusFilter = "근무중";

export const ACTIVE_STATUS_FILTER_OPTIONS: readonly ActiveStatusFilter[] = [
  "근무중",
  "근무전",
  "퇴사",
  "전체",
];
