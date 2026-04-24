import StatusLabel from "@/components/common/label/StatusLabel";
import { INQUIRY_STATUS_LABEL } from "@/constants/communication.default";
import { GetStudentPostsResponse } from "@/types/communication/studentPost";
import { formatYMDFromISO } from "@/utils/date";
import { ColumnDefinition } from "@/components/common/table/DataTable";

type InquiryRow = GetStudentPostsResponse["list"][number];

export const INQUIRY_TABLE_COLUMNS_SVC: ColumnDefinition<InquiryRow>[] = [
  {
    key: "title",
    label: "제목",
    render: (row: InquiryRow) => {
      const commentCount = row._count.comments;
      return (
        <div className="flex items-center gap-2">
          <span className="max-w-[350px] truncate font-medium">
            {row.title}
          </span>
          {!!commentCount && commentCount > 0 && (
            <span className="text-blue-700 text-xs font-bold">
              [{commentCount}]
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    label: "상태",
    render: (row: InquiryRow) => {
      const statusKey = row.status as keyof typeof INQUIRY_STATUS_LABEL;
      const statusInfo = INQUIRY_STATUS_LABEL[statusKey] ?? {
        color: "gray",
        label: row.status,
      };

      return (
        <div className="w-[50px] flex items-center">
          <StatusLabel showDot color={statusInfo.color}>
            {statusInfo.label}
          </StatusLabel>{" "}
        </div>
      );
    },
  },
  {
    key: "author",
    label: "작성자",
    render: (row: InquiryRow) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.enrollment.studentName}</span>
          <span className="text-xs text-muted-foreground">
            {row.authorRole === "STUDENT" ? "학생" : "학부모"}
          </span>
        </div>
      );
    },
  },
  {
    key: "createdAt",
    label: "작성일",
    render: (row: InquiryRow) => {
      return <span>{formatYMDFromISO(row.createdAt)}</span>;
    },
  },
];
