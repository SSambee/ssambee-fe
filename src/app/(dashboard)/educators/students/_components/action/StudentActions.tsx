import { ArrowLeftRight, CheckCircle2, Send, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { LectureStatus } from "@/types/students.type";

import { StudentChangeModal } from "../modal/ClassChangeModal";
import { TalkNotificationModal } from "../modal/TalkNotificationModal";
import { StudentCreateModal } from "../modal/StudentCreateModal";

type StudentActionsProps = {
  selectedStudentIds: string[];
  queryLecture: string | null;
  isUpdating: boolean;
  selectedLectureStatus: LectureStatus | undefined;
  onAttendanceClick: () => void;
};

export function StudentActions({
  selectedStudentIds,
  queryLecture,
  isUpdating,
  selectedLectureStatus,
  onAttendanceClick,
}: StudentActionsProps) {
  const { openModal } = useModal();

  const isAnythingSelected = selectedStudentIds.length > 0;
  const canRegisterAttendance =
    queryLecture &&
    isAnythingSelected &&
    !isUpdating &&
    selectedLectureStatus !== "COMPLETED";

  // 공통 버튼 기본 클래스
  const baseButtonStyles =
    "w-[140px] h-[52px] text-[15px] font-medium rounded-[12px] flex items-center justify-center gap-2 transition-all duration-200 border shadow-none";

  // 활성화 상태
  const activeStyles =
    "bg-white border-brand-700 text-brand-700 hover:bg-brand-50 hover:border-brand-800 active:scale-95";

  // 비활성화 상태
  const disabledStyles =
    "bg-white border-gray-200 text-gray-400 opacity-60 cursor-not-allowed";

  return (
    <div className="flex justify-between items-end mt-12 mb-6">
      <div className="flex gap-3">
        <Button
          className={`${baseButtonStyles} bg-brand-700 border-brand-700 text-white hover:bg-brand-800 active:scale-95 shadow-brand-100`}
          onClick={() => openModal(<StudentCreateModal />)}
        >
          <UserPlus size={18} />
          학생 등록
        </Button>

        <Button
          disabled={!isAnythingSelected}
          className={`${baseButtonStyles} ${isAnythingSelected ? activeStyles : disabledStyles}`}
          onClick={() => openModal(<StudentChangeModal />)}
        >
          <ArrowLeftRight size={18} />
          수업 변경
        </Button>

        <Button
          disabled={!isAnythingSelected}
          className={`${baseButtonStyles} ${isAnythingSelected ? activeStyles : disabledStyles}`}
          onClick={() => openModal(<TalkNotificationModal />)}
        >
          <Send size={18} />
          알림 발송
        </Button>

        <Button
          disabled={!canRegisterAttendance}
          className={`${baseButtonStyles} ${canRegisterAttendance ? activeStyles : disabledStyles}`}
          onClick={onAttendanceClick}
        >
          <CheckCircle2 size={18} />
          {isUpdating ? "처리 중..." : "출결 등록"}
        </Button>
      </div>

      {selectedStudentIds.length > 0 && (
        <div>
          <span className="flex items-end text-base text-muted-foreground">
            선택된 학생 {selectedStudentIds.length}명
          </span>
        </div>
      )}
    </div>
  );
}
