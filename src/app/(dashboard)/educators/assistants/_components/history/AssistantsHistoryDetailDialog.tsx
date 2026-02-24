"use client";

import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AssistantsHistoryPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AssistantsHistoryDetailDialogProps = {
  vm: AssistantsHistoryPageViewModel;
};

export default function AssistantsHistoryDetailDialog({
  vm,
}: AssistantsHistoryDetailDialogProps) {
  const router = useRouter();
  const selectedTask = vm.selectedTask;
  const attachmentNameCount = new Map<string, number>();

  return (
    <Dialog
      open={selectedTask !== null}
      onOpenChange={(open) => !open && vm.setSelectedTaskId(null)}
    >
      {selectedTask ? (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
          <DialogHeader className="border-b border-[#eaecf2] pb-4 text-left">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#f4f7ff] p-2 text-[#3863f6]">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
                  업무 상세 정보
                </DialogTitle>
                <DialogDescription className="mt-1 text-[#8b90a3]">
                  지시 일자 · {selectedTask.issuedAt}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-[12px] border border-[#eaecf2] bg-[#fcfcfd] px-4 py-4 text-[16px]">
            <div className="mb-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[16px] font-bold ${vm.priorityDetailClassMap[selectedTask.priority]}`}
              >
                {vm.priorityDetailLabelMap[selectedTask.priority]}
              </span>
            </div>
            <p className="text-lg font-bold leading-tight text-[#040405]">
              {selectedTask.title}
            </p>
            {selectedTask.subtitle ? (
              <p className="mt-1 text-[16px] text-[#8b90a3]">
                {selectedTask.subtitle}
              </p>
            ) : null}
          </div>

          <div className="space-y-5 text-[16px]">
            <div className="grid gap-4 rounded-[12px] border border-[#eaecf2] bg-white px-4 py-4 sm:grid-cols-2">
              <div>
                <p className="text-[16px] font-semibold text-[#8b90a3]">
                  담당 조교
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#4a4d5c]">
                  {selectedTask.assistantName}
                </p>
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#8b90a3]">
                  지시 일자
                </p>
                <p className="mt-1 text-[16px] font-semibold text-[#4a4d5c]">
                  {selectedTask.issuedAt}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[16px] font-semibold">업무 내용</p>
              <div className="whitespace-pre-wrap rounded-[12px] border border-[#eaecf2] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#4a4d5c]">
                {selectedTask.description}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-semibold">첨부파일</p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                  onClick={() => {
                    vm.setSelectedTaskId(null);
                    router.push("/educators/materials");
                  }}
                >
                  학습자료실
                </Button>
              </div>

              <div className="rounded-[12px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] px-4 py-4 text-[16px] text-[#8b90a3]">
                {selectedTask.attachmentNames.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTask.attachmentNames.map((attachmentName) => {
                      const count =
                        (attachmentNameCount.get(attachmentName) ?? 0) + 1;
                      attachmentNameCount.set(attachmentName, count);

                      return (
                        <li
                          key={`${selectedTask.id}-${attachmentName}-${count}`}
                          className="truncate"
                        >
                          {attachmentName}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-center">연결된 첨부파일이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[16px] font-semibold">상태</p>
              <StatusLabel color={vm.statusColorMap[selectedTask.status]}>
                {selectedTask.status}
              </StatusLabel>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-[#eaecf2] pt-4">
            <Button
              variant="outline"
              className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              onClick={() => vm.setSelectedTaskId(null)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
