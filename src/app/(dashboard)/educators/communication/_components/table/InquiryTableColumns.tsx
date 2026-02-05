import StatusLabel from "@/components/common/label/StatusLabel";
import { LearnersWriteInquiry } from "@/types/communication.type";
import { INQUIRY_STATUS_LABEL } from "@/constants/communication.default";

export const INQUIRY_TABLE_COLUMNS = [
  {
    key: "status",
    label: "상태",
    render: (row: LearnersWriteInquiry) => (
      <div className="w-[50px] flex items-center">
        <StatusLabel color={INQUIRY_STATUS_LABEL[row.status].color}>
          {INQUIRY_STATUS_LABEL[row.status].label}
        </StatusLabel>
      </div>
    ),
  },
  {
    key: "title",
    label: "제목",
    render: (row: LearnersWriteInquiry) => (
      <div className="flex items-center gap-2">
        <span className="max-w-[350px] truncate font-medium">{row.title}</span>
        {row.answers && row.answers.length > 0 && (
          <span className="text-blue-700 text-xs font-bold">
            [{row.answers.length}]
          </span>
        )}
      </div>
    ),
  },
  {
    key: "writer",
    label: "작성자",
    render: (row: LearnersWriteInquiry) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.writer.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.writer.type === "STUDENT" ? "학생" : "학부모"}
        </span>
      </div>
    ),
  },
  {
    key: "date",
    label: "작성일",
    render: (row: LearnersWriteInquiry) => <span>{row.date}</span>,
  },
];
