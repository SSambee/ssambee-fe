"use client";

import { isAxiosError } from "axios";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

import {
  getGradeReportFileDownloadUrl,
  saveStudentStructuredReport,
  saveStudentReport,
  uploadGradeReportFile,
} from "@/services/exams/report.service";
import { sendKakaoMemo } from "@/services/kakao.service";
import type { ReportTemplateExamData } from "@/types/report";
import { createReportPreviewImageFile } from "@/utils/report-preview-image";
import {
  htmlToReadableText,
  normalizeReportMessageHtml,
} from "@/utils/report-message-html";
import { splitPayloadForSave } from "@/utils/splitPayloadForSave";

import { PremiumReportPdf } from "../_components/PremiumReportPdf";

import type { PremiumReportTemplateState } from "./usePremiumReportTemplateState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;
type ConfirmFn = (payload: {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}) => Promise<boolean>;

const sanitizeFileName = (value: string) =>
  value.replace(/[/\\?%*:|"<>]/g, "_");

const renderPdfBlob = async (element: ReactElement<DocumentProps>) => {
  const { pdf } = await import("@react-pdf/renderer");
  return pdf(element).toBlob();
};

const shouldFallbackToLegacyStudentSave = (error: unknown) => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 404 || status === 405 || status === 501;
};

export const usePremiumReportTemplateActions = ({
  examData,
  commonMessage,
  state,
  showAlert,
  showConfirm,
}: {
  examData: ReportTemplateExamData;
  commonMessage: string;
  state: PremiumReportTemplateState;
  showAlert: AlertFn;
  showConfirm: ConfirmFn;
}) => {
  const commonMessageForShare = htmlToReadableText(
    normalizeReportMessageHtml(commonMessage)
  );

  const buildPdfData = () => ({
    studentName: examData.studentName,
    className: examData.className,
    schoolName: state.schoolName,
    instructorName: state.instructorName,
    examName: examData.examName,
    examDate: examData.examDate,
    examType: state.examType,
    score: examData.score,
    rank: examData.rank,
    totalStudents: examData.totalStudents,
    averageScore: examData.averageScore,
    attendance: state.attendanceRate,
    reviewTest: state.reviewTest,
    homeworkWord: state.homeworkWord,
    homeworkTask: state.homeworkTask,
    homeworkExtra: state.homeworkExtra,
    weaknessType: state.personalMessage,
    message: commonMessageForShare,
  });

  const handleSaveStudent = async () => {
    if (!examData.gradeId) {
      await showAlert({
        title: "저장 불가",
        description: "학생 성적 ID를 찾을 수 없어 저장할 수 없습니다.",
      });
      return;
    }

    if (
      state.includedCategoryRows.length > 0 &&
      state.missingCategoryCount > 0
    ) {
      const shouldProceed = await showConfirm({
        title: "미입력 항목 확인",
        description: `카테고리 ${state.missingCategoryCount}개가 미입력 상태입니다. 현재 학생 최종저장을 진행할까요?`,
        confirmText: "저장 진행",
        cancelText: "계속 입력",
      });

      if (!shouldProceed) {
        return;
      }
    }

    state.setIsStudentSaving(true);

    const formState = {
      examId: examData.examId,
      lectureEnrollmentId: examData.studentId,
      template: "premium" as const,
      message: commonMessage,
      reviewTest: state.reviewTest,
      homeworkWord: state.homeworkWord,
      homeworkTask: state.homeworkTask,
      homeworkExtra: state.homeworkExtra,
      weaknessType: state.personalMessage,
      attendanceRate: state.attendanceRate,
    };

    const { studentPayload } = splitPayloadForSave(formState);

    try {
      try {
        await saveStudentStructuredReport(examData.gradeId, studentPayload);
      } catch (error) {
        if (!shouldFallbackToLegacyStudentSave(error)) {
          throw error;
        }

        console.warn("[report][student-structured-save] fallback to legacy", {
          gradeId: examData.gradeId,
          error,
        });

        await saveStudentReport(examData.gradeId, studentPayload);
      }

      state.setIsStudentSaved(true);
      state.setIsEditing(false);
    } catch (error) {
      console.error("[report][student-save] failed", {
        gradeId: examData.gradeId,
        error,
      });
      await showAlert({
        title: "저장 실패",
        description: "현재 학생 저장 중 오류가 발생했습니다.",
      });
    } finally {
      state.setIsStudentSaving(false);
    }
  };

  const handleEdit = () => {
    state.setIsEditing(true);
    state.setIsStudentSaved(false);
  };

  const handlePersonalMessageChange = (value: string) => {
    state.setPersonalMessage(value);
    state.setIsStudentSaved(false);
  };

  const handleOpenKakaoModal = () => {
    if (!state.canSendOrDownload) {
      void showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용과 현재 학생 최종저장을 먼저 완료해주세요.",
      });
      return;
    }
    state.setIsModalOpen(true);
  };

  const handleSendReport = async () => {
    if (!state.canSendOrDownload || !examData.gradeId) {
      await showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용과 현재 학생 최종저장을 먼저 완료해주세요.",
      });
      return;
    }

    state.setIsGeneratingPdf(true);
    try {
      const blob = await renderPdfBlob(
        <PremiumReportPdf
          data={buildPdfData()}
          categoryRows={state.includedCategoryRows}
          questionResults={state.questionResults}
          scoreHistory={state.scoreHistory}
        />
      );
      const previewImageFile = await createReportPreviewImageFile({
        template: "premium",
        studentName: examData.studentName,
        examName: examData.examName,
        className: examData.className,
        examDate: examData.examDate,
        score: examData.score,
      });
      const imageUploadResult = await uploadGradeReportFile(
        examData.gradeId,
        previewImageFile
      );

      const fileName = `${sanitizeFileName(examData.studentName)}_${sanitizeFileName(
        examData.examName
      )}_프리미엄리포트.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      await uploadGradeReportFile(examData.gradeId, file);
      const { downloadUrl } = await getGradeReportFileDownloadUrl(
        examData.gradeId
      );

      if (!downloadUrl) {
        throw new Error("성적표 다운로드 URL을 가져오지 못했습니다.");
      }

      await sendKakaoMemo({
        title: `${examData.studentName} | ${examData.examName} 성적표`,
        description: `점수: ${examData.score}점 · 석차: ${examData.rank}/${examData.totalStudents}`,
        imageUrl: imageUploadResult.reportUrl ?? undefined,
        webUrl: downloadUrl,
      });

      await showAlert({
        title: "발송 완료",
        description: "카카오톡으로 성적표가 전송되었습니다.",
      });
    } catch (error) {
      console.error("Report send failed:", error);
      await showAlert({
        title: "발송 실패",
        description: "성적표 업로드 및 발송 중 오류가 발생했습니다.",
      });
    } finally {
      state.setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    state.setIsGeneratingPdf(true);
    try {
      const blob = await renderPdfBlob(
        <PremiumReportPdf
          data={buildPdfData()}
          categoryRows={state.includedCategoryRows}
          questionResults={state.questionResults}
          scoreHistory={state.scoreHistory}
        />
      );
      const fileName = `${sanitizeFileName(examData.studentName)}_${sanitizeFileName(
        examData.examName
      )}_프리미엄리포트.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      if (error instanceof Error) {
        await showAlert({
          title: "PDF 생성 실패",
          description: "PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      } else {
        await showAlert({
          title: "PDF 생성 실패",
          description: "PDF 생성에 실패했습니다.",
        });
      }
    } finally {
      state.setIsGeneratingPdf(false);
    }
  };

  const recipients = [
    {
      id: examData.id,
      name: examData.studentName,
      examName: examData.examName,
      score: examData.score,
      className: examData.className,
      phone: examData.phone,
      parentPhone: examData.parentPhone,
    },
  ];

  return {
    recipients,
    handleSaveStudent,
    handleEdit,
    handlePersonalMessageChange,
    handleOpenKakaoModal,
    handleSendReport,
    handleDownloadPdf,
  };
};
