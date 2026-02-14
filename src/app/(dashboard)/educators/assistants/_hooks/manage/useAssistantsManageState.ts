import { Briefcase, CalendarCheck, ClipboardList, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { useAssistantsLoader } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsLoader";
import {
  contractTemplateOptions,
  createAssistantDetailDraft,
  DEFAULT_ACTIVE_STATUS_FILTER,
  PAGE_LIMIT,
} from "@/constants/assistants.constants";
import type {
  ActiveStatusFilter,
  AssistantDetailDraft,
  AssistantsModalType,
  AssistantsStatItem,
} from "@/types/assistants";

export const useAssistantsManageState = () => {
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<ActiveStatusFilter>(DEFAULT_ACTIVE_STATUS_FILTER);
  const [assistantsSearchKeyword, setAssistantsSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<AssistantsModalType>("none");
  const [selectedAssistantId, setSelectedAssistantId] = useState("");
  const [assistantDetailDraft, setAssistantDetailDraft] =
    useState<AssistantDetailDraft>(() => createAssistantDetailDraft());
  const [isEditingAssistantDetail, setIsEditingAssistantDetail] =
    useState(false);
  const [sendTargetId, setSendTargetId] = useState("");
  const [sendTemplate, setSendTemplate] = useState<
    (typeof contractTemplateOptions)[number]
  >(contractTemplateOptions[0]);
  const [uploadFileName, setUploadFileName] = useState("선택된 파일 없음");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const {
    assistantRecords,
    setAssistantRecords,
    assistantsSummary,
    assistantOrdersStats,
    isAssistantsLoading,
    reloadAssistants,
  } = useAssistantsLoader({ onError: setActionNotice });

  const assistantTaskOptions = useMemo(
    () => assistantRecords.filter((assistant) => assistant.status !== "퇴사"),
    [assistantRecords]
  );

  const filteredAssistants = useMemo(() => {
    const normalizedKeyword = assistantsSearchKeyword.trim().toLowerCase();

    return assistantRecords.filter((assistant) => {
      const statusMatched =
        activeStatusFilter === "전체" ||
        assistant.status === activeStatusFilter;
      const keywordMatched =
        normalizedKeyword.length === 0 ||
        assistant.name.toLowerCase().includes(normalizedKeyword) ||
        assistant.phone.toLowerCase().includes(normalizedKeyword);

      return statusMatched && keywordMatched;
    });
  }, [assistantRecords, activeStatusFilter, assistantsSearchKeyword]);

  const totalCount = filteredAssistants.length;
  const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));
  const resolvedCurrentPage = Math.min(currentPage, totalPage);
  const hasNextPage = resolvedCurrentPage < totalPage;
  const hasPrevPage = resolvedCurrentPage > 1;

  const paginatedAssistants = useMemo(() => {
    const startIndex = (resolvedCurrentPage - 1) * PAGE_LIMIT;
    return filteredAssistants.slice(startIndex, startIndex + PAGE_LIMIT);
  }, [filteredAssistants, resolvedCurrentPage]);

  const pagination = {
    totalCount,
    totalPage,
    currentPage: resolvedCurrentPage,
    limit: PAGE_LIMIT,
    hasNextPage,
    hasPrevPage,
  };

  const headerNotice =
    isAssistantsLoading && !actionNotice
      ? "조교 목록을 불러오는 중입니다."
      : actionNotice;

  const workingRatio =
    assistantsSummary.totalAssignedCount === 0
      ? 0
      : Math.round(
          (assistantsSummary.workingCount /
            assistantsSummary.totalAssignedCount) *
            100
        );

  const stats: AssistantsStatItem[] = useMemo(
    () => [
      {
        label: "전체 배정 조교",
        value: `${assistantsSummary.totalAssignedCount}명`,
        delta: `승인 대기 ${assistantsSummary.pendingCount}명`,
        icon: Users,
        accent: "text-emerald-400",
      },
      {
        label: "현재 근무 중",
        value: `${assistantsSummary.workingCount}명`,
        delta: `${workingRatio}%`,
        icon: Briefcase,
        accent: "text-sky-400",
      },
      {
        label: "조교 계약서 관리",
        value: `${assistantsSummary.submittedContractCount}건`,
        delta: `미제출 ${assistantsSummary.missingContractCount}건`,
        icon: ClipboardList,
        accent: "text-amber-300",
      },
      {
        label: "업무 지시 현황",
        value: assistantOrdersStats
          ? `총 ${assistantOrdersStats.totalCount}건`
          : "-",
        delta: assistantOrdersStats
          ? `진행 중 ${assistantOrdersStats.inProgressCount}건 · 완료 ${assistantOrdersStats.completedCount}건`
          : "통계 데이터 없음",
        icon: CalendarCheck,
        accent: "text-emerald-300",
        href: "/educators/assistants/history",
      },
    ],
    [assistantsSummary, assistantOrdersStats, workingRatio]
  );

  const selectedAssistant =
    assistantRecords.find(
      (assistant) => assistant.id === selectedAssistantId
    ) ?? assistantRecords[0];

  const selectedTargetAssistant =
    assistantRecords.find((assistant) => assistant.id === sendTargetId) ??
    assistantRecords[0];
  const resolvedSendTargetId = selectedTargetAssistant?.id ?? "";

  const openAssistantDetailModal = (assistantId: string) => {
    const assistant = assistantRecords.find((item) => item.id === assistantId);
    if (!assistant) {
      return;
    }

    setSelectedAssistantId(assistant.id);
    setAssistantDetailDraft(createAssistantDetailDraft(assistant));
    setIsEditingAssistantDetail(false);
    setActiveModal("assistantDetail");
  };

  const closeAssistantDetailModal = () => {
    setIsEditingAssistantDetail(false);
    setActiveModal("none");
  };

  const openContractSendModal = () => {
    setActionNotice(
      "계약서 관리는 추후 개발 예정으로 현재 비활성화되어 있습니다."
    );
    setActiveModal("none");
  };

  const openContractManageModal = () => {
    setActionNotice(
      "계약서 관리는 추후 개발 예정으로 현재 비활성화되어 있습니다."
    );
    setActiveModal("none");
  };

  const activeTab: "manage" | "contracts" =
    activeModal === "contractManage" || activeModal === "sendContract"
      ? "contracts"
      : "manage";

  const statusLabel =
    activeStatusFilter === "전체" ? "전체" : activeStatusFilter;

  const changeActiveStatusFilter = (status: ActiveStatusFilter) => {
    setActiveStatusFilter(status);
    setCurrentPage(1);
  };

  return {
    activeStatusFilter,
    setActiveStatusFilter,
    assistantsSearchKeyword,
    setAssistantsSearchKeyword,
    currentPage,
    setCurrentPage,
    activeModal,
    setActiveModal,
    assistantDetailDraft,
    setAssistantDetailDraft,
    isEditingAssistantDetail,
    setIsEditingAssistantDetail,
    sendTargetId: resolvedSendTargetId,
    setSendTargetId,
    sendTemplate,
    setSendTemplate,
    uploadFileName,
    setUploadFileName,
    actionNotice,
    setActionNotice,
    assistantRecords,
    setAssistantRecords,
    assistantTaskOptions,
    reloadAssistants,
    activeTab,
    headerNotice,
    stats,
    statusLabel,
    totalCount,
    paginatedAssistants,
    pagination,
    selectedAssistant,
    selectedTargetAssistant,
    openAssistantDetailModal,
    closeAssistantDetailModal,
    openContractSendModal,
    openContractManageModal,
    changeActiveStatusFilter,
  };
};
