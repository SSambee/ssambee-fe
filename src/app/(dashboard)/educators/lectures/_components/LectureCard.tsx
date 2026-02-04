"use client";

import { X } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lecture } from "@/types/lectures";
import { useLectureDetailModalStore } from "@/stores/lectures";
import { useDeleteLecture } from "@/hooks/lectures/useDeleteLecture";

import { LectureStatusBadge } from "./LectureStatusBadge";

type LectureCardProps = {
  lecture: Lecture;
};

export function LectureCard({ lecture }: LectureCardProps) {
  const openModal = useLectureDetailModalStore((state) => state.open);
  const closeModal = useLectureDetailModalStore((state) => state.close);
  const selectedLectureId = useLectureDetailModalStore(
    (state) => state.selectedLectureId
  );
  const isModalOpen = useLectureDetailModalStore((state) => state.isOpen);
  const { mutate: deleteLecture, isPending: isDeleting } = useDeleteLecture({
    onSuccess: () => {
      if (isModalOpen && selectedLectureId === lecture.id) {
        closeModal();
      }
    },
  });
  const hasSchedule = lecture.schedule.days.length > 0;
  const scheduleText = hasSchedule
    ? `${lecture.schedule.days.join(", ")} · ${lecture.schedule.time}`
    : "일정 없음";

  return (
    <>
      <Card className="relative overflow-hidden">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="absolute right-3 top-3 h-8 w-8 p-0"
              aria-label={`${lecture.name} 삭제`}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>수업을 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                {lecture.name} 수업이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteLecture(lecture.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardContent className="pt-6">
          <div className="mb-3 flex items-center gap-2">
            {lecture.status && <LectureStatusBadge status={lecture.status} />}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {lecture.schoolYear}
            </span>
          </div>

          <h3 className="text-lg font-semibold">{lecture.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>🕐</span>
            {scheduleText}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>👥 등록 {lecture.currentStudents}명</span>
            <span>담당 강사 {lecture.instructor}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => openModal(lecture.id)}
          >
            상세 보기
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
