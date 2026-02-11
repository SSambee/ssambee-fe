import { Briefcase, CalendarCheck, ClipboardList, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { DEFAULT_ACTIVE_STATUS_FILTER } from "@/app/(dashboard)/educators/assistants/_constants/assistants.constants";
import { useAssistantsLoader } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsLoader";
import {
  type AssistantDetailDraft,
  contractRecords,
  contractStatusClassMap,
  contractTemplateOptions,
  createAssistantDetailDraft,
  editableStatusOptions,
  PAGE_LIMIT,
  resourceCategoryOptions,
  resourceLibraryItems,
} from "@/app/(dashboard)/educators/assistants/_types/assistants";
import type {
  ActiveStatusFilter,
  AssistantsModalType,
  AssistantsStatItem,
} from "@/app/(dashboard)/educators/assistants/_types/assistants.page.types";
import {
  signAssistantAPI,
  updateAssistantAPI,
} from "@/services/assistants/assistants.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

export const useAssistantsManagePage = () => {
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<ActiveStatusFilter>(DEFAULT_ACTIVE_STATUS_FILTER);
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
  const [taskInstructionContent, setTaskInstructionContent] = useState("");
  const [isResourceLibraryModalOpen, setResourceLibraryModalOpen] =
    useState(false);
  const [attachedResourceIds, setAttachedResourceIds] = useState<string[]>([]);
  const [libraryDraftResourceIds, setLibraryDraftResourceIds] = useState<
    string[]
  >([]);
  const [resourceSearchKeyword, setResourceSearchKeyword] = useState("");
  const [resourceCategoryFilter, setResourceCategoryFilter] =
    useState<(typeof resourceCategoryOptions)[number]>("전체");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const {
    assistantRecords,
    setAssistantRecords,
    assistantsSummary,
    assistantOrdersStats,
    isAssistantsLoading,
  } = useAssistantsLoader({ onError: setActionNotice });

  const filteredAssistants = useMemo(
    () =>
      assistantRecords.filter((assistant) =>
        activeStatusFilter === "전체"
          ? true
          : assistant.status === activeStatusFilter
      ),
    [assistantRecords, activeStatusFilter]
  );

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
        modal: "contractManage",
      },
      {
        label: "업무 지시 내역",
        value: assistantOrdersStats
          ? `${assistantOrdersStats.totalCount}건`
          : "-",
        delta: assistantOrdersStats
          ? `이번 주 +${assistantOrdersStats.periodCount}건`
          : "백엔드 연동 대기",
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

  const attachedResources = useMemo(
    () =>
      resourceLibraryItems.filter((item) =>
        attachedResourceIds.includes(item.id)
      ),
    [attachedResourceIds]
  );

  const filteredResourceLibraryItems = useMemo(() => {
    const normalizedKeyword = resourceSearchKeyword.trim().toLowerCase();

    return resourceLibraryItems.filter((resource) => {
      const categoryMatched =
        resourceCategoryFilter === "전체" ||
        resource.category === resourceCategoryFilter;
      const keywordMatched =
        normalizedKeyword.length === 0 ||
        resource.title.toLowerCase().includes(normalizedKeyword) ||
        resource.category.toLowerCase().includes(normalizedKeyword);

      return categoryMatched && keywordMatched;
    });
  }, [resourceCategoryFilter, resourceSearchKeyword]);

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

  const saveAssistantDetail = async () => {
    if (!selectedAssistant) {
      return;
    }

    const hasStatusChange =
      assistantDetailDraft.status !== selectedAssistant.status;

    try {
      const updatedAssistant = await updateAssistantAPI(selectedAssistant.id, {
        memo: assistantDetailDraft.memo,
      });

      setAssistantRecords((prev) =>
        prev.map((assistant) =>
          assistant.id === selectedAssistant.id
            ? {
                ...assistant,
                memo: updatedAssistant.memo ?? assistantDetailDraft.memo,
              }
            : assistant
        )
      );

      if (hasStatusChange) {
        setAssistantDetailDraft((prev) => ({
          ...prev,
          status: selectedAssistant.status,
        }));
      }

      setIsEditingAssistantDetail(false);
      setActionNotice(
        hasStatusChange
          ? "메모는 저장되었고, 상태 변경은 퇴사 처리에서만 지원됩니다."
          : "조교 상세 정보가 저장되었습니다."
      );
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    }
  };

  const retireAssistant = async () => {
    if (!selectedAssistant || selectedAssistant.status === "퇴사") {
      return;
    }

    try {
      await signAssistantAPI(selectedAssistant.id, "expire");

      setAssistantRecords((prev) =>
        prev.map((assistant) =>
          assistant.id === selectedAssistant.id
            ? {
                ...assistant,
                status: "퇴사",
              }
            : assistant
        )
      );
      setActiveStatusFilter("퇴사");
      setCurrentPage(1);
      setIsEditingAssistantDetail(false);
      setActionNotice(`${selectedAssistant.name} 조교가 퇴사 처리되었습니다.`);
      closeAssistantDetailModal();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    }
  };

  const openContractSendModal = () => {
    setActiveModal("sendContract");
  };

  const openContractManageModal = () => {
    setActiveModal("contractManage");
  };

  const openResourceLibraryModal = () => {
    setLibraryDraftResourceIds(attachedResourceIds);
    setResourceLibraryModalOpen(true);
  };

  const closeResourceLibraryModal = () => {
    setResourceLibraryModalOpen(false);
    setResourceSearchKeyword("");
    setResourceCategoryFilter("전체");
    setLibraryDraftResourceIds([]);
  };

  const toggleDraftResourceSelection = (resourceId: string) => {
    setLibraryDraftResourceIds((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const applyResourceSelection = () => {
    setAttachedResourceIds(libraryDraftResourceIds);
    setActionNotice(
      `자료실 첨부 항목 ${libraryDraftResourceIds.length}건이 반영되었습니다. (UI-only)`
    );
    closeResourceLibraryModal();
  };

  const removeAttachedResource = (resourceId: string) => {
    setAttachedResourceIds((prev) => prev.filter((id) => id !== resourceId));
  };

  const closeTaskModal = () => {
    setTaskInstructionContent("");
    setAttachedResourceIds([]);
    setLibraryDraftResourceIds([]);
    setResourceSearchKeyword("");
    setResourceCategoryFilter("전체");
    setResourceLibraryModalOpen(false);
    setActiveModal("none");
  };

  const submitTask = () => {
    setActionNotice("업무 지시 등록은 UI 미리보기 단계입니다.");
    closeTaskModal();
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
    activeTab,
    headerNotice,
    stats,
    activeStatusFilter,
    changeActiveStatusFilter,
    statusLabel,
    totalCount,
    paginatedAssistants,
    pagination,
    setCurrentPage,
    activeModal,
    setActiveModal,
    openContractManageModal,
    openContractSendModal,
    assistantRecords,
    selectedAssistant,
    assistantDetailDraft,
    isEditingAssistantDetail,
    setAssistantDetailDraft,
    setIsEditingAssistantDetail,
    editableStatusOptions,
    openAssistantDetailModal,
    closeAssistantDetailModal,
    saveAssistantDetail,
    retireAssistant,
    contractRecords,
    contractStatusClassMap,
    sendTargetId: resolvedSendTargetId,
    setSendTargetId,
    selectedTargetAssistant,
    sendTemplate,
    setSendTemplate,
    contractTemplateOptions,
    uploadFileName,
    setUploadFileName,
    taskInstructionContent,
    setTaskInstructionContent,
    attachedResources,
    openResourceLibraryModal,
    removeAttachedResource,
    closeTaskModal,
    submitTask,
    isResourceLibraryModalOpen,
    resourceSearchKeyword,
    setResourceSearchKeyword,
    resourceCategoryFilter,
    resourceCategoryOptions,
    setResourceCategoryFilter,
    filteredResourceLibraryItems,
    libraryDraftResourceIds,
    toggleDraftResourceSelection,
    closeResourceLibraryModal,
    applyResourceSelection,
    setActionNotice,
  };
};
