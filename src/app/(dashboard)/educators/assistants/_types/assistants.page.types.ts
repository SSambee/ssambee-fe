import type { LucideIcon } from "lucide-react";

import type { AssistantOrdersStatsApi } from "@/types/assistantOrders";

export type AssistantsModalType =
  | "none"
  | "task"
  | "contractManage"
  | "sendContract"
  | "assistantDetail";

export type ActiveStatusFilter = "근무중" | "근무전" | "퇴사" | "전체";

export type AssistantsSummary = {
  totalAssignedCount: number;
  workingCount: number;
  pendingCount: number;
  submittedContractCount: number;
  missingContractCount: number;
};

export type AssistantsStatItem = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent: string;
  href?: string;
  modal?: AssistantsModalType;
};

export type AssistantsDashboardSummary = {
  summary: AssistantsSummary;
  ordersStats: AssistantOrdersStatsApi | null;
};
