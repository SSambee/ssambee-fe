"use client";

import { useEffect, useState } from "react";

import { useDialogAlert } from "@/hooks/useDialogAlert";

import {
  htmlToPlainText,
  plainTextToHtml,
} from "../_utils/report-message-html";

import { useReportPage } from "./useReportPage";

export const useReportCommonMessageSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftMessageHtml, setDraftMessageHtml] = useState("<p></p>");

  const {
    selectedExamId,
    commonMessage,
    isCommonSaved,
    isCommonSaving,
    loadExamCommonMessage,
    saveExamCommonMessage,
  } = useReportPage();
  const { showAlert } = useDialogAlert();

  useEffect(() => {
    if (!selectedExamId) return;
    void loadExamCommonMessage();
  }, [selectedExamId, loadExamCommonMessage]);

  const handleOpenModal = () => {
    if (!selectedExamId) {
      void showAlert({
        title: "시험 선택 필요",
        description: "먼저 시험을 선택해주세요.",
      });
      return;
    }

    setDraftMessageHtml(plainTextToHtml(commonMessage));
    setIsModalOpen(true);
  };

  const handleSaveCommon = async () => {
    if (!selectedExamId) {
      await showAlert({
        title: "시험 선택 필요",
        description: "먼저 시험을 선택해주세요.",
      });
      return;
    }

    try {
      const messageToSave = htmlToPlainText(draftMessageHtml).trim();
      const result = await saveExamCommonMessage(messageToSave);

      if (!result) return;

      if (result.totalCount === 0) {
        await showAlert({
          title: "적용 대상 없음",
          description:
            "적용 가능한 학생이 없습니다. 채점 완료 후 다시 시도해주세요.",
        });
        return;
      }

      if (result.updatedCount !== result.totalCount) {
        await showAlert({
          title: "부분 적용 완료",
          description: `시험 전체 적용이 일부만 완료되었습니다. (${result.updatedCount}/${result.totalCount})`,
        });
        return;
      }

      setIsModalOpen(false);
      await showAlert({
        title: "적용 완료",
        description: "시험 전체 적용이 완료되었습니다.",
      });
    } catch (error) {
      console.error("[report][common-save] failed", {
        examId: selectedExamId,
        error,
      });

      await showAlert({
        title: "적용 실패",
        description: "시험 전체 적용 중 오류가 발생했습니다.",
      });
    }
  };

  return {
    selectedExamId,
    isCommonSaved,
    isCommonSaving,
    isModalOpen,
    setIsModalOpen,
    draftMessageHtml,
    setDraftMessageHtml,
    handleOpenModal,
    handleSaveCommon,
  };
};
