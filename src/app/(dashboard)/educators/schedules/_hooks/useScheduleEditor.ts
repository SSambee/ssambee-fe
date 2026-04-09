"use client";

import { useCallback, useState } from "react";
import { createElement } from "react";
import { format } from "date-fns";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { useModal } from "@/app/providers/ModalProvider";
import {
  mapScheduleFormToPayload,
  mapScheduleFormToUpdatePayload,
  OTHER_CATEGORY_KEY,
} from "@/services/schedules/schedules.mapper";
import {
  createScheduleAPI,
  deleteScheduleAPI,
  updateScheduleAPI,
} from "@/services/schedules/schedules.service";
import type {
  ScheduleCalendarEvent,
  ScheduleFormState,
  ScheduleModalMode,
} from "@/types/schedules";

const KST_TIMEZONE = "Asia/Seoul";

const KST_FORM_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  timeZone: KST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

const getKstFormDateTimeFromDate = (date: Date) => {
  const parts = KST_FORM_DATE_TIME_FORMATTER.formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    date: `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
    time: `${getPart("hour")}:${getPart("minute")}`,
  };
};

const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

type UseScheduleEditorParams = {
  defaultCategoryId: string;
  isCategoryActionInProgress: boolean;
  loadSchedules: () => Promise<void>;
  onFocusDate: (date: Date) => void;
};

export function useScheduleEditor({
  defaultCategoryId,
  isCategoryActionInProgress,
  loadSchedules,
  onFocusDate,
}: UseScheduleEditorParams) {
  const { openModal } = useModal();
  const [createOpen, setCreateOpen] = useState(false);
  const [scheduleModalMode, setScheduleModalMode] =
    useState<ScheduleModalMode>("create");
  const [formError, setFormError] = useState<string | null>(null);
  const [isScheduleCreating, setIsScheduleCreating] = useState(false);
  const [isScheduleUpdating, setIsScheduleUpdating] = useState(false);
  const [isScheduleDeleting, setIsScheduleDeleting] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );
  const [formState, setFormState] = useState<ScheduleFormState>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "",
    endTime: "",
    isAllDay: false,
    categoryId: OTHER_CATEGORY_KEY,
    description: "",
  });

  const resetScheduleForm = useCallback(() => {
    setFormState({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      isAllDay: false,
      categoryId: defaultCategoryId,
      description: "",
    });
  }, [defaultCategoryId]);

  const openCreateScheduleModal = useCallback(() => {
    setEditingScheduleId(null);
    setScheduleModalMode("create");
    setFormError(null);
    resetScheduleForm();
    setCreateOpen(true);
  }, [resetScheduleForm]);

  const closeCreateScheduleModal = useCallback(() => {
    setCreateOpen(false);
    setEditingScheduleId(null);
    setScheduleModalMode("create");
    setFormError(null);
  }, []);

  const handleStartScheduleEdit = useCallback(
    (event: ScheduleCalendarEvent) => {
      const { date, time: startTime } = getKstFormDateTimeFromDate(event.start);
      const { time: endTime } = getKstFormDateTimeFromDate(event.end);

      setEditingScheduleId(event.id);
      setScheduleModalMode("view");
      setFormError(null);
      setFormState({
        title: event.name,
        date,
        startTime: event.allDay ? "" : startTime,
        endTime: event.allDay ? "" : endTime,
        isAllDay: Boolean(event.allDay),
        categoryId: event.categoryId ?? OTHER_CATEGORY_KEY,
        description: event.description ?? "",
      });
      setCreateOpen(true);
    },
    []
  );

  const enableScheduleEdit = useCallback(() => {
    setScheduleModalMode("edit");
  }, []);

  const handleCreateSubmit = useCallback(async () => {
    if (
      isScheduleCreating ||
      isScheduleUpdating ||
      isScheduleDeleting ||
      isCategoryActionInProgress
    ) {
      return;
    }

    if (scheduleModalMode === "view") {
      return;
    }

    if (scheduleModalMode === "edit" && !editingScheduleId) {
      setFormError("수정할 일정을 찾을 수 없습니다. 다시 시도해 주세요.");
      return;
    }

    if (
      !formState.title.trim() ||
      !formState.date ||
      (!formState.isAllDay && (!formState.startTime || !formState.endTime))
    ) {
      setFormError(
        formState.isAllDay
          ? "일정 제목과 날짜를 모두 입력해 주세요."
          : "일정 제목, 날짜, 시작시간, 종료시간을 모두 입력해 주세요."
      );
      return;
    }

    if (
      !formState.isAllDay &&
      (!TIME_FORMAT_REGEX.test(formState.startTime) ||
        !TIME_FORMAT_REGEX.test(formState.endTime))
    ) {
      setFormError("시간은 HH:mm 형식으로 입력해 주세요.");
      return;
    }

    if (
      !formState.isAllDay &&
      toMinutes(formState.endTime) < toMinutes(formState.startTime)
    ) {
      setFormError("종료시간은 시작시간보다 빠를 수 없습니다.");
      return;
    }

    const nextDate = new Date(
      `${formState.date}T${formState.isAllDay ? "00:00" : formState.startTime}:00+09:00`
    );

    try {
      if (editingScheduleId) {
        setIsScheduleUpdating(true);
        await updateScheduleAPI(
          editingScheduleId,
          mapScheduleFormToUpdatePayload(formState)
        );
      } else {
        setIsScheduleCreating(true);
        await createScheduleAPI(mapScheduleFormToPayload(formState));
      }

      await loadSchedules();

      if (!Number.isNaN(nextDate.getTime())) {
        onFocusDate(nextDate);
      }

      closeCreateScheduleModal();
      setEditingScheduleId(null);
      resetScheduleForm();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsScheduleCreating(false);
      setIsScheduleUpdating(false);
    }
  }, [
    closeCreateScheduleModal,
    scheduleModalMode,
    editingScheduleId,
    formState,
    isCategoryActionInProgress,
    isScheduleCreating,
    isScheduleDeleting,
    isScheduleUpdating,
    loadSchedules,
    onFocusDate,
    resetScheduleForm,
  ]);

  const handleDeleteSchedule = useCallback(async () => {
    if (
      scheduleModalMode === "create" ||
      !editingScheduleId ||
      isScheduleDeleting ||
      isScheduleUpdating
    ) {
      return;
    }

    openModal(
      createElement(CheckModal, {
        title: "일정을 삭제할까요?",
        description: "삭제된 일정은 복구할 수 없습니다.",
        confirmText: isScheduleDeleting ? "삭제 중..." : "삭제",
        cancelText: "취소",
        confirmDisabled: isScheduleDeleting || isScheduleUpdating,
        onConfirm: async () => {
          setIsScheduleDeleting(true);

          try {
            await deleteScheduleAPI(editingScheduleId);
            await loadSchedules();
            closeCreateScheduleModal();
            setEditingScheduleId(null);
            resetScheduleForm();
          } catch (error) {
            setFormError(getErrorMessage(error));
          } finally {
            setIsScheduleDeleting(false);
          }
        },
      })
    );
  }, [
    openModal,
    closeCreateScheduleModal,
    scheduleModalMode,
    editingScheduleId,
    isScheduleDeleting,
    isScheduleUpdating,
    loadSchedules,
    resetScheduleForm,
  ]);

  return {
    createOpen,
    scheduleModalMode,
    editingScheduleId,
    formError,
    setFormError,
    formState,
    setFormState,
    isScheduleCreating,
    isScheduleUpdating,
    isScheduleDeleting,
    openCreateScheduleModal,
    closeCreateScheduleModal,
    handleStartScheduleEdit,
    enableScheduleEdit,
    handleCreateSubmit,
    handleDeleteSchedule,
    resetScheduleForm,
  };
}
