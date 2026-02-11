import {
  type Assistant,
  type AssistantsPagination,
} from "@/app/(dashboard)/educators/assistants/_types/assistants";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Pagination } from "@/components/common/pagination/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AssistantsTableProps = {
  statusLabel: string;
  totalCount: number;
  assistants: Assistant[];
  statusColorMap: Record<Assistant["status"], "green" | "yellow" | "gray">;
  pagination: AssistantsPagination;
  onOpenAssistantDetail: (assistantId: string) => void;
  onPageChange: (page: number) => void;
};

export default function AssistantsTable({
  statusLabel,
  totalCount,
  assistants,
  statusColorMap,
  pagination,
  onOpenAssistantDetail,
  onPageChange,
}: AssistantsTableProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {statusLabel} 조교 {totalCount}명
          </span>
        </div>

        <div className="mt-4 rounded-lg border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] px-4">조교명</TableHead>
                <TableHead className="w-[35%] px-4">연락처</TableHead>
                <TableHead className="w-[25%] px-4">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assistants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-muted-foreground"
                  >
                    조교가 없습니다.
                  </TableCell>
                </TableRow>
              )}
              {assistants.map((assistant) => (
                <TableRow key={assistant.id}>
                  <TableCell className="px-4">
                    <button
                      type="button"
                      className="font-medium text-primary underline-offset-2 hover:underline"
                      onClick={() => onOpenAssistantDetail(assistant.id)}
                    >
                      {assistant.name}
                    </button>
                  </TableCell>
                  <TableCell className="px-4 text-foreground/90">
                    {assistant.phone}
                  </TableCell>
                  <TableCell className="px-4">
                    <StatusLabel
                      color={statusColorMap[assistant.status] ?? "gray"}
                    >
                      {assistant.status}
                    </StatusLabel>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination pagination={pagination} onPageChange={onPageChange} />
      </CardContent>
    </Card>
  );
}
