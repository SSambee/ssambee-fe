import type { ColumnDefinition } from "@/components/common/table/DataTable";
import type { Lecture } from "@/types/profile.type";

export const lectureColumns: ColumnDefinition<Lecture>[] = [
  {
    key: "name",
    label: "강의명",
    render: (lecture) => <span className="font-medium">{lecture.name}</span>,
  },
  {
    key: "target",
    label: "대상",
    render: (lecture) => <span>{lecture.target}</span>,
  },
  {
    key: "studentCount",
    label: "인원",
    render: (lecture) => <span>{lecture.studentCount}명</span>,
  },
];
