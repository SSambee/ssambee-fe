import { type Assistant, type AssistantsPagination } from "@/types/assistants";
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
    <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-[20px] text-[#8b90a3]">
          <span>
            {statusLabel} 조교 {totalCount}명
          </span>
        </div>

        <div className="mt-4 overflow-x-auto rounded-[20px] border border-[#eaecf2] bg-white">
          <Table className="table-fixed text-[18px]">
            <TableHeader className="bg-[#fcfcfd] [&_tr]:border-b-[#eaecf2]">
              <TableRow>
                <TableHead className="h-14 w-[40%] px-4 text-[18px] font-semibold text-[#8b90a3]">
                  조교명
                </TableHead>
                <TableHead className="h-14 w-[35%] px-4 text-[18px] font-semibold text-[#8b90a3]">
                  연락처
                </TableHead>
                <TableHead className="h-14 w-[25%] px-4 text-[18px] font-semibold text-[#8b90a3]">
                  상태
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assistants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-[18px] font-medium text-[#8b90a3]"
                  >
                    조교가 없습니다.
                  </TableCell>
                </TableRow>
              )}
              {assistants.map((assistant) => (
                <TableRow
                  key={assistant.id}
                  className="border-b-[#eaecf2] hover:bg-[#fcfcfd]"
                >
                  <TableCell className="px-4 py-4">
                    <button
                      type="button"
                      className="font-semibold text-[#3863f6] underline-offset-2 hover:underline"
                      onClick={() => onOpenAssistantDetail(assistant.id)}
                    >
                      {assistant.name}
                    </button>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-[#4a4d5c]">
                    {assistant.phone}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <StatusLabel
                      color={statusColorMap[assistant.status] ?? "gray"}
                      className="px-3.5 py-2 text-[16px]"
                    >
                      {assistant.status}
                    </StatusLabel>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      </CardContent>
    </Card>
  );
}
