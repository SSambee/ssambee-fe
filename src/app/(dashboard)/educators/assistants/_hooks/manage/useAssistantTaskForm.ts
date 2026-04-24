import { useMemo, useState } from "react";

import type { Assistant } from "@/types/assistants";
import type { AssistantOrderPriority } from "@/types/assistantOrders";

type UseAssistantTaskFormParams = {
  assistantTaskOptions: Assistant[];
};

export const useAssistantTaskForm = ({
  assistantTaskOptions,
}: UseAssistantTaskFormParams) => {
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] =
    useState<AssistantOrderPriority>("NORMAL");
  const [taskDeadlineDate, setTaskDeadlineDate] = useState("");
  const [taskDeadlineTime, setTaskDeadlineTime] = useState("");
  const [taskInstructionContent, setTaskInstructionContent] = useState("");

  const resolvedTaskAssigneeId = useMemo(() => {
    if (assistantTaskOptions.length === 0) {
      return "";
    }

    const selectedAssistant = assistantTaskOptions.find(
      (assistant) => assistant.id === taskAssigneeId
    );

    return selectedAssistant?.id ?? assistantTaskOptions[0].id;
  }, [assistantTaskOptions, taskAssigneeId]);

  const resetTaskForm = (fallbackAssigneeId = "") => {
    setTaskAssigneeId(fallbackAssigneeId);
    setTaskTitle("");
    setTaskPriority("NORMAL");
    setTaskDeadlineDate("");
    setTaskDeadlineTime("");
    setTaskInstructionContent("");
  };

  return {
    taskAssigneeId: resolvedTaskAssigneeId,
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
    resetTaskForm,
  };
};
