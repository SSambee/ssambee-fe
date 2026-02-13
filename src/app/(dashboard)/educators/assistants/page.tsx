"use client";

import AssistantsFiltersBar from "@/app/(dashboard)/educators/assistants/_components/AssistantsFiltersBar";
import AssistantsHeader from "@/app/(dashboard)/educators/assistants/_components/AssistantsHeader";
import AssistantsStatsGrid from "@/app/(dashboard)/educators/assistants/_components/AssistantsStatsGrid";
import AssistantsTable from "@/app/(dashboard)/educators/assistants/_components/AssistantsTable";
import { useAssistantsManagePage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsManagePage";
import AssistantDetailModal from "@/app/(dashboard)/educators/assistants/_modals/AssistantDetailModal";
import ContractManageModal from "@/app/(dashboard)/educators/assistants/_modals/ContractManageModal";
import ContractSendModal from "@/app/(dashboard)/educators/assistants/_modals/ContractSendModal";
import ResourceLibraryModal from "@/app/(dashboard)/educators/assistants/_modals/ResourceLibraryModal";
import TaskCreateModal from "@/app/(dashboard)/educators/assistants/_modals/TaskCreateModal";
import {
  createAssistantDetailDraft,
  statusColorMap,
} from "@/constants/assistants.constants";
import { useAuthContext } from "@/providers/AuthProvider";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AssistantsPage() {
  useSetBreadcrumb([{ label: "조교 관리" }]);
  const { user } = useAuthContext();
  const instructorName = user?.name ?? "담당 강사";

  const {
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
    contractRecords,
    contractStatusClassMap,
    sendTargetId,
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
  } = useAssistantsManagePage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <AssistantsHeader
        activeTab={activeTab}
        onTabClick={(tab) => {
          if (tab === "contracts") {
            openContractManageModal();
            return;
          }

          if (tab === "manage") {
            setActiveModal("none");
          }
        }}
        onOpenTaskModal={() => setActiveModal("task")}
        actionNotice={headerNotice}
      />

      <AssistantsStatsGrid
        stats={stats}
        onOpenContractManageModal={openContractManageModal}
      />

      <AssistantsFiltersBar
        activeStatusFilter={activeStatusFilter}
        onChangeActiveStatusFilter={changeActiveStatusFilter}
      />

      <AssistantsTable
        statusLabel={statusLabel}
        totalCount={totalCount}
        assistants={paginatedAssistants}
        statusColorMap={statusColorMap}
        pagination={pagination}
        onOpenAssistantDetail={openAssistantDetailModal}
        onPageChange={setCurrentPage}
      />

      <ContractManageModal
        open={activeModal === "contractManage"}
        onOpenChange={(open) => {
          if (open) {
            openContractManageModal();
            return;
          }

          setActiveModal("none");
        }}
        contractRecords={contractRecords}
        assistantRecords={assistantRecords}
        contractStatusClassMap={contractStatusClassMap}
        onOpenContractSend={openContractSendModal}
        onPreviewNotice={setActionNotice}
      />

      <ContractSendModal
        open={activeModal === "sendContract"}
        onOpenChange={(open) => {
          if (open) {
            openContractSendModal();
            return;
          }

          setActiveModal("none");
        }}
        assistantRecords={assistantRecords}
        sendTargetId={sendTargetId}
        onChangeSendTargetId={setSendTargetId}
        selectedTargetAssistant={selectedTargetAssistant}
        sendTemplate={sendTemplate}
        contractTemplateOptions={contractTemplateOptions}
        onChangeSendTemplate={(template) =>
          setSendTemplate(template as (typeof contractTemplateOptions)[number])
        }
        uploadFileName={uploadFileName}
        onChangeUploadFileName={setUploadFileName}
        onOpenContractManage={openContractManageModal}
        onPreviewNotice={setActionNotice}
      />

      <AssistantDetailModal
        open={activeModal === "assistantDetail"}
        onOpenChange={(open) => {
          if (open) {
            setActiveModal("assistantDetail");
            return;
          }

          closeAssistantDetailModal();
        }}
        selectedAssistant={selectedAssistant}
        assistantDetailDraft={assistantDetailDraft}
        isEditingAssistantDetail={isEditingAssistantDetail}
        isRetiringAssistant={isRetiringAssistant}
        editableStatusOptions={editableStatusOptions}
        onChangeStatus={(status) =>
          setAssistantDetailDraft((prev) => ({
            ...prev,
            status,
          }))
        }
        onChangeMemo={(memo) =>
          setAssistantDetailDraft((prev) => ({
            ...prev,
            memo,
          }))
        }
        onRetireAssistant={retireAssistant}
        onCancelEdit={() => {
          setAssistantDetailDraft(
            createAssistantDetailDraft(selectedAssistant)
          );
          setIsEditingAssistantDetail(false);
        }}
        onSaveDetail={saveAssistantDetail}
        onCloseDetail={closeAssistantDetailModal}
        onStartEdit={() => {
          setAssistantDetailDraft(
            createAssistantDetailDraft(selectedAssistant)
          );
          setIsEditingAssistantDetail(true);
          setActionNotice("수정 모드가 활성화되었습니다.");
        }}
      />

      <TaskCreateModal
        open={activeModal === "task"}
        onOpenChange={(open) =>
          open ? setActiveModal("task") : closeTaskModal()
        }
        instructorName={instructorName}
        assistantOptions={assistantTaskOptions}
        taskAssigneeId={taskAssigneeId}
        onChangeTaskAssigneeId={setTaskAssigneeId}
        taskTitle={taskTitle}
        onChangeTaskTitle={setTaskTitle}
        taskPriority={taskPriority}
        onChangeTaskPriority={setTaskPriority}
        taskDeadlineDate={taskDeadlineDate}
        onChangeTaskDeadlineDate={setTaskDeadlineDate}
        taskDeadlineTime={taskDeadlineTime}
        onChangeTaskDeadlineTime={setTaskDeadlineTime}
        taskInstructionContent={taskInstructionContent}
        onChangeTaskInstructionContent={setTaskInstructionContent}
        attachedResources={attachedResources}
        onOpenResourceLibraryModal={openResourceLibraryModal}
        onRemoveAttachedResource={removeAttachedResource}
        onCancel={closeTaskModal}
        onSubmit={submitTask}
        isSubmitting={isCreatingTask}
      />

      <ResourceLibraryModal
        open={isResourceLibraryModalOpen}
        onOpenChange={(open) => {
          if (open) {
            openResourceLibraryModal();
            return;
          }

          closeResourceLibraryModal();
        }}
        resourceSearchKeyword={resourceSearchKeyword}
        onChangeResourceSearchKeyword={setResourceSearchKeyword}
        resourceCategoryFilter={resourceCategoryFilter}
        resourceCategoryOptions={resourceCategoryOptions}
        onChangeResourceCategoryFilter={setResourceCategoryFilter}
        filteredResourceLibraryItems={filteredResourceLibraryItems}
        libraryDraftResourceIds={libraryDraftResourceIds}
        onToggleDraftResourceSelection={toggleDraftResourceSelection}
        onCancel={closeResourceLibraryModal}
        onApply={applyResourceSelection}
      />
    </div>
  );
}
