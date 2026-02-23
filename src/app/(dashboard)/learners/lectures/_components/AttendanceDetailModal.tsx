"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/ModalProvider";
import { AttendanceList } from "@/types/students.type";
import { formatYMDFromISO } from "@/utils/date";

import AttendanceDetailTable from "./AttendanceDetailTable";

type AttendanceDetailModalProps = {
  studentName: string;
  attendancesList: AttendanceList[];
};

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
        <DialogHeader className="gap-2 border-b border-[#e9ebf0] px-6 pb-5 pt-6 sm:px-8">
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#040405]">
            {studentName} 학생 출결 상세
          </DialogTitle>
          <DialogDescription className="text-[16px] font-medium leading-6 tracking-[-0.02em] text-[rgba(22,22,27,0.4)]">
            최근 출결 현황을 확인하세요. (총 {attendanceRecords.length}건)
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="max-h-[500px] overflow-y-auto rounded-[16px] border border-[#e9ebf0] bg-[#fcfcfd] p-4">
            {attendanceRecords.length > 0 ? (
              <AttendanceDetailTable records={attendanceRecords} />
            ) : (
              <div className="py-8 text-center text-[#8b90a3]">
                출결 기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
