import StatusLabel from "@/components/common/label/StatusLabel";
import { GetAssistantWorksResponse } from "@/types/communication/instructorPost";
import { ColumnDefinition } from "@/components/common/table/DataTable";
import { formatYMDFromISO } from "@/utils/date";
import {
  PRIORITY_LABEL,
  WORK_STATUS_LABEL,
} from "@/constants/communication.default";

type AssistantWorkRow = GetAssistantWorksResponse["orders"][number];

export const ASSISTANT_WORKS_COLUMNS: ColumnDefinition<AssistantWorkRow>[] = [
  {
    key: "title",
    label: "제목",
    render: (row) => {
      return (
        <span className="max-w-[300px] truncate font-medium">{row.title}</span>
      );
    },
  },
  {
    key: "memo",
    label: "내용",
    render: (row) => {
      return (
        <span className="block w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {row.memo || "-"}
        </span>
      );
    },
  },
  {
    key: "workStatus",
    label: "상태",
    render: (row) => {
      const statusInfo =
        WORK_STATUS_LABEL[row.workStatus as keyof typeof WORK_STATUS_LABEL] ??
        WORK_STATUS_LABEL.PENDING;
      return (
        <div className="w-[60px] flex items-center">
          <StatusLabel color={statusInfo.color}>{statusInfo.label}</StatusLabel>
        </div>
      );
    },
  },
  {
    key: "priority",
    label: "중요도",
    render: (row) => {
      const priorityInfo =
        PRIORITY_LABEL[row.priority as keyof typeof PRIORITY_LABEL] ??
        PRIORITY_LABEL.NORMAL;

      return (
        <div className="w-[60px] flex items-center">
          <StatusLabel noBackground color={priorityInfo.color}>
            {priorityInfo.label}
          </StatusLabel>
        </div>
      );
    },
  },
  {
    key: "createdAt",
    label: "작성일",
    render: (row) => {
      return <span>{formatYMDFromISO(row.createdAt)}</span>;
    },
  },
  {
    key: "deadlineAt",
    label: "마감일",
    render: (row) => {
      return (
        <span>{row.deadlineAt ? formatYMDFromISO(row.deadlineAt) : "-"}</span>
      );
    },
  },
  {
    key: "instructorName",
    label: "지시자",
    render: (row) => {
      return (
        <span className="flex items-center gap-1">
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded mr-1">
            강사
          </span>
          {row.instructorName}
        </span>
      );
    },
  },
];
