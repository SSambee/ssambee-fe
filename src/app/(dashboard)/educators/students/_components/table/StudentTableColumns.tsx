import { Checkbox } from "@/components/ui/checkbox";
import StatusLabel from "@/components/common/label/StatusLabel";
import SelectBtn from "@/components/common/button/SelectBtn";
import {
  APP_INSTALL_LABEL,
  TODAY_ATTENDANCE_LABEL,
  STATUS_SETTING_OPTIONS,
  STUDENT_STATUS_LABEL,
} from "@/constants/students.default";
import { GetEnrollmentList, StudentStatus } from "@/types/students.type";
import { formatYMDFromISO, getTodayYMD } from "@/utils/date";
import { phoneNumberFormatter } from "@/utils/phone";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { ColumnDefinition } from "@/components/common/table/DataTable";

type StudentTableDataProps = {
  selectedStudents: string[];
  onToggleStudent: (student: GetEnrollmentList) => void;
  onNavigate: (enrollmentId: string) => void;
  onStatusChange: (id: string, status: StudentStatus) => void;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
};

export const STUDENT_TABLE_COLUMNS = ({
  selectedStudents,
  onToggleStudent,
  onNavigate,
  onStatusChange,
  isAllSelected,
  onSelectAll,
}: StudentTableDataProps): ColumnDefinition<GetEnrollmentList>[] => [
  {
    key: "select",
    label: (
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={(checked) => onSelectAll(!!checked)}
      />
    ),
    render: (row) => (
      <Checkbox
        className="cursor-pointer"
        checked={selectedStudents.includes(row.id)}
        onCheckedChange={() => onToggleStudent(row)}
      />
    ),
  },
  {
    key: "name",
    label: "학생 프로필",
    render: (row: GetEnrollmentList) => (
      <div className="flex items-center gap-2">
        <StudentProfileAvatar
          seedKey={row.id}
          size={32}
          sizePreset="Medium"
          label={`${row.studentName}의 프로필`}
        />
        <span
          className="font-medium whitespace-nowrap text-base cursor-pointer hover:text-primary hover:underline"
          onClick={() => onNavigate(row.id)}
        >
          {row.studentName || "-"}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "재원 상태",
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
    label: "가입 여부",
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
    label: "수업명",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.lecture?.title || "-"}
      </span>
    ),
  },
  {
    key: "school",
    label: "학교/학년",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.school || "-"} / {row.schoolYear || "-"}
      </span>
    ),
  },
  {
    key: "phoneNumber",
    label: "연락처",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {phoneNumberFormatter(row.studentPhone || "-")}
      </span>
    ),
  },
  {
    key: "registeredAt",
    label: "등록일",
    render: (row: GetEnrollmentList) => (
      <span className="text-base whitespace-nowrap">
        {row.registeredAt ? formatYMDFromISO(row.registeredAt) : "-"}
      </span>
    ),
  },
  {
    key: "attendance",
    label: "출석 현황",
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
    label: "상태 변경",
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
