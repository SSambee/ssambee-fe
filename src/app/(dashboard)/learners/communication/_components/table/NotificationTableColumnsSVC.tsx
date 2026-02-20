import StatusLabel from "@/components/common/label/StatusLabel";
import { GetInstructorPostsResponse } from "@/types/communication/instructorPost";
import { ColumnDefinition } from "@/components/common/table/DataTable";
import { formatYMDFromISO } from "@/utils/date";
import { NOTICE_TYPE_LABEL } from "@/constants/communication.default";

type NoticeRow = GetInstructorPostsResponse["list"][number];

export const NOTICE_TABLE_COLUMNS_SVC: ColumnDefinition<NoticeRow>[] = [
  {
    key: "scope",
    label: "분류",
    render: (row) => (
      <div className="w-[50px] flex items-center">
        <StatusLabel color={row.isImportant ? "blue" : "green"}>
          {row.isImportant ? "공지" : "자료"}
        </StatusLabel>
      </div>
    ),
  },
  {
    key: "title",
    label: "제목",
    render: (row) => {
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
    key: "lectureId",
    label: "클래스",
    render: (row) => {
      return (
        <span className="text-sm">
          {row.scope === "LECTURE" ? row.lectureTitle : "미지정"}
        </span>
      );
    },
  },
  {
    key: "authorRole",
    label: "열람 권한",
    render: (row) => {
      const info =
        NOTICE_TYPE_LABEL[row.targetRole as keyof typeof NOTICE_TYPE_LABEL] ??
        NOTICE_TYPE_LABEL.ALL;

      return (
        <div className="w-[50px] flex items-center">
          <StatusLabel noBackground color={info.color}>
            {info.label}
          </StatusLabel>
        </div>
      );
    },
  },
  {
    key: "instructor",
    label: "작성자",
    render: (row) => {
      // 조교 ID가 있고, 조교 객체 정보가 있는 경우 -> 조교 이름 출력
      if (row.authorAssistantId && row.authorAssistant) {
        return (
          <span className="flex items-center gap-1">
            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded mr-1">
              조교
            </span>
            {row.authorAssistant.user?.name || "조교"}
          </span>
        );
      }

      // 그 외 기본값 -> 강사 이름 출력
      return (
        <span className="flex items-center gap-1">
          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded mr-1">
            강사
          </span>
          {row.instructor?.user?.name || "관리자"}
        </span>
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
];
