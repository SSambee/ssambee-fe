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
import { Label } from "@/components/ui/label";
import { useModal } from "@/providers/ModalProvider";
import { useStudentSelectionStore } from "@/stores/studentsList.store";
import SelectBtn from "@/components/common/button/SelectBtn";
import { useLecturesList, useMigrateStudents } from "@/hooks/useEnrollment";

export function StudentChangeModal() {
  const { isOpen, closeModal } = useModal();
  const [targetLecture, setTargetLecture] = useState("");
  const [memo, setMemo] = useState("");

  // 강의 목록 불러오기 (TanStack Query 캐싱 활용)
  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 20 });

  const lectureOptions = lectures.map((lecture) => ({
    label: lecture.title,
    value: lecture.id,
  }));

  // 수업 변경
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-xs text-muted-foreground mb-1">수업 이동</div>
          <DialogTitle className="text-xl">선택 학생 수업 변경</DialogTitle>
          <DialogDescription>
            선택한 학생들을 새로운 수업으로 이동시킵니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 학생 선택 섹션 */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                선택한 학생 {selectedStudents.length}명
              </p>
            </div>

            {/* 학생 목록 */}
            <div className="max-h-[350px] overflow-y-auto space-y-2">
              {selectedStudents.length === 0 ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent">
                  <p className="text-center text-sm text-muted-foreground">
                    선택한 학생이 없습니다.
                  </p>
                </div>
              ) : (
                selectedStudents.map((student) => (
                  <div
                    key={student.enrollmentId}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        현재 수업: {student.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`학생 ${student.name} 삭제`}
                      className="px-2 py-1 hover:bg-red-100 rounded"
                      onClick={() => removeStudent(student.enrollmentId)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 이동할 수업 선택 */}
            <div className="space-y-2">
              <Label htmlFor="targetLecture">
                이동할 수업 <span className="text-red-500">*</span>
              </Label>

              <SelectBtn
                id="targetLecture"
                value={targetLecture}
                placeholder={"수업 선택"}
                optionSize="sm"
                className="text-base px-4 h-[58px] w-full"
                options={lectureOptions}
                onChange={setTargetLecture}
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="수업 변경 사유를 입력하세요"
              className="text-base p-4 min-h-[130px] w-full"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-xs text-muted-foreground">
            선택 학생과 담당 강사에게 알림이 전송됩니다.
          </p>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSubmit}
              disabled={
                selectedStudents.length === 0 || !targetLecture || isPending
              }
            >
              {isPending ? "수업 변경 중..." : "수업 변경 적용"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
