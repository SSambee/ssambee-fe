import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchAssistantOrdersAPI } from "@/services/assistants/assistantOrders.service";
import type { AssistantOrderApi } from "@/types/assistantOrders";
import { htmlToPlainText } from "@/utils/assistants";

export type TaskStatus = "진행 중" | "완료" | "보류";
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
  attachmentCount: number;
};

const PAGE_LIMIT = 5;

const statusOptions: Array<TaskStatus | "전체"> = [
  "전체",
  "진행 중",
  "완료",
  "보류",
];
const priorityOptions: Array<TaskPriority | "전체"> = [
  "전체",
  "긴급",
  "높음",
  "보통",
];
const periodOptions = ["최근 1개월", "최근 3개월", "전체"] as const;

const statusColorMap: Record<TaskStatus, "blue" | "green" | "gray"> = {
  "진행 중": "blue",
  완료: "green",
  보류: "gray",
};

const priorityClassMap: Record<TaskPriority, string> = {
  긴급: "bg-red-50 text-red-600",
  높음: "bg-red-50 text-red-600",
  보통: "bg-blue-50 text-blue-600",
};

const priorityDetailLabelMap: Record<TaskPriority, string> = {
  긴급: "긴급",
  높음: "높음",
  보통: "보통",
};

const priorityDetailClassMap: Record<TaskPriority, string> = {
  긴급: "bg-red-100 text-red-600",
  높음: "bg-red-100 text-red-600",
  보통: "bg-blue-100 text-blue-700",
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "업무 지시 내역을 불러오는 중 오류가 발생했습니다.";
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
  if (status === "PENDING") return "보류";
  return "보류";
};

export const mapAssistantOrderApiToTask = (
  order: AssistantOrderApi
): InstructionTask => ({
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
  attachmentCount: order.attachments?.length ?? 0,
});

function getDateByPeriod(period: (typeof periodOptions)[number]) {
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

export const useAssistantsHistoryPage = () => {
  const [taskRecords, setTaskRecords] = useState<InstructionTask[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("전체");
  const [priorityFilter, setPriorityFilter] =
    useState<(typeof priorityOptions)[number]>("전체");
  const [periodFilter, setPeriodFilter] =
    useState<(typeof periodOptions)[number]>("최근 1개월");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const loadTaskRecords = useCallback(async () => {
    const requestLimit = 100;
    const maxPageFetch = 20;

    setIsHistoryLoading(true);

    try {
      let page = 1;
      let hasNextPage = true;
      const accumulatedOrders: AssistantOrderApi[] = [];

      while (hasNextPage && page <= maxPageFetch) {
        const response = await fetchAssistantOrdersAPI({
          page,
          limit: requestLimit,
        });
        const orders = response.orders ?? response.items ?? [];
        accumulatedOrders.push(...orders);

        if (response.pagination) {
          hasNextPage =
            response.pagination.hasNextPage &&
            page < response.pagination.totalPage;
        } else {
          hasNextPage = orders.length === requestLimit;
        }

        page += 1;
      }

      setTaskRecords(accumulatedOrders.map(mapAssistantOrderApiToTask));
      setHistoryError(
        hasNextPage
          ? "업무 내역이 많아 일부만 불러왔습니다. 필터를 적용해 다시 시도해주세요."
          : null
      );
    } catch (error) {
      setTaskRecords([]);
      setHistoryError(getErrorMessage(error));
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTaskRecords();
  }, [loadTaskRecords]);

  const filteredTasks = useMemo(() => {
    const lowerKeyword = searchKeyword.trim().toLowerCase();
    const periodStartDate = getDateByPeriod(periodFilter);
    const now = new Date();

    return taskRecords.filter((task) => {
      const keywordMatched =
        lowerKeyword.length === 0 ||
        task.title.toLowerCase().includes(lowerKeyword) ||
        task.subtitle.toLowerCase().includes(lowerKeyword) ||
        task.assistantName.toLowerCase().includes(lowerKeyword);

      const statusMatched =
        statusFilter === "전체" || task.status === statusFilter;
      const priorityMatched =
        priorityFilter === "전체" || task.priority === priorityFilter;

      const issuedDate =
        task.issuedAtTimestamp > 0 ? new Date(task.issuedAtTimestamp) : null;
      const periodMatched =
        periodStartDate === null ||
        (issuedDate !== null &&
          !Number.isNaN(issuedDate.getTime()) &&
          issuedDate >= periodStartDate &&
          issuedDate <= now);

      return (
        keywordMatched && statusMatched && priorityMatched && periodMatched
      );
    });
  }, [periodFilter, priorityFilter, searchKeyword, statusFilter, taskRecords]);

  const totalCount = filteredTasks.length;
  const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));
  const safeCurrentPage = Math.min(currentPage, totalPage);
  const hasNextPage = safeCurrentPage < totalPage;
  const hasPrevPage = safeCurrentPage > 1;

  const paginatedTasks = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_LIMIT;
    return filteredTasks.slice(startIndex, startIndex + PAGE_LIMIT);
  }, [filteredTasks, safeCurrentPage]);

  const selectedTask =
    selectedTaskId === null
      ? null
      : (taskRecords.find((task) => task.id === selectedTaskId) ?? null);

  const progressCount = taskRecords.filter(
    (task) => task.status === "진행 중"
  ).length;
  const completedCount = taskRecords.filter(
    (task) => task.status === "완료"
  ).length;

  const pagination = {
    totalCount,
    totalPage,
    currentPage: safeCurrentPage,
    limit: PAGE_LIMIT,
    hasNextPage,
    hasPrevPage,
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    statusOptions,
    priorityOptions,
    periodOptions,
    statusColorMap,
    priorityClassMap,
    priorityDetailLabelMap,
    priorityDetailClassMap,
    isHistoryLoading,
    historyError,
    loadTaskRecords,
    taskRecords,
    totalCount,
    paginatedTasks,
    progressCount,
    completedCount,
    pagination,
    selectedTask,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    periodFilter,
    setPeriodFilter,
    setCurrentPage,
    setSelectedTaskId,
    resetPagination,
  };
};
