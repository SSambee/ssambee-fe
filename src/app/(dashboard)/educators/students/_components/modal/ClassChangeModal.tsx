"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/providers/ModalProvider";
import { useStudentSelectionStore } from "@/stores/studentsList.store";
import SelectBtn from "@/components/common/button/SelectBtn";
import { useLecturesList, useMigrateStudents } from "@/hooks/useEnrollment";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";

export function StudentChangeModal() {
  const { isOpen, closeModal } = useModal();
  const [targetLecture, setTargetLecture] = useState("");
  const [memo, setMemo] = useState("");

  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 100 });

  const lectureOptions = lectures.map((lecture) => ({
    label: lecture.title,
    value: lecture.id,
  }));

  const { mutate: migrateStudents, isPending } = useMigrateStudents();

  const { selectedStudents, removeStudent, resetSelection } =
    useStudentSelectionStore();

  const handleSubmit = () => {
    if (!targetLecture || selectedStudents.length === 0) return;

    const enrollmentIds = selectedStudents.map((s) => s.enrollmentId);

    migrateStudents(
      {
        lectureId: targetLecture,
        enrollmentIds,
      },
      {
        onSuccess: () => {
          resetForm();
          resetSelection();
          closeModal();
        },
      }
    );
  };

  const resetForm = () => {
    setTargetLecture("");
    setMemo("");
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-[32px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-label-normal">
            선택 학생 수업 변경
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            선택한 학생들을 새로운 수업으로 이동시킵니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              대상 학생 목록
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (총 {selectedStudents.length}명)
              </span>
            </h3>

            <div className="min-h-[100px] max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {selectedStudents.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] bg-white border border-dashed border-neutral-200 rounded-[12px]">
                  <p className="text-sm text-muted-foreground">
                    선택한 학생이 없습니다.
                  </p>
                </div>
              ) : (
                selectedStudents.map((student) => (
                  <div
                    key={student.enrollmentId}
                    className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-[12px] hover:border-blue-300 transition-colors shadow-sm"
                  >
                    <StudentProfileAvatar
                      seedKey={student.enrollmentId}
                      sizePreset="Medium"
                    />
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-label-normal">
                        {student.name}
                      </p>
                      <p className="text-[13px] text-label-alternative mt-0.5">
                        현재 수업: {student.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`학생 ${student.name} 삭제`}
                      className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-colors"
                      onClick={() => removeStudent(student.enrollmentId)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              이동할 수업
            </h3>
            <div className="space-y-2">
              <SelectBtn
                id="targetLecture"
                value={targetLecture}
                placeholder={"이동할 수업을 선택해주세요"}
                optionSize="lg"
                className="text-base px-4 h-[58px] w-full bg-white border border-neutral-200 rounded-[12px]"
                options={lectureOptions}
                onChange={setTargetLecture}
              />
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              변경 메모
            </h3>
            <div className="space-y-2">
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="수업 변경 사유를 입력해주세요"
                className="text-base p-4 min-h-[130px] w-full rounded-[12px] bg-white border border-neutral-200 shadow-none focus-visible:ring-blue-500"
                rows={4}
              />
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              * 선택 학생과 담당 강사에게 알림이 전송됩니다.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-4">
          <div className="flex gap-2 w-full justify-end">
            <Button
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-white border border-neutral-200 hover:bg-neutral-50 text-label-normal shadow-none"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              className={`cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-brand-700 hover:bg-brand-800 text-white shadow-none ${
                !targetLecture || selectedStudents.length === 0 || isPending
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSubmit}
              disabled={
                selectedStudents.length === 0 || !targetLecture || isPending
              }
            >
              {isPending ? "변경 적용 중..." : "수업 변경 적용"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
