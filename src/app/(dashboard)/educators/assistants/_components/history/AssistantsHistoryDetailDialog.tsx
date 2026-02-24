"use client";

import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AssistantsHistoryPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import StatusLabel from "@/components/common/label/StatusLabel";
import { useAssistantWorkDetail } from "@/hooks/useInstructorPost";
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
  const selectedTaskId = vm.selectedTask?.id ?? "";

  const { data: selectedTaskDetail, isLoading: isAttachmentLoading } =
    useAssistantWorkDetail(selectedTaskId, {
      enabled: Boolean(vm.selectedTask),
    });

  const attachmentNamesFromDetail = (selectedTaskDetail?.attachments ?? [])
    .map((attachment) => attachment.filename?.trim())
    .filter((filename): filename is string => Boolean(filename));

  const attachmentNames =
    vm.selectedTask && vm.selectedTask.attachmentNames.length > 0
      ? vm.selectedTask.attachmentNames
      : attachmentNamesFromDetail;

  return (
    <Dialog
      open={vm.selectedTask !== null}
      onOpenChange={(open) => !open && vm.setSelectedTaskId(null)}
    >
      {vm.selectedTask ? (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">
                  업무 상세 정보
                </DialogTitle>
                <DialogDescription className="mt-1">
                  지시 일자 · {vm.selectedTask.issuedAt}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/40 px-4 py-4 text-sm">
            <div className="mb-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${vm.priorityDetailClassMap[vm.selectedTask.priority]}`}
              >
                {vm.priorityDetailLabelMap[vm.selectedTask.priority]}
              </span>
            </div>
            <p className="text-lg font-bold leading-tight">
              {vm.selectedTask.title}
            </p>
            {vm.selectedTask.subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {vm.selectedTask.subtitle}
              </p>
            ) : null}
          </div>

          <div className="space-y-5 text-sm">
            <div className="grid gap-4 rounded-lg border bg-background px-4 py-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  담당 조교
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {vm.selectedTask.assistantName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  지시 일자
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {vm.selectedTask.issuedAt}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">업무 내용</p>
              <div className="whitespace-pre-wrap rounded-lg border bg-background px-4 py-3 text-sm leading-relaxed">
                {vm.selectedTask.description}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">첨부파일</p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    vm.setSelectedTaskId(null);
                    router.push("/educators/materials");
                  }}
                >
                  학습자료실
                </Button>
              </div>

              <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
                {attachmentNames.length > 0 ? (
                  <ul className="space-y-2">
                    {attachmentNames.map((attachmentName, index) => (
                      <li
                        key={`${index}-${attachmentName}`}
                        className="truncate"
                      >
                        {attachmentName}
                      </li>
                    ))}
                  </ul>
                ) : isAttachmentLoading ? (
                  <p className="text-center">
                    첨부파일 정보를 불러오는 중입니다.
                  </p>
                ) : (
                  <p className="text-center">연결된 첨부파일이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">상태</p>
              <StatusLabel color={vm.statusColorMap[vm.selectedTask.status]}>
                {vm.selectedTask.status}
              </StatusLabel>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
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
