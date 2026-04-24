"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TiptapEditor from "@/components/common/editor/TiptapEditor";

import { useReportCommonMessageSection } from "../_hooks/useReportCommonMessageSection";

export function ReportCommonMessageSection() {
  const {
    selectedExamId,
    isCommonSaved,
    isCommonSaving,
    isModalOpen,
    setIsModalOpen,
    draftMessageHtml,
    setDraftMessageHtml,
    handleOpenModal,
    handleSaveCommon,
  } = useReportCommonMessageSection();

  const handleDraftMessageChange = (html: string) => {
    setDraftMessageHtml(html);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isCommonSaving) return;
    setIsModalOpen(open);
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={handleOpenModal}
        disabled={!selectedExamId}
        className="h-full min-h-16 w-full gap-2 rounded-[20px] border border-[#eaecf2] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] shadow-none hover:bg-[#fcfcfd] hover:text-[#5e6275] disabled:border-[#eaecf2] disabled:bg-white disabled:text-[#9ca3af]"
      >
        <Save className="h-4 w-4" />
        {isCommonSaved ? "시험 공통 전달사항 수정" : "시험 공통 전달사항 작성"}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-xl rounded-[24px] border border-[#eaecf2] p-6 sm:p-7">
          <DialogHeader className="border-b border-[#eaecf2] pb-4">
            <DialogTitle className="text-[22px] font-bold tracking-[-0.22px] text-[#040405]">
              시험 공통 전달사항
            </DialogTitle>
            <DialogDescription className="text-[14px] font-medium text-[#8b90a3]">
              입력한 내용은 현재 선택된 시험의 채점 완료 학생 전체에 적용됩니다.
            </DialogDescription>
          </DialogHeader>
          <TiptapEditor
            content={draftMessageHtml}
            onHtmlChange={handleDraftMessageChange}
            placeholder="시험 공통 전달사항을 입력하세요"
            className="min-h-[220px]"
          />
          <DialogFooter className="border-t border-[#eaecf2] pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCommonSaving}
              className="h-10 rounded-[10px] border-[#d6d9e0] px-4 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            >
              닫기
            </Button>
            <Button
              onClick={handleSaveCommon}
              disabled={isCommonSaving}
              className="h-10 gap-2 rounded-[10px] bg-[#3863f6] px-4 text-[14px] font-semibold text-white hover:bg-[#2f57e8]"
            >
              <Save className="h-4 w-4" />
              {isCommonSaving ? "적용 중..." : "시험 전체 적용"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
