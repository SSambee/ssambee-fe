import { type Dispatch, type SetStateAction, useRef, useState } from "react";

import { TIME_HHMM_REGEX } from "@/constants/regex";
import { createAssistantOrderAPI } from "@/services/assistants/assistantOrders.service";
import {
  signAssistantAPI,
  updateAssistantAPI,
} from "@/services/assistants/assistants.service";
import type { AssistantOrderPriority } from "@/types/assistantOrders";
import type {
  ActiveStatusFilter,
  Assistant,
  AssistantDetailDraft,
} from "@/types/assistants";
import { htmlToPlainText } from "@/utils/assistants";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

type UseAssistantsManageActionsParams = {
  selectedAssistant: Assistant | undefined;
  assistantDetailDraft: AssistantDetailDraft;
  setAssistantRecords: Dispatch<SetStateAction<Assistant[]>>;
  setAssistantDetailDraft: Dispatch<SetStateAction<AssistantDetailDraft>>;
  setIsEditingAssistantDetail: Dispatch<SetStateAction<boolean>>;
  setActionNotice: Dispatch<SetStateAction<string | null>>;
  setActiveStatusFilter: Dispatch<SetStateAction<ActiveStatusFilter>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  closeAssistantDetailModal: () => void;
  reloadAssistants: () => Promise<void>;
  taskAssigneeId: string;
  taskTitle: string;
  taskPriority: AssistantOrderPriority;
  taskDeadlineDate: string;
  taskDeadlineTime: string;
  taskInstructionContent: string;
  attachedResourceIds: string[];
  closeTaskModal: () => void;
};

export const useAssistantsManageActions = ({
  selectedAssistant,
  assistantDetailDraft,
  setAssistantRecords,
  setAssistantDetailDraft,
  setIsEditingAssistantDetail,
  setActionNotice,
  setActiveStatusFilter,
  setCurrentPage,
  closeAssistantDetailModal,
  reloadAssistants,
  taskAssigneeId,
  taskTitle,
  taskPriority,
  taskDeadlineDate,
  taskDeadlineTime,
  taskInstructionContent,
  attachedResourceIds,
  closeTaskModal,
}: UseAssistantsManageActionsParams) => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isRetiringAssistant, setIsRetiringAssistant] = useState(false);
  const retireInFlightRef = useRef(false);
  const createTaskInFlightRef = useRef(false);

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

  const submitTask = async () => {
    if (createTaskInFlightRef.current) {
      return;
    }

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

    createTaskInFlightRef.current = true;
    setIsCreatingTask(true);

    try {
      const sanitizedMemo = htmlToPlainText(taskInstructionContent);

      await createAssistantOrderAPI({
        assistantId: taskAssigneeId,
        title: trimmedTitle,
        memo: sanitizedMemo || undefined,
        priority: taskPriority,
        deadlineAt,
        materialIds:
          attachedResourceIds.length > 0 ? attachedResourceIds : undefined,
      });

      await reloadAssistants();
      setActionNotice(
        attachedResourceIds.length > 0
          ? `업무 지시가 등록되었습니다. 자료 ${attachedResourceIds.length}건이 첨부되었습니다.`
          : "업무 지시가 등록되었습니다."
      );
      closeTaskModal();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      createTaskInFlightRef.current = false;
      setIsCreatingTask(false);
    }
  };

  return {
    isCreatingTask,
    isRetiringAssistant,
    saveAssistantDetail,
    retireAssistant,
    submitTask,
  };
};
