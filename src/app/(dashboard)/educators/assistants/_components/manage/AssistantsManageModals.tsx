"use client";

import type { AssistantsManagePageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsManagePage";
import AssistantDetailModal from "@/app/(dashboard)/educators/assistants/_modals/AssistantDetailModal";
import ContractManageModal from "@/app/(dashboard)/educators/assistants/_modals/ContractManageModal";
import ContractSendModal from "@/app/(dashboard)/educators/assistants/_modals/ContractSendModal";
import ResourceLibraryModal from "@/app/(dashboard)/educators/assistants/_modals/ResourceLibraryModal";
import TaskCreateModal from "@/app/(dashboard)/educators/assistants/_modals/TaskCreateModal";
import { createAssistantDetailDraft } from "@/constants/assistants.constants";

type AssistantsManageModalsProps = {
  instructorName: string;
  vm: AssistantsManagePageViewModel;
};

export default function AssistantsManageModals({
  instructorName,
  vm,
}: AssistantsManageModalsProps) {
  const { state, taskForm, resource, constants, flags, actions } = vm;

  return (
    <>
      <ContractManageModal
        open={state.activeModal === "contractManage"}
        onOpenChange={(open) => {
          if (open) {
            actions.openContractManageModal();
            return;
          }

          actions.setActiveModal("none");
        }}
        contractRecords={constants.contractRecords}
        assistantRecords={state.assistantRecords}
        contractStatusClassMap={constants.contractStatusClassMap}
        onOpenContractSend={actions.openContractSendModal}
        onPreviewNotice={actions.setActionNotice}
      />

      <ContractSendModal
        open={state.activeModal === "sendContract"}
        onOpenChange={(open) => {
          if (open) {
            actions.openContractSendModal();
            return;
          }

          actions.setActiveModal("none");
        }}
        assistantRecords={state.assistantRecords}
        sendTargetId={state.sendTargetId}
        onChangeSendTargetId={actions.setSendTargetId}
        selectedTargetAssistant={state.selectedTargetAssistant}
        sendTemplate={state.sendTemplate}
        contractTemplateOptions={constants.contractTemplateOptions}
        onChangeSendTemplate={(template) =>
          actions.setSendTemplate(
            template as (typeof constants.contractTemplateOptions)[number]
          )
        }
        uploadFileName={state.uploadFileName}
        onChangeUploadFileName={actions.setUploadFileName}
        onOpenContractManage={actions.openContractManageModal}
        onPreviewNotice={actions.setActionNotice}
      />

      <AssistantDetailModal
        open={state.activeModal === "assistantDetail"}
        onOpenChange={(open) => {
          if (open) {
            actions.setActiveModal("assistantDetail");
            return;
          }

          actions.closeAssistantDetailModal();
        }}
        selectedAssistant={state.selectedAssistant}
        assistantDetailDraft={state.assistantDetailDraft}
        isEditingAssistantDetail={state.isEditingAssistantDetail}
        isRetiringAssistant={flags.isRetiringAssistant}
        editableStatusOptions={constants.editableStatusOptions}
        onChangeStatus={(status) =>
          actions.setAssistantDetailDraft((prev) => ({
            ...prev,
            status,
          }))
        }
        onChangeMemo={(memo) =>
          actions.setAssistantDetailDraft((prev) => ({
            ...prev,
            memo,
          }))
        }
        onRetireAssistant={actions.retireAssistant}
        onCancelEdit={() => {
          actions.setAssistantDetailDraft(
            createAssistantDetailDraft(state.selectedAssistant)
          );
          actions.setIsEditingAssistantDetail(false);
        }}
        onSaveDetail={actions.saveAssistantDetail}
        onCloseDetail={actions.closeAssistantDetailModal}
        onStartEdit={() => {
          actions.setAssistantDetailDraft(
            createAssistantDetailDraft(state.selectedAssistant)
          );
          actions.setIsEditingAssistantDetail(true);
          actions.setActionNotice("수정 모드가 활성화되었습니다.");
        }}
      />

      <TaskCreateModal
        open={state.activeModal === "task"}
        onOpenChange={(open) =>
          open ? actions.setActiveModal("task") : actions.closeTaskModal()
        }
        instructorName={instructorName}
        assistantOptions={taskForm.assistantTaskOptions}
        taskAssigneeId={taskForm.taskAssigneeId}
        onChangeTaskAssigneeId={actions.setTaskAssigneeId}
        taskTitle={taskForm.taskTitle}
        onChangeTaskTitle={actions.setTaskTitle}
        taskPriority={taskForm.taskPriority}
        onChangeTaskPriority={actions.setTaskPriority}
        taskDeadlineDate={taskForm.taskDeadlineDate}
        onChangeTaskDeadlineDate={actions.setTaskDeadlineDate}
        taskDeadlineTime={taskForm.taskDeadlineTime}
        onChangeTaskDeadlineTime={actions.setTaskDeadlineTime}
        taskInstructionContent={taskForm.taskInstructionContent}
        onChangeTaskInstructionContent={actions.setTaskInstructionContent}
        attachedResources={resource.attachedResources}
        onOpenResourceLibraryModal={actions.openResourceLibraryModal}
        onRemoveAttachedResource={actions.removeAttachedResource}
        onCancel={actions.closeTaskModal}
        onSubmit={actions.submitTask}
        isSubmitting={flags.isCreatingTask}
      />

      <ResourceLibraryModal
        open={resource.isResourceLibraryModalOpen}
        onOpenChange={(open) => {
          if (open) {
            actions.openResourceLibraryModal();
            return;
          }

          actions.closeResourceLibraryModal();
        }}
        resourceSearchKeyword={resource.resourceSearchKeyword}
        onChangeResourceSearchKeyword={actions.setResourceSearchKeyword}
        resourceCategoryFilter={resource.resourceCategoryFilter}
        resourceCategoryOptions={resource.resourceCategoryOptions}
        onChangeResourceCategoryFilter={actions.setResourceCategoryFilter}
        filteredResourceLibraryItems={resource.filteredResourceLibraryItems}
        isLoading={resource.isResourceLibraryLoading}
        errorMessage={resource.resourceLibraryError}
        libraryDraftResourceIds={resource.libraryDraftResourceIds}
        onToggleDraftResourceSelection={actions.toggleDraftResourceSelection}
        onCancel={actions.closeResourceLibraryModal}
        onApply={actions.applyResourceSelection}
      />
    </>
  );
}
