export type AssistantOrderStatus = "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

export type AssistantOrderPriority = "HIGH" | "MEDIUM" | "LOW";

export type AssistantOrdersStatsPeriod = "week" | "month" | "all";

export type AssistantOrdersStatsApi = {
  totalCount: number;
  periodCount: number;
  period: AssistantOrdersStatsPeriod | string;
};

export type AssistantOrderApi = {
  id: string;
  title: string;
  subtitle?: string | null;
  assistantName?: string | null;
  instructorName?: string | null;
  issuedAt?: string | null;
  dueAt?: string | null;
  priority?: AssistantOrderPriority | string | null;
  status?: AssistantOrderStatus | string | null;
  description?: string | null;
  attachmentCount?: number | null;
};

export type AssistantOrdersPaginationApi = {
  page: number;
  limit: number;
  totalCount: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type AssistantOrdersListApi = {
  items?: AssistantOrderApi[];
  orders?: AssistantOrderApi[];
  pagination?: AssistantOrdersPaginationApi;
};

export type AssistantOrdersListQuery = {
  status?: AssistantOrderStatus | string;
  priority?: AssistantOrderPriority | string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  limit?: number;
};
