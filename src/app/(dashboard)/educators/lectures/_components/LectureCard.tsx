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

type LectureCardProps = {
  lecture: Lecture;
};

export function LectureCard({ lecture }: LectureCardProps) {
  const openDetailModal = useLectureDetailModalStore((state) => state.open);
  const closeModal = useLectureDetailModalStore((state) => state.close);
  const selectedLectureId = useLectureDetailModalStore(
    (state) => state.selectedLectureId
  );
  const isModalOpen = useLectureDetailModalStore((state) => state.isOpen);
  const { openModal } = useModal();

  const { mutate: deleteLecture, isPending: isDeleting } = useDeleteLecture({
    onSuccess: () => {
      if (isModalOpen && selectedLectureId === lecture.id) {
        closeModal();
      }
    },
  });
  const hasSchedule = lecture.schedule.days.length > 0;
  const scheduleDays = hasSchedule
    ? lecture.schedule.days.join(", ")
    : "일정 없음";
  const scheduleTime = hasSchedule ? lecture.schedule.time : "-";
  const instructorInitial = lecture.instructor?.slice(0, 1) ?? "-";

  const openDeleteConfirmModal = () => {
    openModal(
      createElement(CheckModal, {
        title: "수업을 삭제할까요?",
        description: `${lecture.name} 수업이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`,
        confirmText: "삭제",
        cancelText: "취소",
        onConfirm: () => deleteLecture(lecture.id),
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
      instructorInitial={instructorInitial}
      onClick={() => openDetailModal(lecture.id)}
      action={
        <Button
          type="button"
          variant="outline"
          className="h-9 w-9 rounded-full border-0 bg-[#d6d9e0] p-0 text-white hover:bg-[#c8ccd6] hover:text-white"
          aria-label={`${lecture.name} 삭제`}
          disabled={isDeleting}
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
