import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Assistant,
  AssistantsDashboardSummary,
  AssistantsSummary,
} from "@/types/assistants";
import { mapAssistantsApiToView } from "@/services/assistants/assistants.mapper";
import { fetchAssistantOrdersAPI } from "@/services/assistants/assistantOrders.service";
import { fetchAssistantsAPI } from "@/services/assistants/assistants.service";
import type { AssistantOrdersStatsApi } from "@/types/assistantOrders";
import type { AssistantApi } from "@/types/assistants";

const initialSummary: AssistantsSummary = {
  totalAssignedCount: 0,
  workingCount: 0,
  pendingCount: 0,
  submittedContractCount: 0,
  missingContractCount: 0,
};

const toUniqueAssistants = (records: AssistantApi[]) =>
  Array.from(
    new Map(records.map((assistant) => [assistant.id, assistant])).values()
  );

const buildSummary = (
  signedAssistants: AssistantApi[],
  pendingAssistants: AssistantApi[]
): AssistantsSummary => {
  const uniqueSignedAssistants = toUniqueAssistants(signedAssistants);
  const uniquePendingAssistants = toUniqueAssistants(pendingAssistants);
  const activeAssistants = toUniqueAssistants([
    ...uniqueSignedAssistants,
    ...uniquePendingAssistants,
  ]);

  return {
    totalAssignedCount: activeAssistants.length,
    workingCount: uniqueSignedAssistants.length,
    pendingCount: uniquePendingAssistants.length,
    submittedContractCount: activeAssistants.filter((assistant) =>
      Boolean(assistant.contract?.trim())
    ).length,
    missingContractCount: activeAssistants.filter(
      (assistant) => !assistant.contract?.trim()
    ).length,
  };
};

type UseAssistantsLoaderParams = {
  onError: (message: string) => void;
};

type UseAssistantsLoaderResult = {
  assistantRecords: Assistant[];
  setAssistantRecords: Dispatch<SetStateAction<Assistant[]>>;
  assistantsSummary: AssistantsSummary;
  assistantOrdersStats: AssistantOrdersStatsApi | null;
  isAssistantsLoading: boolean;
  reloadAssistants: () => Promise<void>;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

export const useAssistantsLoader = ({
  onError,
}: UseAssistantsLoaderParams): UseAssistantsLoaderResult => {
  const onErrorRef = useRef(onError);

  const [assistantRecords, setAssistantRecords] = useState<Assistant[]>([]);
  const [summaryState, setSummaryState] = useState<AssistantsDashboardSummary>({
    summary: initialSummary,
    ordersStats: null,
  });
  const [isAssistantsLoading, setIsAssistantsLoading] = useState(false);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const reloadAssistants = useCallback(async () => {
    setIsAssistantsLoading(true);

    try {
      const [
        signedAssistants,
        pendingAssistants,
        expiredAssistants,
        rejectedAssistants,
      ] = await Promise.all([
        fetchAssistantsAPI("signed"),
        fetchAssistantsAPI("pending"),
        fetchAssistantsAPI("expired"),
        fetchAssistantsAPI("rejected"),
      ]);

      const [orderStatsResponse, summary] = await Promise.all([
        fetchAssistantOrdersAPI({ page: 1, limit: 1 }).catch(() => null),
        Promise.resolve(buildSummary(signedAssistants, pendingAssistants)),
      ]);
      const orderStats = orderStatsResponse?.stats ?? null;

      const allAssistants = toUniqueAssistants([
        ...signedAssistants,
        ...pendingAssistants,
        ...expiredAssistants,
        ...rejectedAssistants,
      ]);

      setAssistantRecords(mapAssistantsApiToView(allAssistants));
      setSummaryState({
        summary,
        ordersStats: orderStats,
      });
    } catch (error) {
      onErrorRef.current(getErrorMessage(error));
    } finally {
      setIsAssistantsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAssistants();
  }, [reloadAssistants]);

  return {
    assistantRecords,
    setAssistantRecords,
    assistantsSummary: summaryState.summary,
    assistantOrdersStats: summaryState.ordersStats,
    isAssistantsLoading,
    reloadAssistants,
  };
};
