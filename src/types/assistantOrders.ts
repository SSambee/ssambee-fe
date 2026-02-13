export type AssistantOrderStatus = "PENDING" | "IN_PROGRESS" | "END";

export type AssistantOrderPriority = "NORMAL" | "HIGH" | "URGENT";

export type AssistantOrdersStatsPeriod = "week" | "month" | "all";

export type AssistantOrdersStatsApi = {
  totalCount: number;
  periodCount: number;
  period: AssistantOrdersStatsPeriod | string;
};

export type AssistantOrderRelationApi = {
  id: string;
  name?: string | null;
  title?: string | null;
};

export type AssistantOrderAttachmentApi = {
  id?: string;
  materialId?: string | null;
  filename?: string | null;
  fileUrl?: string | null;
};

export type AssistantOrderApi = {
  id: string;
  title: string;
  memo?: string | null;
  priority?: AssistantOrderPriority | string | null;
  status?: AssistantOrderStatus | string | null;
  deadlineAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  assistant?: AssistantOrderRelationApi | null;
  instructor?: AssistantOrderRelationApi | null;
  lecture?: AssistantOrderRelationApi | null;
  attachments?: AssistantOrderAttachmentApi[] | null;
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
  orders?: AssistantOrderApi[];
  items?: AssistantOrderApi[];
  pagination?: AssistantOrdersPaginationApi;
};

export type AssistantOrdersListQuery = {
  status?: AssistantOrderStatus | string;
  page?: number;
  limit?: number;
};

export type CreateAssistantOrderPayload = {
  assistantId: string;
  title: string;
  memo?: string;
  priority?: AssistantOrderPriority;
  materialIds?: string[];
  lectureId?: string;
  deadlineAt?: string;
};
