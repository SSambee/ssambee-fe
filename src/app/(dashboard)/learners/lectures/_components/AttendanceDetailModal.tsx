"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/app/providers/ModalProvider";
import { AttendanceList, AttendanceStatus } from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";
import { formatTextWithLineBreaks } from "@/utils/formatTextWithLineBreaks";
import DataTable, {
  ColumnDefinition,
} from "@/components/common/table/DataTable";

type AttendanceDetailModalProps = {
  studentName: string;
  attendancesList: AttendanceList[];
};

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "출석",
  ABSENT: "결석",
  LATE: "지각",
  EARLY_LEAVE: "조퇴",
};

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  PRESENT: "text-[#16a34a]",
  LATE: "text-[#d97706]",
  ABSENT: "text-[#dc2626]",
  EARLY_LEAVE: "text-[#2563eb]",
};

const ATTENDANCE_COLUMNS: ColumnDefinition<AttendanceList>[] = [
  {
    key: "date",
    label: "수업 일자",
    render: (row: AttendanceList) => (
      <span className="whitespace-nowrap text-sm">{row.date}</span>
    ),
  },
  {
    key: "status",
    label: "출결 상태",
    render: (row: AttendanceList) => (
      <span className={`font-medium ${STATUS_COLOR[row.status]}`}>
        {STATUS_LABEL[row.status]}
      </span>
    ),
  },
  {
    key: "memo",
    label: "메모",
    render: (row: AttendanceList) => {
      const memoChunks = formatTextWithLineBreaks(row.memo);

      if (memoChunks === "-") {
        return <span className="text-sm">-</span>;
      }

      return (
        <div className="text-sm">
          {(memoChunks as string[]).map((chunk, index) => (
            <div key={index}>{chunk}</div>
          ))}
        </div>
      );
    },
  },
];

export default function AttendanceDetailModal({
  studentName,
  attendancesList,
}: AttendanceDetailModalProps) {
  const { isOpen, closeModal } = useModal();

  const attendanceRecords: AttendanceList[] = attendancesList.map((record) => ({
    ...record,
    date: formatYMDFromISO(record.date) ?? record.date,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[760px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]">
        <DialogHeader className="gap-2 border-b border-neutral-100 px-6 pb-5 pt-6 sm:px-8">
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-label-normal">
            {studentName} 학생 출결 상세
          </DialogTitle>
          <DialogDescription className="text-[16px] font-medium leading-6 tracking-[-0.02em] text-neutral-500">
            출결 현황을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="max-h-[500px] overflow-y-auto">
            {attendanceRecords.length > 0 ? (
              <div className="min-w-[620px]">
                <DataTable
                  data={attendanceRecords}
                  columns={ATTENDANCE_COLUMNS}
                  emptyMessage="출결 기록이 없습니다."
                  compact
                />
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400">
                출결 기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
