"use client";

import { createElement } from "react";
import { X } from "lucide-react";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { Button } from "@/components/ui/button";
import { Lecture } from "@/types/lectures";
import { useLectureDetailModalStore } from "@/stores/lectures";
import { useDeleteLecture } from "@/hooks/lectures/useDeleteLecture";
import { CommonLectureCard } from "@/components/common/CommonLectureCard";
import { useModal } from "@/providers/ModalProvider";
import { useAuthContext } from "@/providers/AuthProvider";

import { LectureStatusBadge } from "./LectureStatusBadge";

type LectureCardProps = {
  lecture: Lecture;
};

type DeleteLectureConfirmModalProps = {
  lecture: Lecture;
  onDeleted: () => void;
};

function DeleteLectureConfirmModal({
  lecture,
  onDeleted,
}: DeleteLectureConfirmModalProps) {
  const { mutateAsync: deleteLecture, isPending: isDeleting } =
    useDeleteLecture({
      onSuccess: onDeleted,
    });

  return (
    <CheckModal
      title="수업을 삭제할까요?"
      description={`${lecture.name} 수업이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`}
      confirmText={isDeleting ? "삭제 중..." : "삭제"}
      cancelText="취소"
      confirmDisabled={isDeleting}
      onConfirm={async () => {
        if (isDeleting) return;
        await deleteLecture(lecture.id);
      }}
    />
  );
}

function DeleteLectureForbiddenModal() {
  return (
    <CheckModal
      title="삭제 권한이 없습니다"
      description={`조교 계정은 수업을 삭제할 수 없습니다.
강사 계정으로 진행해주세요.`}
      confirmText="확인"
      hideCancel
      onConfirm={async () => {
        return;
      }}
    />
  );
}

export function LectureCard({ lecture }: LectureCardProps) {
  const openDetailModal = useLectureDetailModalStore((state) => state.open);
  const closeModal = useLectureDetailModalStore((state) => state.close);
  const selectedLectureId = useLectureDetailModalStore(
    (state) => state.selectedLectureId
  );
  const isModalOpen = useLectureDetailModalStore((state) => state.isOpen);
  const { user } = useAuthContext();
  const { openModal } = useModal();
  const hasSchedule = lecture.schedule.days.length > 0;
  const scheduleDays = hasSchedule
    ? lecture.schedule.days.join(", ")
    : "일정 없음";
  const scheduleTime = hasSchedule ? lecture.schedule.time : "-";

  const openDeleteConfirmModal = () => {
    if (!user || user.userType === "ASSISTANT") {
      openModal(createElement(DeleteLectureForbiddenModal));
      return;
    }

    openModal(
      createElement(DeleteLectureConfirmModal, {
        lecture,
        onDeleted: () => {
          if (isModalOpen && selectedLectureId === lecture.id) {
            closeModal();
          }
        },
      })
    );
  };

  return (
    <CommonLectureCard
      subject={lecture.subject}
      schoolYear={lecture.schoolYear}
      title={lecture.name}
      scheduleDays={scheduleDays}
      scheduleTime={scheduleTime}
      hasSchedule={hasSchedule}
      currentStudents={lecture.currentStudents}
      instructorName={lecture.instructor}
      onClick={() => openDetailModal(lecture.id)}
      statusBadge={
        lecture.status ? <LectureStatusBadge status={lecture.status} /> : null
      }
      action={
        <Button
          type="button"
          variant="outline"
          className="h-9 w-9 rounded-full border-0 bg-[#d6d9e0] p-0 text-white hover:bg-[#c8ccd6] hover:text-white"
          aria-label={`${lecture.name} 삭제`}
          onClick={(e) => {
            e.stopPropagation();
            openDeleteConfirmModal();
          }}
        >
          <X className="h-[14px] w-[14px]" />
        </Button>
      }
    />
  );
}
