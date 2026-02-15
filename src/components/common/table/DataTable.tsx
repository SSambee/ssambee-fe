import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 컬럼 정의를 위한 타입
export type ColumnDefinition<T> = {
  key: string;
  label: React.ReactNode;
  render: (row: T) => React.ReactNode;
};

type CommonDataTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowClick?: (record: T) => void;
  emptyMessage?: string;
};

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "기록이 없습니다.",
}: CommonDataTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-x-auto min-h-[60px] bg-white">
      <Table>
        <TableHeader className="whitespace-nowrap h-[45px]">
          <TableRow className="bg-muted/30">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="whitespace-nowrap text-base px-4 font-semibold text-neutral-700"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.length > 0 ? (
            data.map((record) => (
              <TableRow
                key={record.id}
                className={`transition-colors h-[60px] ${
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                }`}
                onClick={(e) => {
                  // 클릭된 요소가 체크박스(input)나 링크(a)라면 행 전체 클릭 이벤트 무시
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") ||
                    target.closest("a") ||
                    target.closest("input")
                  ) {
                    return;
                  }
                  onRowClick?.(record);
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${record.id}-${col.key}`}
                    className="whitespace-nowrap text-base px-4"
                  >
                    {col.render(record)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-20 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
