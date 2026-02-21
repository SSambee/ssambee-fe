"use client";

import { isAxiosError } from "axios";
import { pdf } from "@react-pdf/renderer";

import {
  getGradeReportFileDownloadUrl,
  saveStudentStructuredReport,
  saveStudentReport,
  uploadGradeReportFile,
} from "@/services/exams/report.service";
import type { ReportTemplateExamData } from "@/types/report";

import { SimpleReportPdf } from "../_components/SimpleReportPdf";

import type { SimpleReportTemplateState } from "./useSimpleReportTemplateState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;

const sanitizeFileName = (value: string) =>
  value.replace(/[/\\?%*:|"<>]/g, "_");

const shouldFallbackToLegacyStudentSave = (error: unknown) => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 404 || status === 405 || status === 501;
};

export const useSimpleReportTemplateActions = ({
  examData,
  commonMessageForShare,
  state,
  showAlert,
}: {
  examData: ReportTemplateExamData;
  commonMessageForShare: string;
  state: SimpleReportTemplateState;
  showAlert: AlertFn;
}) => {
  const buildPdfData = () => ({
    studentName: examData.studentName,
    examName: examData.examName,
    className: examData.className,
    instructorName: state.instructorName,
    examDate: examData.examDate,
    score: examData.score,
    averageScore: examData.averageScore,
    rank: examData.rank,
    totalStudents: examData.totalStudents,
    attendance: examData.attendance,
    message: commonMessageForShare,
    personalMessage: state.personalMessage,
    miniTestRows: state.miniTestRows,
  });

  const handlePersonalMessageChange = (value: string) => {
    state.setPersonalMessage(value);
    state.setIsStudentSaved(false);
  };

  const handleEdit = () => {
    state.setIsEditing(true);
    state.setIsStudentSaved(false);
  };

  const handleSaveStudent = async () => {
    if (!examData.gradeId) {
      await showAlert({
        title: "저장 불가",
        description: "학생 성적 ID를 찾을 수 없어 저장할 수 없습니다.",
      });
      return;
    }

    state.setIsStudentSaving(true);

    const studentPayload = {
      template: "simple" as const,
      reviewTest: "",
      homeworkWord: "",
      homeworkTask: "",
      homeworkExtra: "",
      weaknessType: state.personalMessage,
      attendanceRate: "",
    };

    try {
      try {
        await saveStudentStructuredReport(examData.gradeId, studentPayload);
      } catch (error) {
        if (!shouldFallbackToLegacyStudentSave(error)) {
          throw error;
        }

        await saveStudentReport(examData.gradeId, studentPayload);
      }

      state.setIsStudentSaved(true);
      state.setIsEditing(false);
    } catch (error) {
      console.error("[report][simple-student-save] failed", {
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

  const handleOpenKakaoModal = () => {
    if (!state.canSendOrDownload) {
      void showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용과 현재 학생 저장을 먼저 완료해주세요.",
      });
      return;
    }
    state.setIsModalOpen(true);
  };

  const handleSendReport = async () => {
    if (!state.canSendOrDownload || !examData.gradeId) {
      await showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용과 현재 학생 저장을 먼저 완료해주세요.",
      });
      return;
    }

    state.setIsGeneratingPdf(true);
    try {
      const blob = await pdf(
        <SimpleReportPdf data={buildPdfData()} />
      ).toBlob();

      const fileName = `${sanitizeFileName(examData.studentName)}_${sanitizeFileName(
        examData.examName
      )}_심플리포트.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      await uploadGradeReportFile(examData.gradeId, file);

      const { downloadUrl } = await getGradeReportFileDownloadUrl(
        examData.gradeId
      );

      if (!downloadUrl) {
        throw new Error("성적표 다운로드 URL을 가져오지 못했습니다.");
      }

      await showAlert({
        title: "발송 준비 완료",
        description:
          "성적표 파일 업로드가 완료되었습니다. 카카오톡 발송 기능은 현재 연동 준비 중입니다.",
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
    if (!state.canSendOrDownload) {
      await showAlert({
        title: "다운로드 전 확인",
        description: "시험 전체 적용과 현재 학생 저장을 먼저 완료해주세요.",
      });
      return;
    }

    state.setIsGeneratingPdf(true);
    try {
      const blob = await pdf(
        <SimpleReportPdf data={buildPdfData()} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(examData.studentName)}_${sanitizeFileName(
        examData.examName
      )}_심플리포트.pdf`;
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
    handlePersonalMessageChange,
    handleEdit,
    handleSaveStudent,
    handleOpenKakaoModal,
    handleSendReport,
    handleDownloadPdf,
  };
};
