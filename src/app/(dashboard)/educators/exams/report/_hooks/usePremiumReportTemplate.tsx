"use client";

import { useDialogAlert } from "@/hooks/useDialogAlert";

import type { ReportTemplateExamData } from "../_types/report-template";

import { usePremiumReportTemplateActions } from "./usePremiumReportTemplateActions";
import { usePremiumReportTemplateResources } from "./usePremiumReportTemplateResources";
import { usePremiumReportTemplateState } from "./usePremiumReportTemplateState";
import { useReportPage } from "./useReportPage";

export const usePremiumReportTemplate = (examData: ReportTemplateExamData) => {
  const { commonMessage, isCommonSaved } = useReportPage();
  const { showAlert, showConfirm } = useDialogAlert();

  const state = usePremiumReportTemplateState({
    examData,
    isCommonSaved,
  });

  usePremiumReportTemplateResources({
    examData,
    state,
  });

  const actions = usePremiumReportTemplateActions({
    examData,
    commonMessage,
    state,
    showAlert,
    showConfirm,
  });

  return {
    scoreHistory: state.scoreHistory,
    isScoreHistoryLoading: state.isScoreHistoryLoading,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    reviewTest: state.reviewTest,
    personalMessage: state.personalMessage,
    homeworkWord: state.homeworkWord,
    homeworkTask: state.homeworkTask,
    homeworkExtra: state.homeworkExtra,
    isStudentSaved: state.isStudentSaved,
    isStudentSaving: state.isStudentSaving,
    isEditing: state.isEditing,
    isModalOpen: state.isModalOpen,
    setIsModalOpen: state.setIsModalOpen,
    isGeneratingPdf: state.isGeneratingPdf,
    commonMessage,
    isCommonSaved,
    attendanceRate: state.attendanceRate,
    questionResults: state.questionResults,
    canSendOrDownload: state.canSendOrDownload,
    includedCategoryRows: state.includedCategoryRows,
    includedCategoryNames: state.includedCategoryNames,
    missingCategoryCount: state.missingCategoryCount,
    schoolName: state.schoolName,
    instructorName: state.instructorName,
    examType: state.examType,
    singlePointOnly: state.singlePointOnly,
    totalPages: state.totalPages,
    recipients: actions.recipients,
    handleSaveStudent: actions.handleSaveStudent,
    handleEdit: actions.handleEdit,
    handlePersonalMessageChange: actions.handlePersonalMessageChange,
    handleOpenKakaoModal: actions.handleOpenKakaoModal,
    handleSendReport: actions.handleSendReport,
    handleDownloadPdf: actions.handleDownloadPdf,
  };
};
