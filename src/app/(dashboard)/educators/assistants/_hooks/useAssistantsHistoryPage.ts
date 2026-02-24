import { useCallback, useEffect, useRef, useState } from "react";

import {
  getDateByPeriod,
  mapAssistantOrderApiToTask,
  PAGE_LIMIT,
  periodOptions,
  priorityClassMap,
  priorityDetailClassMap,
  priorityDetailLabelMap,
  priorityOptions,
  statusColorMap,
  statusOptions,
  type InstructionTask,
} from "@/app/(dashboard)/educators/assistants/_hooks/history/history.mapper";
import { fetchAssistantOrdersAPI } from "@/services/assistants/assistantOrders.service";
import type {
  AssistantOrdersListApi,
  AssistantOrdersListQuery,
} from "@/types/assistantOrders";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "업무 지시 내역을 불러오는 중 오류가 발생했습니다.";
};

const statusQueryMap: Record<
  Exclude<(typeof statusOptions)[number], "전체">,
  "PENDING" | "IN_PROGRESS" | "END"
> = {
  "진행 중": "IN_PROGRESS",
  완료: "END",
  진행전: "PENDING",
};

const priorityQueryMap: Record<
  Exclude<(typeof priorityOptions)[number], "전체">,
  "NORMAL" | "HIGH" | "URGENT"
> = {
  긴급: "URGENT",
  높음: "HIGH",
  보통: "NORMAL",
};

const buildHistoryQuery = ({
  currentPage,
  searchKeyword,
  statusFilter,
  priorityFilter,
  periodFilter,
}: {
  currentPage: number;
  searchKeyword: string;
  statusFilter: (typeof statusOptions)[number];
  priorityFilter: (typeof priorityOptions)[number];
  periodFilter: (typeof periodOptions)[number];
}): AssistantOrdersListQuery => {
  const fromDate = getDateByPeriod(periodFilter);
  const keyword = searchKeyword.trim();

  return {
    page: currentPage,
    limit: PAGE_LIMIT,
    status: statusFilter === "전체" ? undefined : statusQueryMap[statusFilter],
    workStatus:
      statusFilter === "전체" ? undefined : statusQueryMap[statusFilter],
    priority:
      priorityFilter === "전체" ? undefined : priorityQueryMap[priorityFilter],
    from: fromDate ? fromDate.toISOString() : undefined,
    to: fromDate ? new Date().toISOString() : undefined,
    q: keyword.length > 0 ? keyword : undefined,
  };
};

const normalizePagination = (
  response: AssistantOrdersListApi,
  currentPage: number,
  currentLimit: number,
  fallbackTotalCount: number
) => {
  const page = response.pagination?.page ?? currentPage;
  const limit = response.pagination?.limit ?? currentLimit;
  const totalCount = response.pagination?.totalCount ?? fallbackTotalCount;
  const totalPage =
    response.pagination?.totalPage ??
    Math.max(1, Math.ceil(totalCount / Math.max(limit, 1)));

  return {
    totalCount,
    totalPage,
    currentPage: page,
    limit,
    hasNextPage:
      response.pagination?.hasNextPage ??
      Math.max(page, 1) < Math.max(totalPage, 1),
    hasPrevPage: response.pagination?.hasPrevPage ?? Math.max(page, 1) > 1,
  };
};

export const useAssistantsHistoryPage = () => {
  const [taskRecords, setTaskRecords] = useState<InstructionTask[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyNotice, setHistoryNotice] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("전체");
  const [priorityFilter, setPriorityFilter] =
    useState<(typeof priorityOptions)[number]>("전체");
  const [periodFilter, setPeriodFilter] =
    useState<(typeof periodOptions)[number]>("최근 1개월");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPage: 1,
    currentPage: 1,
    limit: PAGE_LIMIT,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [summaryCounts, setSummaryCounts] = useState<{
    progressCount: number;
    completedCount: number;
  }>({
    progressCount: 0,
    completedCount: 0,
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchKeyword]);

  const loadTaskRecords = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const query = buildHistoryQuery({
      currentPage,
      searchKeyword: debouncedSearchKeyword,
      statusFilter,
      priorityFilter,
      periodFilter,
    });
    const hasAdvancedFilters = Boolean(
      query.priority ?? query.from ?? query.to ?? query.q
    );

    setIsHistoryLoading(true);
    setHistoryError(null);
    setHistoryNotice(null);

    try {
      let response: AssistantOrdersListApi;
      let usedAdvancedFilterFallback = false;

      try {
        response = await fetchAssistantOrdersAPI(query);
      } catch (error) {
        if (!hasAdvancedFilters) {
          throw error;
        }

        response = await fetchAssistantOrdersAPI({
          page: query.page,
          limit: query.limit,
          status: query.status,
          workStatus: query.workStatus,
        });
        usedAdvancedFilterFallback = true;
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      const orders = response.orders ?? response.items ?? [];
      const mappedTasks = orders.map(mapAssistantOrderApiToTask);
      const normalizedPagination = normalizePagination(
        response,
        currentPage,
        PAGE_LIMIT,
        mappedTasks.length
      );
      const notices: string[] = [];

      if (usedAdvancedFilterFallback) {
        notices.push(
          "서버 필터 지원 범위를 벗어난 조건이 있어 상태/페이지 기준으로 조회했습니다."
        );
      }

      if (!response.stats) {
        notices.push("통계 응답이 없어 현재 페이지 기준으로 표시합니다.");
      }

      if (!response.pagination) {
        notices.push(
          "페이지네이션 메타가 없어 현재 페이지 데이터 기준으로 계산합니다."
        );
      }

      setTaskRecords(mappedTasks);
      setPagination(normalizedPagination);
      setHistoryNotice(notices.length > 0 ? notices.join(" ") : null);
      setSummaryCounts({
        progressCount:
          response.stats?.inProgressCount ??
          mappedTasks.filter((task) => task.status === "진행 중").length,
        completedCount:
          response.stats?.completedCount ??
          mappedTasks.filter((task) => task.status === "완료").length,
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setTaskRecords([]);
      setPagination({
        totalCount: 0,
        totalPage: 1,
        currentPage,
        limit: PAGE_LIMIT,
        hasNextPage: false,
        hasPrevPage: currentPage > 1,
      });
      setSummaryCounts({
        progressCount: 0,
        completedCount: 0,
      });
      setHistoryError(getErrorMessage(error));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsHistoryLoading(false);
      }
    }
  }, [
    currentPage,
    debouncedSearchKeyword,
    periodFilter,
    priorityFilter,
    statusFilter,
  ]);

  useEffect(() => {
    void loadTaskRecords();
  }, [loadTaskRecords]);

  const totalCount = pagination.totalCount;
  const paginatedTasks = taskRecords;

  const selectedTask =
    selectedTaskId === null
      ? null
      : (taskRecords.find((task) => task.id === selectedTaskId) ?? null);

  const progressCount = summaryCounts.progressCount;
  const completedCount = summaryCounts.completedCount;

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
    historyNotice,
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

export type AssistantsHistoryPageViewModel = ReturnType<
  typeof useAssistantsHistoryPage
>;
