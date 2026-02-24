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
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
        <DialogHeader className="border-b border-[#eaecf2] pb-4 text-left">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
                조교 계약서 관리
              </DialogTitle>
              <DialogDescription className="mt-1 text-[16px] text-[#8b90a3] sm:text-base">
                서명 상태와 계약서 파일을 확인하고 관리합니다.
              </DialogDescription>
            </div>
            <Button
              className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-white hover:bg-[#2f57e8]"
              onClick={onOpenContractSend}
            >
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
                className="rounded-[20px] border border-[#eaecf2] bg-[#fcfcfd] px-6 py-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold tracking-tight sm:text-lg">
                      {assistant.name}
                    </p>
                    <p className="text-[16px] font-medium text-[#8b90a3]">
                      {assistant.subject} · {assistant.className}
                    </p>
                    <p className="text-[16px] text-[#8b90a3]">
                      업데이트: {contract.updatedAt}
                    </p>
                  </div>

                  <div className="space-y-3 lg:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[16px] font-semibold ${contractStatusClassMap[contract.status]}`}
                    >
                      {contract.status}
                    </span>
                    <div>
                      <Button
                        variant="outline"
                        className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                        onClick={() =>
                          onPreviewNotice(
                            `${contract.fileName} 다운로드는 UI 미리보기 단계입니다.`
                          )
                        }
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

        <DialogFooter className="gap-2 border-t border-[#eaecf2] pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            onClick={() =>
              onPreviewNotice("계약서 일괄 다운로드는 UI 미리보기 단계입니다.")
            }
          >
            계약서 일괄 다운로드
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
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
