import { useMemo, useState } from "react";

import type { AssistantOrderApi } from "@/types/assistantOrders";

export type TaskStatus = "진행 중" | "완료" | "보류";
export type TaskPriority = "높음" | "보통" | "낮음";

export type InstructionTask = {
  id: string;
  title: string;
  subtitle: string;
  assistantName: string;
  instructorName: string;
  issuedAt: string;
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
  "높음",
  "보통",
  "낮음",
];
const periodOptions = ["최근 1개월", "최근 3개월", "전체"] as const;

const statusColorMap: Record<TaskStatus, "blue" | "green" | "gray"> = {
  "진행 중": "blue",
  완료: "green",
  보류: "gray",
};

const priorityClassMap: Record<TaskPriority, string> = {
  높음: "bg-red-50 text-red-600",
  보통: "bg-blue-50 text-blue-600",
  낮음: "bg-gray-100 text-gray-600",
};

const priorityDetailLabelMap: Record<TaskPriority, string> = {
  높음: "긴급",
  보통: "보통",
  낮음: "일반",
};

const priorityDetailClassMap: Record<TaskPriority, string> = {
  높음: "bg-red-100 text-red-600",
  보통: "bg-blue-100 text-blue-700",
  낮음: "bg-slate-100 text-slate-600",
};

const now = new Date();

const normalizePriority = (
  priority: AssistantOrderApi["priority"]
): TaskPriority => {
  if (priority === "HIGH") return "높음";
  if (priority === "LOW") return "낮음";
  return "보통";
};

const normalizeStatus = (status: AssistantOrderApi["status"]): TaskStatus => {
  if (status === "COMPLETED") return "완료";
  if (status === "ON_HOLD") return "보류";
  return "진행 중";
};

export const mapAssistantOrderApiToTask = (
  order: AssistantOrderApi
): InstructionTask => ({
  id: order.id,
  title: order.title,
  subtitle: order.subtitle ?? "-",
  assistantName: order.assistantName ?? "-",
  instructorName: order.instructorName ?? "-",
  issuedAt: order.issuedAt ?? "-",
  dueAt: order.dueAt ?? "-",
  priority: normalizePriority(order.priority),
  status: normalizeStatus(order.status),
  description: order.description ?? "",
  attachmentCount: order.attachmentCount ?? 0,
});

function getDateByPeriod(period: (typeof periodOptions)[number]) {
  if (period === "전체") {
    return null;
  }

  const base = new Date(now);
  if (period === "최근 1개월") {
    base.setMonth(base.getMonth() - 1);
    return base;
  }

  base.setMonth(base.getMonth() - 3);
  return base;
}

export const useAssistantsHistoryPage = () => {
  const taskRecords = useMemo(() => [] as InstructionTask[], []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("전체");
  const [priorityFilter, setPriorityFilter] =
    useState<(typeof priorityOptions)[number]>("전체");
  const [periodFilter, setPeriodFilter] =
    useState<(typeof periodOptions)[number]>("최근 1개월");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const lowerKeyword = searchKeyword.trim().toLowerCase();
    const periodStartDate = getDateByPeriod(periodFilter);

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

      const issuedDate = new Date(task.issuedAt.replace(" ", "T"));
      const periodMatched =
        periodStartDate === null ||
        (issuedDate >= periodStartDate && issuedDate <= now);

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
