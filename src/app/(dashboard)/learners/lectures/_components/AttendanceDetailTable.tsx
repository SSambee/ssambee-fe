"use client";

import { ReactNode } from "react";

import { AttendanceList, AttendanceStatus } from "@/types/students.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type AttendanceTableColumn = {
  key: string;
  label: string;
  render: (row: AttendanceList) => ReactNode;
};

const ATTENDANCE_TABLE_COLUMNS: AttendanceTableColumn[] = [
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
    render: (row: AttendanceList) => (
      <span className="whitespace-nowrap text-sm">
        {row.memo && row.memo.trim() !== "" ? row.memo : "-"}
      </span>
    ),
  },
];

export default function AttendanceDetailTable({
  records,
}: {
  records: AttendanceList[];
}) {
  return (
    <Table className="min-w-[620px]">
      <TableHeader>
        <TableRow className="border-[#e9ebf0] bg-white hover:bg-white">
          {ATTENDANCE_TABLE_COLUMNS.map((col) => (
            <TableHead
              key={col.key}
              className="whitespace-nowrap text-[14px] font-semibold text-[#8b90a3]"
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {records.length > 0 ? (
          records.map((record) => (
            <TableRow
              key={record.date}
              className="border-[#e9ebf0] hover:bg-[#f8f9fc]"
            >
              {ATTENDANCE_TABLE_COLUMNS.map((col) => (
                <TableCell
                  key={col.key}
                  className="whitespace-nowrap text-sm text-[#16161b]/88"
                >
                  {col.render(record)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={ATTENDANCE_TABLE_COLUMNS.length}
              className="text-center text-[#8b90a3]"
            >
              출결 기록이 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
