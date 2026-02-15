import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import StatusLabel from "@/components/common/label/StatusLabel";
import SelectBtn from "@/components/common/button/SelectBtn";
import {
  APP_INSTALL_LABEL,
  TODAY_ATTENDANCE_LABEL,
  STATUS_SETTING_OPTIONS,
  STUDENT_STATUS_LABEL,
} from "@/constants/students.default";
import noProfileImage from "@/assets/images/no-profile.jpg";
import { GetEnrollmentList, StudentStatus } from "@/types/students.type";
import { formatYMDFromISO, getTodayYMD } from "@/utils/date";
import { phoneNumberFormatter } from "@/utils/phone";

export type StudentTableColumn = {
  key: string;
  render: (row: GetEnrollmentList) => React.ReactNode;
};

export const StudentTableData = ({
  selectedStudents,
  onToggleStudent,
  onNavigate,
  onStatusChange,
}: {
  selectedStudents: string[];
  onToggleStudent: (student: GetEnrollmentList) => void;
  onNavigate: (enrollmentId: string) => void;
  onStatusChange: (id: string, status: StudentStatus) => void;
}): StudentTableColumn[] => [
  {
    key: "select",
    render: (row: GetEnrollmentList) => (
      <Checkbox
        className="cursor-pointer"
        checked={selectedStudents.includes(row.id)}
        onCheckedChange={() => onToggleStudent(row)}
      />
    ),
  },
  {
    key: "profile",
    render: (row: GetEnrollmentList) => (
      <Image
        src={noProfileImage}
        alt={row.studentName}
        width={32}
        height={32}
        className="rounded-full"
      />
    ),
  },
  {
    key: "name",
    render: (row: GetEnrollmentList) => (
      <span
        className="font-medium whitespace-nowrap text-base cursor-pointer hover:text-primary hover:underline"
        onClick={() => onNavigate(row.id)}
      >
        {row.studentName || "-"}
      </span>
    ),
  },
  {
    key: "status",
    render: (row: GetEnrollmentList) => (
      <StatusLabel
        color={
          row.status === "ACTIVE"
            ? "green"
            : row.status === "PAUSED"
              ? "yellow"
              : "red"
        }
      >
        {STUDENT_STATUS_LABEL[row.status as StudentStatus]}
      </StatusLabel>
    ),
  },
  {
    key: "appInstalled",
    render: (row: GetEnrollmentList) => {
      const isInstalled = !!row.appStudentId;
      const config = isInstalled
        ? APP_INSTALL_LABEL.INSTALLED
        : APP_INSTALL_LABEL.NOT_INSTALLED;

      return (
        <StatusLabel color={config.color} showDot noBackground>
          {config.label}
        </StatusLabel>
      );
    },
  },
  {
    key: "class",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.lecture?.title || "-"}
      </span>
    ),
  },
  {
    key: "school",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.school || "-"} / {row.schoolYear || "-"}
      </span>
    ),
  },
  {
    key: "phoneNumber",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {phoneNumberFormatter(row.studentPhone || "-")}
      </span>
    ),
  },
  {
    key: "registeredAt",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.registeredAt ? formatYMDFromISO(row.registeredAt) : "-"}
      </span>
    ),
  },
  {
    key: "attendance",
    render: (row: GetEnrollmentList) => {
      const today = getTodayYMD(); // 예: "2026-02-04"

      // 데이터가 있는지 확인하고 T를 기준으로 자름
      const attendanceDate = row.attendance?.date?.split("T")[0];

      // 오늘 날짜와 비교
      const isAttendedToday = attendanceDate === today;

      const config = isAttendedToday
        ? TODAY_ATTENDANCE_LABEL.ATTENDED
        : TODAY_ATTENDANCE_LABEL.NOT_ATTENDED;

      return <StatusLabel color={config.color}>{config.label}</StatusLabel>;
    },
  },
  {
    key: "statusSelect",
    render: (row: GetEnrollmentList) => (
      <SelectBtn
        className="w-[100px]"
        value={row.status}
        placeholder="상태 선택"
        options={STATUS_SETTING_OPTIONS}
        onChange={(value) => onStatusChange(row.id, value as StudentStatus)}
      />
    ),
  },
];
