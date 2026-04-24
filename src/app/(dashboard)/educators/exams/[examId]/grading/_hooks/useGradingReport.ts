"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { examKeys } from "@/constants/query-keys";
import { fetchExamStatisticsAPI } from "@/services/exams/statistics.service";
import type {
  ExamDetailApi,
  GradingReportOverview,
  GradingReportQuestionStat,
} from "@/types/exams";
import {
  buildDefaultOverview,
  buildEmptyQuestionStats,
  buildReportFromStatistics,
} from "@/services/exams/statistics.mapper";

type UseGradingReportParams = {
  examId: string;
  open: boolean;
  examDetail?: ExamDetailApi;
};

export const useGradingReport = ({
  examId,
  open,
  examDetail,
}: UseGradingReportParams) => {
  const defaultOverview = useMemo<GradingReportOverview>(
    () => buildDefaultOverview(examDetail),
    [examDetail]
  );

  const defaultQuestionStats = useMemo<GradingReportQuestionStat[]>(
    () => buildEmptyQuestionStats(examDetail?.questions ?? []),
    [examDetail]
  );

  const query = useQuery({
    queryKey: examKeys.statistics(examId),
    queryFn: async () => {
      if (!examDetail) {
        return {
          overview: defaultOverview,
          studentRows: [],
          questionStats: defaultQuestionStats,
        };
      }

      const statistics = await fetchExamStatisticsAPI(examId);
      return buildReportFromStatistics(examDetail, statistics);
    },
    enabled: Boolean(open && examId && examDetail),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return {
    overview: query.data?.overview ?? defaultOverview,
    studentRows: query.data?.studentRows ?? [],
    questionStats: query.data?.questionStats ?? defaultQuestionStats,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
