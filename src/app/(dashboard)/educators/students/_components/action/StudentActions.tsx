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

  return (
    <div className="flex justify-between items-center mt-[58px] mb-5">
      {/* 모달 버튼 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => openModal(<StudentCreateModal />)}
        >
          학생 등록
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={selectedStudentIds.length === 0}
          onClick={() => openModal(<StudentChangeModal />)}
        >
          수업 변경
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={selectedStudentIds.length === 0}
          onClick={() => openModal(<TalkNotificationModal />)}
        >
          알림 발송
        </Button>
        <Button
          variant="default"
          disabled={
            !queryLecture ||
            selectedStudentIds.length === 0 ||
            isUpdating ||
            selectedLectureStatus === "COMPLETED"
          }
          className="cursor-pointer"
          onClick={onAttendanceClick}
        >
          {isUpdating ? "등록 중..." : "출결 등록"}
        </Button>
      </div>
      {selectedStudentIds.length > 0 && (
        <div>
          <span className="flex items-end text-sm text-muted-foreground">
            선택된 학생 {selectedStudentIds.length}명
          </span>
        </div>
      )}
    </div>
  );
}
