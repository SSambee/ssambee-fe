import type { LucideIcon } from "lucide-react";

import type { AssistantOrdersStatsApi } from "@/types/assistantOrders";

export type AssistantSignStatus = "PENDING" | "SIGNED" | "REJECTED" | "EXPIRED";

export type AssistantsQueryStatus =
  | "pending"
  | "signed"
  | "expired"
  | "rejected";

export type AssistantSignAction = "approve" | "reject" | "expire";

export type AssistantUserApi = {
  name?: string | null;
  email?: string | null;
};

export type AssistantApi = {
  id: string;
  userId?: string | null;
  instructorId: string;
  name: string;
  phoneNumber?: string | null;
  signupCode?: string | null;
  contract?: string | null;
  memo?: string | null;
  signStatus: AssistantSignStatus;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  user?: AssistantUserApi | null;
};

export type AssistantsListApi = {
  assistants: AssistantApi[];
};

export type AssistantUpdatePayload = {
  name?: string;
  phoneNumber?: string;
  contract?: string;
  memo?: string;
};

export type AssistantCodeApi = {
  id: string;
  code: string;
  instructorId: string;
  isUsed: boolean;
  expireAt: string;
  createdAt: string;
};

export type AssistantStatus = "근무전" | "근무중" | "퇴사";

export type Assistant = {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  className: string;
  task: string;
  memo: string;
  status: AssistantStatus;
  badge: string;
};

export type AssistantDetailDraft = {
  status: AssistantStatus;
  memo: string;
};

export type ContractStatus = "서명 완료" | "서명 대기" | "재전송 필요";

export type ContractRecord = {
  id: string;
  assistantId: string;
  updatedAt: string;
  fileName: string;
  status: ContractStatus;
};

export type ResourceLibraryCategory = "수업자료" | "평가자료" | "운영문서";

export type ResourceLibraryItem = {
  id: string;
  title: string;
  category: ResourceLibraryCategory;
  updatedAt: string;
  sizeLabel: string;
};

export type AssistantsListView = "active" | "retired";

export type AssistantsPagination = {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

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
