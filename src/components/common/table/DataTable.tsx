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
  label: string;
  render: (row: T) => React.ReactNode;
};

type CommonDataTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowClick?: (record: T) => void;
  emptyMessage?: string;
};

export default function CommonDataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "기록이 없습니다.",
}: CommonDataTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-x-auto min-h-[500px] bg-white">
      <Table>
        <TableHeader>
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
                className={`transition-colors h-[70px] ${
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                }`}
                onClick={() => onRowClick && onRowClick(record)}
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
