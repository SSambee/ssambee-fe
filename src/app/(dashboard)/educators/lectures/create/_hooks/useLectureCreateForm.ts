"use client";

import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";
import { createElement } from "react";

import {
  LectureCreatePayload,
  mapLectureStatusToApi,
} from "@/services/lectures/lectures.service";
import { LectureStatus, ScheduleData } from "@/types/lectures";
import {
  LectureFormInput,
  scheduleSchema,
} from "@/validation/lecture.validation";
import { CheckModal } from "@/components/common/modals/CheckModal";
import { useModal } from "@/providers/ModalProvider";

type UseLectureCreateFormParams = {
  lectureForm: UseFormReturn<LectureFormInput>;
  schedules: number[];
  scheduleData: Record<number, ScheduleData>;
  createLecture: UseMutationResult<unknown, unknown, LectureCreatePayload>;
  setIsSaved: (saved: boolean) => void;
  resetCreateState: () => void;
  onSuccess: () => void;
};

export const useLectureCreateForm = ({
  lectureForm,
  schedules,
  scheduleData,
  createLecture,
  setIsSaved,
  resetCreateState,
  onSuccess,
}: UseLectureCreateFormParams) => {
  const { openModal } = useModal();

  const openAlertModal = (title: string, description?: string) => {
    openModal(
      createElement(CheckModal, {
        title,
        description: description ?? "",
        confirmText: "확인",
        cancelText: "닫기",
        onConfirm: () => {},
      })
    );
  };

  const handleSave = lectureForm.handleSubmit(
    (lectureData) => {
      const hasInvalidSchedule = schedules.some(
        (id) => !scheduleSchema.safeParse(scheduleData[id]).success
      );

      if (hasInvalidSchedule) {
        openAlertModal(
          "시간표 입력 오류",
          "요일/시작/종료 시간을 모두 입력해주세요."
        );
        return;
      }

      const lectureTimes = schedules.map((id) => ({
        day: scheduleData[id]?.day || "",
        startTime: scheduleData[id]?.startTime || "",
        endTime: scheduleData[id]?.endTime || "",
      }));

      const enrollments = lectureData.students.map((student) => ({
        school: student.school,
        schoolYear: student.studentGrade,
        studentName: student.name,
        studentPhone: student.phone,
        parentPhone: student.parentPhone,
      }));

      const payload: LectureCreatePayload = {
        title: lectureData.name,
        schoolYear: lectureData.schoolYear,
        subject: lectureData.subject,
        status: mapLectureStatusToApi(lectureData.status as LectureStatus),
        startAt: lectureData.startDate
          ? new Date(lectureData.startDate).toISOString()
          : null,
        lectureTimes,
        enrollments,
      };

      createLecture.mutate(payload, {
        onSuccess,
        onError: () => {
          openAlertModal("저장 실패", "저장 중 오류가 발생했습니다.");
        },
      });
    },
    () => {
      openAlertModal("필수 입력값 확인", "필수 입력값을 확인해주세요.");
    }
  );

  const handleCancel = (isSaved: boolean, onBack: () => void) => {
    if (isSaved) {
      setIsSaved(false);
      return;
    }

    openModal(
      createElement(CheckModal, {
        title: "작성 취소",
        description: "작성 중인 내용을 취소하시겠습니까?",
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          resetCreateState();
          onBack();
        },
      })
    );
  };

  return { handleSave, handleCancel };
};
