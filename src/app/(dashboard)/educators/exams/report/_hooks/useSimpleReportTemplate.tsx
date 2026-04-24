"use client";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import type { ReportTemplateExamData } from "@/types/report";
import {
  htmlToReadableText,
  normalizeReportMessageHtml,
} from "@/utils/report-message-html";

import { useSimpleReportTemplateActions } from "./useSimpleReportTemplateActions";
import { useSimpleReportTemplateResources } from "./useSimpleReportTemplateResources";
import { useSimpleReportTemplateState } from "./useSimpleReportTemplateState";
import { useReportPage } from "./useReportPage";

export const useSimpleReportTemplate = (examData: ReportTemplateExamData) => {
  const { commonMessage, isCommonSaved } = useReportPage();
  const { showAlert } = useDialogAlert();

  const state = useSimpleReportTemplateState({
    examData,
    isCommonSaved,
  });

  useSimpleReportTemplateResources({
    examData,
    state,
  });

  const commonMessageHtml = normalizeReportMessageHtml(commonMessage);
  const commonMessageForShare = htmlToReadableText(commonMessageHtml);
  const hasCommonMessage = commonMessageForShare.trim().length > 0;

  const actions = useSimpleReportTemplateActions({
    examData,
    commonMessageForShare,
    state,
    showAlert,
  });

  return {
    isModalOpen: state.isModalOpen,
    setIsModalOpen: state.setIsModalOpen,
    isGeneratingPdf: state.isGeneratingPdf,
    personalMessage: state.personalMessage,
    isStudentSaved: state.isStudentSaved,
    isStudentSaving: state.isStudentSaving,
    isEditing: state.isEditing,
    instructorName: state.instructorName,
    canSendOrDownload: state.canSendOrDownload,
    miniTestRows: state.miniTestRows,
    commonMessageHtml,
    commonMessageForShare,
    hasCommonMessage,
    recipients: actions.recipients,
    handlePersonalMessageChange: actions.handlePersonalMessageChange,
    handleEdit: actions.handleEdit,
    handleSaveStudent: actions.handleSaveStudent,
    handleOpenKakaoModal: actions.handleOpenKakaoModal,
    handleSendReport: actions.handleSendReport,
    handleDownloadPdf: actions.handleDownloadPdf,
  };
};
