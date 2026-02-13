import { Briefcase, CalendarCheck, ClipboardList, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAssistantsLoader } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsLoader";
import {
  contractStatusClassMap,
  contractTemplateOptions,
  createAssistantDetailDraft,
  DEFAULT_ACTIVE_STATUS_FILTER,
  editableStatusOptions,
  PAGE_LIMIT,
  resourceCategoryOptions,
} from "@/constants/assistants.constants";
import {
  mockContractRecords,
  mockResourceLibraryItems,
} from "@/data/assistants.mock";
import { TIME_HHMM_REGEX } from "@/constants/regex";
import {
  type AssistantDetailDraft,
  ActiveStatusFilter,
  AssistantsModalType,
  AssistantsStatItem,
} from "@/types/assistants";
import { htmlToPlainText } from "@/utils/assistants";
import { createAssistantOrderAPI } from "@/services/assistants/assistantOrders.service";
import type { AssistantOrderPriority } from "@/types/assistantOrders";
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
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] =
    useState<AssistantOrderPriority>("NORMAL");
  const [taskDeadlineDate, setTaskDeadlineDate] = useState("");
  const [taskDeadlineTime, setTaskDeadlineTime] = useState("");
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
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isRetiringAssistant, setIsRetiringAssistant] = useState(false);
  const retireInFlightRef = useRef(false);

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

  useEffect(() => {
    if (assistantTaskOptions.length === 0) {
      setTaskAssigneeId("");
      return;
    }

    if (
      !assistantTaskOptions.some((assistant) => assistant.id === taskAssigneeId)
    ) {
      setTaskAssigneeId(assistantTaskOptions[0].id);
    }
  }, [assistantTaskOptions, taskAssigneeId]);

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
          : "통계 API 미연결",
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
      mockResourceLibraryItems.filter((item) =>
        attachedResourceIds.includes(item.id)
      ),
    [attachedResourceIds]
  );

  const filteredResourceLibraryItems = useMemo(() => {
    const normalizedKeyword = resourceSearchKeyword.trim().toLowerCase();

    return mockResourceLibraryItems.filter((resource) => {
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
    if (
      !selectedAssistant ||
      selectedAssistant.status === "퇴사" ||
      retireInFlightRef.current
    ) {
      return;
    }

    const targetAssistantId = selectedAssistant.id;
    const targetAssistantName = selectedAssistant.name;
    retireInFlightRef.current = true;
    setIsRetiringAssistant(true);

    try {
      await signAssistantAPI(targetAssistantId, "expire");

      setAssistantRecords((prev) =>
        prev.map((assistant) =>
          assistant.id === targetAssistantId
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
      setActionNotice(`${targetAssistantName} 조교가 퇴사 처리되었습니다.`);
      closeAssistantDetailModal();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      retireInFlightRef.current = false;
      setIsRetiringAssistant(false);
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
    setTaskAssigneeId(assistantTaskOptions[0]?.id ?? "");
    setTaskTitle("");
    setTaskPriority("NORMAL");
    setTaskDeadlineDate("");
    setTaskDeadlineTime("");
    setTaskInstructionContent("");
    setAttachedResourceIds([]);
    setLibraryDraftResourceIds([]);
    setResourceSearchKeyword("");
    setResourceCategoryFilter("전체");
    setResourceLibraryModalOpen(false);
    setActiveModal("none");
  };

  const submitTask = async () => {
    const trimmedTitle = taskTitle.trim();

    if (!taskAssigneeId) {
      setActionNotice("업무를 배정할 조교를 선택해주세요.");
      return;
    }

    if (trimmedTitle.length === 0) {
      setActionNotice("업무명을 입력해주세요.");
      return;
    }

    if (
      taskDeadlineDate &&
      taskDeadlineTime &&
      !TIME_HHMM_REGEX.test(taskDeadlineTime)
    ) {
      setActionNotice("마감 시간은 HH:mm 형식으로 입력해주세요.");
      return;
    }

    let deadlineAt: string | undefined;
    if (taskDeadlineDate) {
      const parsedDeadline = new Date(
        `${taskDeadlineDate}T${taskDeadlineTime || "00:00"}`
      );

      if (Number.isNaN(parsedDeadline.getTime())) {
        setActionNotice("마감 일시 형식을 다시 확인해주세요.");
        return;
      }

      deadlineAt = parsedDeadline.toISOString();
    }

    setIsCreatingTask(true);

    try {
      const sanitizedMemo = htmlToPlainText(taskInstructionContent);

      await createAssistantOrderAPI({
        assistantId: taskAssigneeId,
        title: trimmedTitle,
        memo: sanitizedMemo || undefined,
        priority: taskPriority,
        deadlineAt,
      });

      await reloadAssistants();
      setActionNotice(
        attachedResources.length > 0
          ? "업무 지시가 등록되었습니다. 첨부 자료 API는 후속 연동 예정입니다."
          : "업무 지시가 등록되었습니다."
      );
      closeTaskModal();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      setIsCreatingTask(false);
    }
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
    isRetiringAssistant,
    setAssistantDetailDraft,
    setIsEditingAssistantDetail,
    editableStatusOptions,
    openAssistantDetailModal,
    closeAssistantDetailModal,
    saveAssistantDetail,
    retireAssistant,
    contractRecords: mockContractRecords,
    contractStatusClassMap,
    sendTargetId: resolvedSendTargetId,
    setSendTargetId,
    selectedTargetAssistant,
    sendTemplate,
    setSendTemplate,
    contractTemplateOptions,
    uploadFileName,
    setUploadFileName,
    assistantTaskOptions,
    taskAssigneeId,
    setTaskAssigneeId,
    taskTitle,
    setTaskTitle,
    taskPriority,
    setTaskPriority,
    taskDeadlineDate,
    setTaskDeadlineDate,
    taskDeadlineTime,
    setTaskDeadlineTime,
    taskInstructionContent,
    setTaskInstructionContent,
    isCreatingTask,
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
