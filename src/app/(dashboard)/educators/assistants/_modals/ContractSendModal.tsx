import { FileText, FileUp, Mail } from "lucide-react";

import type { Assistant } from "@/types/assistants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContractSendModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistantRecords: Assistant[];
  sendTargetId: string;
  onChangeSendTargetId: (assistantId: string) => void;
  selectedTargetAssistant: Assistant | undefined;
  sendTemplate: string;
  contractTemplateOptions: readonly string[];
  onChangeSendTemplate: (template: string) => void;
  uploadFileName: string;
  onChangeUploadFileName: (fileName: string) => void;
  onOpenContractManage: () => void;
  onPreviewNotice: (message: string) => void;
};

export default function ContractSendModal({
  open,
  onOpenChange,
  assistantRecords,
  sendTargetId,
  onChangeSendTargetId,
  selectedTargetAssistant,
  sendTemplate,
  contractTemplateOptions,
  onChangeSendTemplate,
  uploadFileName,
  onChangeUploadFileName,
  onOpenContractManage,
  onPreviewNotice,
}: ContractSendModalProps) {
  const sendTargetFieldId = "contract-send-target";
  const sendTemplateFieldId = "contract-send-template";
  const receiverEmailFieldId = "contract-send-receiver-email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold">
                조교 계약서 발송
              </DialogTitle>
              <DialogDescription className="mt-1 text-base">
                서명 상태와 계약서 파일을 확인하고 발송합니다.
              </DialogDescription>
            </div>
            <Button className="rounded-full" onClick={onOpenContractManage}>
              <FileText className="h-4 w-4" />
              계약서 관리
            </Button>
          </div>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          선택한 조교의 이메일로 계약서 양식을 발송합니다. 서명 완료 시 자동
          저장되며, 전송 로그가 기록됩니다.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={sendTargetFieldId}
              className="text-sm font-semibold"
            >
              계약서 발송 대상
            </label>
            <Select value={sendTargetId} onValueChange={onChangeSendTargetId}>
              <SelectTrigger id={sendTargetFieldId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assistantRecords.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name} · {assistant.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor={receiverEmailFieldId}
              className="text-sm font-semibold"
            >
              수신 이메일
            </label>
            <Input
              id={receiverEmailFieldId}
              value={selectedTargetAssistant?.email ?? ""}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={sendTemplateFieldId}
              className="text-sm font-semibold"
            >
              발송 양식
            </label>
            <Select value={sendTemplate} onValueChange={onChangeSendTemplate}>
              <SelectTrigger id={sendTemplateFieldId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contractTemplateOptions.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">계약서 템플릿 업로드</p>
            <label
              htmlFor="contract-template-file"
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
            >
              <FileUp className="h-4 w-4" />
              <span>{uploadFileName}</span>
            </label>
            <Input
              id="contract-template-file"
              type="file"
              className="hidden"
              onChange={(event) =>
                onChangeUploadFileName(
                  event.target.files?.[0]?.name ?? "선택된 파일 없음"
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              PDF 또는 DOC/DOCX 업로드 가능
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-muted-foreground/35 bg-muted/30 px-5 py-4">
          <p className="text-sm font-semibold">이메일 미리보기</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            안녕하세요 {selectedTargetAssistant?.name}님,
            <br />
            {sendTemplate} 파일을 확인하시고 3일 이내에 서명 부탁드립니다. 서명
            완료 시 자동으로 시스템에 반영됩니다.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onOpenContractManage}
          >
            취소
          </Button>
          <Button
            className="rounded-full"
            onClick={() => {
              onPreviewNotice("계약서 발송은 UI 미리보기 단계입니다.");
              onOpenContractManage();
            }}
          >
            <Mail className="h-4 w-4" />
            계약서 발송
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
