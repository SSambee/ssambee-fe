import { Download, FileUp, SendHorizontal } from "lucide-react";

import {
  type Assistant,
  type ContractRecord,
  type ContractStatus,
} from "@/types/assistants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContractManageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractRecords: ContractRecord[];
  assistantRecords: Assistant[];
  contractStatusClassMap: Record<ContractStatus, string>;
  onOpenContractSend: () => void;
  onPreviewNotice: (message: string) => void;
};

export default function ContractManageModal({
  open,
  onOpenChange,
  contractRecords,
  assistantRecords,
  contractStatusClassMap,
  onOpenContractSend,
  onPreviewNotice,
}: ContractManageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="text-lg font-bold sm:text-xl">
                조교 계약서 관리
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm sm:text-base">
                서명 상태와 계약서 파일을 확인하고 관리합니다.
              </DialogDescription>
            </div>
            <Button className="rounded-full" onClick={onOpenContractSend}>
              <SendHorizontal className="h-4 w-4" />
              계약서 발송
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {contractRecords.map((contract) => {
            const assistant = assistantRecords.find(
              (item) => item.id === contract.assistantId
            );
            if (!assistant) {
              return null;
            }

            return (
              <div
                key={contract.id}
                className="rounded-xl border bg-muted/30 px-6 py-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold tracking-tight sm:text-lg">
                      {assistant.name}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {assistant.subject} · {assistant.className}
                    </p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      업데이트: {contract.updatedAt}
                    </p>
                  </div>

                  <div className="space-y-3 lg:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${contractStatusClassMap[contract.status]}`}
                    >
                      {contract.status}
                    </span>
                    <div>
                      <Button
                        variant="outline"
                        className="rounded-full text-xs sm:text-sm"
                      >
                        <Download className="h-4 w-4" />
                        {contract.fileName}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() =>
              onPreviewNotice("계약서 일괄 다운로드는 UI 미리보기 단계입니다.")
            }
          >
            계약서 일괄 다운로드
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onOpenContractSend}
          >
            <FileUp className="h-4 w-4" />
            계약서 업로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
