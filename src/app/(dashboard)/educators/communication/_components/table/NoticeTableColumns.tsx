import StatusLabel from "@/components/common/label/StatusLabel";
import { InstructorWriteContents } from "@/types/communication.type";
import {
  CONTENT_TYPE_LABEL,
  NOTICE_TYPE_LABEL,
} from "@/constants/communication.default";
import { ColumnDefinition } from "@/components/common/table/DataTable";

export const INSTRUCTOR_POST_COLUMNS: ColumnDefinition<InstructorWriteContents>[] =
  [
    {
      key: "contentsType",
      label: "분류",
      render: (row) => (
        <div className="w-[50px] flex items-center">
          <StatusLabel color={CONTENT_TYPE_LABEL[row.contentsType].color}>
            {CONTENT_TYPE_LABEL[row.contentsType].label}
          </StatusLabel>
        </div>
      ),
    },
    {
      key: "title",
      label: "제목",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="max-w-[350px] truncate font-medium">
            {row.title}
          </span>
          {row.answers && row.answers.length > 0 && (
            <span className="text-blue-700 text-xs font-bold">
              [{row.answers.length}]
            </span>
          )}
        </div>
      ),
    },
    {
      key: "className",
      label: "클래스",
      render: (row) => (
        <span className="text-sm">
          {row.classId === null ? "전체 클래스" : row.className || "-"}
        </span>
      ),
    },
    {
      key: "readPermission",
      label: "열람 권한",
      render: (row) => {
        return (
          <span className="text-sm">
            {NOTICE_TYPE_LABEL[row.readPermission].label}
          </span>
        );
      },
    },
    {
      key: "name",
      label: "작성자",
      render: (row) => <span>{row.name}</span>,
    },
    {
      key: "date",
      label: "작성일",
      render: (row) => <span>{row.date}</span>,
    },
  ];
