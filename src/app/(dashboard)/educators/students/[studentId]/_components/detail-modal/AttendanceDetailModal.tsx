import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/ModalProvider";
import { GetEnrollmentDetail, AttendanceList } from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";

import AttendanceDetailTable from "../table/AttendanceDetailTable";

type AttendanceDetailModalProps = {
  studentData: GetEnrollmentDetail;
  attendancesList: AttendanceList[];
};

export default function AttendanceDetailModal({
  studentData,
  attendancesList,
}: AttendanceDetailModalProps) {
  const { isOpen, closeModal } = useModal();

  // 날짜 포맷팅 (안전하게 처리)
  const attendanceRecords: AttendanceList[] = (attendancesList || []).map(
    (record) => ({
      ...record,
      date: formatYMDFromISO(record.date) ?? record.date,
    })
  );

  const handleClose = () => {
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{studentData.studentName} 학생 출결 상세</DialogTitle>
          <DialogDescription>
            최근 출결 현황을 확인하세요. (총 {attendanceRecords.length}건)
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 border rounded-md p-4 max-h-[500px] overflow-y-auto">
          {attendanceRecords.length > 0 ? (
            <AttendanceDetailTable records={attendanceRecords} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              출결 기록이 없습니다.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
