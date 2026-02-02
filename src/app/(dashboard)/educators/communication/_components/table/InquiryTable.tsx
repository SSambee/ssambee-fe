import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InquiryStatus = "answered" | "pending" | "unanswered";
type WriterType = "student" | "educator";
type ShareScope = "학생/학부모" | "강사/교직원";

type Writer = {
  name: string;
  type: WriterType;
};

type Inquiry = {
  id: string;
  date: string;
  status: InquiryStatus;
  title: string;
  content: string;
  writer: Writer;
  responsibleEducator: string;
  comment?: string | null;
  share_scope: ShareScope;
};

const Inquiry_mock: Inquiry[] = [
  {
    id: "1",
    date: "2026-01-01",
    status: "pending",
    title: "문의 제목",
    content: "문의 내용",
    writer: {
      name: "김학생",
      type: "student",
    },
    share_scope: "학생/학부모",
    responsibleEducator: "김강사",
    comment: "문의 답변",
  },
  {
    id: "2",
    date: "2026-01-02",
    status: "answered",
    title: "두쫀쿠 맛있나요?",
    content:
      "두쫀쿠가 그렇게 맛있나요? 엄청 비싸던데.. 그만한 가치가 있는지 궁금합니다.",
    writer: {
      name: "최강사",
      type: "educator",
    },
    share_scope: "강사/교직원",
    responsibleEducator: "이조교",
    comment: "저도 모르겠네요..",
  },
  {
    id: "3",
    date: "2026-01-03",
    status: "answered",
    title: "코딩 꿀팁 알려주세요.",
    content: "코딩 잘하는 꿀팁 있나요?? 알려주세요.",
    writer: {
      name: "박학생",
      type: "student",
    },
    share_scope: "학생/학부모",
    responsibleEducator: "이강사",
    comment: null,
  },
];

const INQUIRY_TABLE_COLUMNS = [
  {
    key: "status",
    label: "답변 상태",
    render: (row: Inquiry) => <span>{row.status}</span>,
  },
  {
    key: "writer",
    label: "작성자",
    render: (row: Inquiry) => <span>{row.writer.name}</span>,
  },
  {
    key: "title",
    label: "제목",
    render: (row: Inquiry) => <span>{row.title}</span>,
  },
  {
    key: "responsibleEducator",
    label: "책임자",
    render: (row: Inquiry) => <span>{row.responsibleEducator}</span>,
  },
  {
    key: "share_scope",
    label: "공개 범위",
    render: (row: Inquiry) => <span>{row.share_scope}</span>,
  },
  {
    key: "date",
    label: "작성일",
    render: (row: Inquiry) => <span>{row.date}</span>,
  },
];

export default function InquiryTable() {
  const router = useRouter();

  const handleRowClick = (inquiryId: string) => {
    router.push(`/educators/communication/${inquiryId}`);
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {INQUIRY_TABLE_COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className="whitespace-nowrap w-[50px] text-sm px-4"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Inquiry_mock.length > 0 ? (
            Inquiry_mock.map((record, index) => (
              <TableRow
                key={`${record.date}-${index}`}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(record.id)}
              >
                {INQUIRY_TABLE_COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    className="whitespace-nowrap text-sm px-4"
                  >
                    {col.render(record)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={INQUIRY_TABLE_COLUMNS.length}
                className="text-center"
              >
                문의 기록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
