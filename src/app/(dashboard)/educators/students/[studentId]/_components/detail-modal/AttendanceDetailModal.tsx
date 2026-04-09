"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/providers/ModalProvider";
import {
  GetEnrollmentDetail,
  AttendanceList,
  AttendanceStatus,
} from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";
import { formatTextWithLineBreaks } from "@/utils/formatTextWithLineBreaks";
import DataTable, {
  ColumnDefinition,
} from "@/components/common/table/DataTable";
import { useDeleteAttendance } from "@/hooks/useEnrollment";

type AttendanceDetailModalProps = {
  studentData: GetEnrollmentDetail;
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

export default function AttendanceDetailModal({
  studentData,
  attendancesList,
}: AttendanceDetailModalProps) {
  const { isOpen, closeModal } = useModal();
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    string | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteAttendance = useDeleteAttendance(
    studentData.lectures[0]?.id,
    studentData.id
  );

  const attendanceRecords: AttendanceList[] = (attendancesList || []).map(
    (record) => ({
      ...record,
      date: formatYMDFromISO(record.date) ?? record.date,
    })
  );

  const handleDeleteClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAttendanceId) {
      try {
        await deleteAttendance.mutateAsync(selectedAttendanceId);
      } finally {
        setSelectedAttendanceId(null);
        setShowDeleteModal(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setSelectedAttendanceId(null);
    setShowDeleteModal(false);
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
    {
      key: "actions",
      label: " ",
      render: (row: AttendanceList) => (
        <div className="flex justify-end pr-2">
          <button
            type="button"
            onClick={() => handleDeleteClick(row.id)}
            className="p-1 bg-surface-elevated-light hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
            aria-label="출결 기록 삭제"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[760px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]">
          <DialogHeader className="gap-2 border-b border-neutral-100 px-6 pb-5 pt-6 sm:px-8">
            <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-label-normal">
              {studentData.studentName} 학생 출결 상세
            </DialogTitle>
            <DialogDescription className="text-[16px] font-medium leading-6 tracking-[-0.02em] text-neutral-400">
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

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="w-[calc(100vw-28px)] max-w-[424px] gap-0 rounded-[24px] border-0 bg-white px-7 py-7 shadow-[0_0_14px_rgba(138,138,138,0.16)] sm:px-8 sm:py-8">
          <DialogHeader className="items-center gap-2.5 p-0 text-center">
            <DialogTitle className="w-full text-[22px] font-semibold leading-[31px] tracking-[-0.22px] text-label-normal">
              출결 기록 삭제
            </DialogTitle>
            <DialogDescription className="w-full whitespace-pre-line text-[16px] font-medium leading-[24px] tracking-[-0.16px] text-label-alternative">
              해당 출결 기록을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex w-full flex-row justify-center gap-2.5 p-0">
            <Button
              variant="outline"
              className="h-[46px] flex-1 rounded-[10px] border-0 bg-brand-50 px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-brand-700 shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-brand-100"
              onClick={handleCancelDelete}
            >
              취소
            </Button>
            <Button
              variant="default"
              className="h-[46px] flex-1 rounded-[10px] bg-brand-700 px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-brand-800"
              onClick={handleConfirmDelete}
              disabled={deleteAttendance.isPending}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
