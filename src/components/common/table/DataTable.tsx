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
  compact?: boolean;
};

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "기록이 없습니다.",
  compact = false,
}: CommonDataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#eaecf2]">
      <Table>
        <TableHeader className="bg-surface-elevated-light">
          <TableRow className="border-[#eaecf2] hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`${compact ? "h-[50px] text-sm" : "h-[66px] text-lg"} font-semibold text-neutral-400 px-6 whitespace-nowrap`}
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
                tabIndex={onRowClick ? 0 : undefined}
                className={`${compact ? "h-[52px]" : "h-[70px]"} border-neutral-100 ${
                  onRowClick
                    ? "cursor-pointer hover:bg-surface-normal-light-alternative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset"
                    : ""
                }`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") ||
                    target.closest("a") ||
                    target.closest("input") ||
                    target.closest('[role="checkbox"]') ||
                    target.closest("[data-radix-select-trigger]") ||
                    target.closest(".prevent-click")
                  ) {
                    return;
                  }
                  onRowClick?.(record);
                }}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onRowClick(record);
                  }
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${record.id}-${col.key}`}
                    className={`${compact ? "text-sm" : "text-lg"} font-medium text-label-normal px-6 whitespace-nowrap ${
                      col.key === "select" || col.key === "statusSelect"
                        ? "prevent-click"
                        : ""
                    }`}
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
                className="text-center py-20 text-neutral-400 px-6 whitespace-nowrap"
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
