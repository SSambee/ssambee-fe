import {
  contractStatusClassMap,
  contractTemplateOptions,
  editableStatusOptions,
} from "@/constants/assistants.constants";
import { mockContractRecords } from "@/data/assistants.mock";
import { useAssistantTaskForm } from "@/app/(dashboard)/educators/assistants/_hooks/manage/useAssistantTaskForm";
import { useAssistantsManageActions } from "@/app/(dashboard)/educators/assistants/_hooks/manage/useAssistantsManageActions";
import { useAssistantsManageState } from "@/app/(dashboard)/educators/assistants/_hooks/manage/useAssistantsManageState";
import { useResourceLibrarySelection } from "@/app/(dashboard)/educators/assistants/_hooks/manage/useResourceLibrarySelection";

export const useAssistantsManagePage = () => {
  const manageState = useAssistantsManageState();

  const taskForm = useAssistantTaskForm({
    assistantTaskOptions: manageState.assistantTaskOptions,
  });

  const resourceSelection = useResourceLibrarySelection();

  const closeTaskModal = () => {
    taskForm.resetTaskForm(manageState.assistantTaskOptions[0]?.id ?? "");
    resourceSelection.resetResourceSelection();
    manageState.setActiveModal("none");
  };

  const applyResourceSelection = () => {
    const selectedCount = resourceSelection.applyDraftResourceSelection();
    manageState.setActionNotice(
      `자료실 첨부 항목 ${selectedCount}건이 반영되었습니다.`
    );
    resourceSelection.closeResourceLibraryModal();
  };
  //MARK: - Actions
  const actions = useAssistantsManageActions({
    selectedAssistant: manageState.selectedAssistant,
    assistantDetailDraft: manageState.assistantDetailDraft,
    setAssistantRecords: manageState.setAssistantRecords,
    setAssistantDetailDraft: manageState.setAssistantDetailDraft,
    setIsEditingAssistantDetail: manageState.setIsEditingAssistantDetail,
    setActionNotice: manageState.setActionNotice,
    setActiveStatusFilter: manageState.setActiveStatusFilter,
    setCurrentPage: manageState.setCurrentPage,
    closeAssistantDetailModal: manageState.closeAssistantDetailModal,
    reloadAssistants: manageState.reloadAssistants,
    taskAssigneeId: taskForm.taskAssigneeId,
    taskTitle: taskForm.taskTitle,
    taskPriority: taskForm.taskPriority,
    taskDeadlineDate: taskForm.taskDeadlineDate,
    taskDeadlineTime: taskForm.taskDeadlineTime,
    taskInstructionContent: taskForm.taskInstructionContent,
    attachedResourceIds: resourceSelection.attachedResourceIds,
    closeTaskModal,
  });

  // UI 소비용 읽기 모델 그룹
  const state = {
    activeTab: manageState.activeTab,
    headerNotice: manageState.headerNotice,
    activeModal: manageState.activeModal,
    stats: manageState.stats,
    assistantRecords: manageState.assistantRecords,
    selectedAssistant: manageState.selectedAssistant,
    assistantDetailDraft: manageState.assistantDetailDraft,
    isEditingAssistantDetail: manageState.isEditingAssistantDetail,
    sendTargetId: manageState.sendTargetId,
    selectedTargetAssistant: manageState.selectedTargetAssistant,
    sendTemplate: manageState.sendTemplate,
    uploadFileName: manageState.uploadFileName,
  };

  const list = {
    activeStatusFilter: manageState.activeStatusFilter,
    assistantsSearchKeyword: manageState.assistantsSearchKeyword,
    statusLabel: manageState.statusLabel,
    totalCount: manageState.totalCount,
    paginatedAssistants: manageState.paginatedAssistants,
    pagination: manageState.pagination,
  };

  const taskFormState = {
    assistantTaskOptions: manageState.assistantTaskOptions,
    taskAssigneeId: taskForm.taskAssigneeId,
    taskTitle: taskForm.taskTitle,
    taskPriority: taskForm.taskPriority,
    taskDeadlineDate: taskForm.taskDeadlineDate,
    taskDeadlineTime: taskForm.taskDeadlineTime,
    taskInstructionContent: taskForm.taskInstructionContent,
  };

  const resource = {
    attachedResources: resourceSelection.attachedResources,
    isResourceLibraryModalOpen: resourceSelection.isResourceLibraryModalOpen,
    resourceSearchKeyword: resourceSelection.resourceSearchKeyword,
    resourceCategoryFilter: resourceSelection.resourceCategoryFilter,
    resourceCategoryOptions: resourceSelection.resourceCategoryOptions,
    filteredResourceLibraryItems:
      resourceSelection.filteredResourceLibraryItems,
    isResourceLibraryLoading: resourceSelection.isResourceLibraryLoading,
    resourceLibraryError: resourceSelection.resourceLibraryError,
    libraryDraftResourceIds: resourceSelection.libraryDraftResourceIds,
  };

  const constants = {
    editableStatusOptions,
    contractRecords: mockContractRecords,
    contractStatusClassMap,
    contractTemplateOptions,
  };

  const flags = {
    isRetiringAssistant: actions.isRetiringAssistant,
    isCreatingTask: actions.isCreatingTask,
  };
  //MARK: - Actions
  // 사용자 상호작용/상태 변경 핸들러
  const actionHandlers = {
    changeActiveStatusFilter: manageState.changeActiveStatusFilter,
    setAssistantsSearchKeyword: manageState.setAssistantsSearchKeyword,
    setCurrentPage: manageState.setCurrentPage,
    setActiveModal: manageState.setActiveModal,
    openContractManageModal: manageState.openContractManageModal,
    openContractSendModal: manageState.openContractSendModal,
    openAssistantDetailModal: manageState.openAssistantDetailModal,
    closeAssistantDetailModal: manageState.closeAssistantDetailModal,
    setAssistantDetailDraft: manageState.setAssistantDetailDraft,
    setIsEditingAssistantDetail: manageState.setIsEditingAssistantDetail,
    saveAssistantDetail: actions.saveAssistantDetail,
    retireAssistant: actions.retireAssistant,
    setSendTargetId: manageState.setSendTargetId,
    setSendTemplate: manageState.setSendTemplate,
    setUploadFileName: manageState.setUploadFileName,
    setTaskAssigneeId: taskForm.setTaskAssigneeId,
    setTaskTitle: taskForm.setTaskTitle,
    setTaskPriority: taskForm.setTaskPriority,
    setTaskDeadlineDate: taskForm.setTaskDeadlineDate,
    setTaskDeadlineTime: taskForm.setTaskDeadlineTime,
    setTaskInstructionContent: taskForm.setTaskInstructionContent,
    openResourceLibraryModal: resourceSelection.openResourceLibraryModal,
    removeAttachedResource: resourceSelection.removeAttachedResource,
    closeTaskModal,
    submitTask: actions.submitTask,
    setResourceSearchKeyword: resourceSelection.setResourceSearchKeyword,
    setResourceCategoryFilter: resourceSelection.setResourceCategoryFilter,
    toggleDraftResourceSelection:
      resourceSelection.toggleDraftResourceSelection,
    closeResourceLibraryModal: resourceSelection.closeResourceLibraryModal,
    applyResourceSelection,
    setActionNotice: manageState.setActionNotice,
  };

  return {
    state,
    list,
    taskForm: taskFormState,
    resource,
    constants,
    flags,
    actions: actionHandlers,
  };
};

export type AssistantsManagePageViewModel = ReturnType<
  typeof useAssistantsManagePage
>;
