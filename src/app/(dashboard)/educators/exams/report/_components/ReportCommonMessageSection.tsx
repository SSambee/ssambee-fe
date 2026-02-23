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
        onClick={handleOpenModal}
        disabled={!selectedExamId}
        className="w-full gap-2"
      >
        <Save className="h-4 w-4" />
        {isCommonSaved ? "시험 공통 전달사항 수정" : "시험 공통 전달사항 작성"}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>시험 공통 전달사항</DialogTitle>
            <DialogDescription>
              입력한 내용은 현재 선택된 시험의 채점 완료 학생 전체에 적용됩니다.
            </DialogDescription>
          </DialogHeader>
          <TiptapEditor
            content={draftMessageHtml}
            onHtmlChange={handleDraftMessageChange}
            placeholder="시험 공통 전달사항을 입력하세요"
            className="min-h-[220px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCommonSaving}
            >
              닫기
            </Button>
            <Button
              onClick={handleSaveCommon}
              disabled={isCommonSaving}
              className="gap-2"
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
