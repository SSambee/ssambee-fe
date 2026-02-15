"use client";

import { createElement, useCallback, useMemo, useState } from "react";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { useAuthContext } from "@/providers/AuthProvider";
import { useModal } from "@/providers/ModalProvider";
import { mapLectureStatusToApi } from "@/services/lectures/lectures.service";
import { Lecture, LectureStatus } from "@/types/lectures";
import { useLectureDetail } from "@/hooks/lectures/useLectureDetail";
import { useUpdateLecture } from "@/hooks/lectures/useUpdateLecture";
import { DEFAULT_LECTURE } from "@/constants/lectures.constants";

import type { UseLectureDetailModalParams } from "./types";
import { useLectureEditForm } from "./useLectureEditForm";
import { useLectureScheduleEdit } from "./useLectureScheduleEdit";

export const useLectureDetailModal = ({
  lecture,
  open,
}: UseLectureDetailModalParams) => {
  const { user } = useAuthContext();
  const { openModal } = useModal();

  const openAlertModal = useCallback(
    (title: string, description: string) => {
      openModal(
        createElement(CheckModal, {
          title,
          description,
          confirmText: "확인",
          cancelText: "닫기",
          onConfirm: () => {},
        })
      );
    },
    [openModal]
  );

  const baseLecture = useMemo<Lecture>(
    () => lecture ?? DEFAULT_LECTURE,
    [lecture]
  );
  const lectureId = lecture?.id ?? "";

  const { data: lectureDetail, isPending: isLectureLoading } = useLectureDetail(
    lectureId,
    open
  );

  const mergedLecture = useMemo(() => {
    if (!lectureDetail) return baseLecture;
    const schedule =
      lectureDetail.schedule.days.length > 0
        ? lectureDetail.schedule
        : baseLecture.schedule;
    return { ...baseLecture, ...lectureDetail, schedule };
  }, [baseLecture, lectureDetail]);

  const studentList = lectureDetail?.students ?? mergedLecture.students ?? [];
  const currentStudents =
    studentList.length > 0 ? studentList.length : mergedLecture.currentStudents;

  const editForm = useLectureEditForm();
  const scheduleEdit = useLectureScheduleEdit();

  const [isEditing, setIsEditing] = useState(false);

  const resetEditState = useCallback(() => {
    const fallbackInstructor =
      user?.name || user?.email || mergedLecture.instructor;

    editForm.resetForm({
      editTitle: mergedLecture.name,
      editSubject: mergedLecture.subject,
      editSchoolYear: mergedLecture.schoolYear,
      editStatus: mergedLecture.status ?? "",
      editStartDate: mergedLecture.startDate ?? "",
      editInstructor: fallbackInstructor ? `${fallbackInstructor} 강사님` : "",
    });

    scheduleEdit.resetSchedule(
      mergedLecture.schedule,
      lectureDetail?.lectureTimes ?? mergedLecture.lectureTimes
    );
  }, [editForm, scheduleEdit, mergedLecture, lectureDetail, user]);

  const handleEditStart = useCallback(() => {
    resetEditState();
    setIsEditing(true);
  }, [resetEditState]);

  const handleEditCancel = useCallback(() => {
    resetEditState();
    setIsEditing(false);
  }, [resetEditState]);

  const updateLectureMutation = useUpdateLecture();

  const handleSaveEdit = useCallback(() => {
    if (scheduleEdit.hasInvalidSchedule()) {
      openAlertModal(
        "시간표 입력 오류",
        "시간표의 요일/시작/종료 시간을 모두 입력해주세요."
      );
      return;
    }
    if (!lectureId) {
      openAlertModal("강의 ID 오류", "강의 ID가 없습니다.");
      return;
    }

    const formValues = editForm.getFormValues();

    updateLectureMutation.mutate(
      {
        lectureId,
        payload: {
          title: formValues.editTitle,
          schoolYear: formValues.editSchoolYear,
          subject: formValues.editSubject,
          status: mapLectureStatusToApi(formValues.editStatus as LectureStatus),
          startAt: formValues.editStartDate
            ? new Date(formValues.editStartDate).toISOString()
            : null,
          lectureTimes: scheduleEdit.getValidLectureTimes(),
        },
      },
      {
        onSuccess: () => {
          scheduleEdit.setLocalSchedule(scheduleEdit.buildScheduleFromTimes());
          setIsEditing(false);
        },
        onError: () => {
          openAlertModal("저장 실패", "수정 중 오류가 발생했습니다.");
        },
      }
    );
  }, [
    editForm,
    lectureId,
    openAlertModal,
    scheduleEdit,
    updateLectureMutation,
  ]);

  const scheduleSummary = useCallback(
    () => scheduleEdit.scheduleSummary(mergedLecture.schedule, isEditing),
    [isEditing, scheduleEdit, mergedLecture.schedule]
  );

  return {
    lectureId,
    mergedLecture,
    studentList,
    currentStudents,
    isLectureLoading,
    isEditing,
    setIsEditing,
    resetEditState,
    ...editForm,
    editTimes: scheduleEdit.editTimes,
    dayOptions: scheduleEdit.dayOptions,
    handleAddSchedule: scheduleEdit.handleAddSchedule,
    handleRemoveSchedule: scheduleEdit.handleRemoveSchedule,
    handleScheduleChange: scheduleEdit.handleScheduleChange,
    scheduleSummary,
    handleEditStart,
    handleEditCancel,
    handleSaveEdit,
  };
};
