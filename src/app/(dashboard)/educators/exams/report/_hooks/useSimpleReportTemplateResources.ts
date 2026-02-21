"use client";

import { useEffect } from "react";

import { getStudentReport } from "@/services/exams/report.service";
import type { ReportTemplateExamData } from "@/types/report";

import type { SimpleReportTemplateState } from "./useSimpleReportTemplateState";

export const useSimpleReportTemplateResources = ({
  examData,
  state,
}: {
  examData: ReportTemplateExamData;
  state: SimpleReportTemplateState;
}) => {
  const {
    setPersonalMessage,
    setIsStudentSaved,
    setIsEditing,
    setIsModalOpen,
  } = state;

  useEffect(() => {
    let cancelled = false;

    const loadStudentReport = async () => {
      if (!examData.examId || !examData.studentId || !examData.gradeId) {
        setPersonalMessage("");
        setIsStudentSaved(false);
        setIsEditing(false);
        setIsModalOpen(false);
        return;
      }

      setIsStudentSaved(false);
      setIsEditing(false);
      setIsModalOpen(false);

      try {
        const studentReport = await getStudentReport(examData.gradeId);
        if (cancelled) return;

        const loadedPersonalMessage = studentReport.weaknessType ?? "";
        const hasSavedStudentData = Boolean(loadedPersonalMessage.trim());

        setPersonalMessage(loadedPersonalMessage);
        setIsStudentSaved(hasSavedStudentData);
        setIsEditing(!hasSavedStudentData);
      } catch (error) {
        console.error("학생 리포트 로드 실패:", error);
        if (cancelled) return;
        setPersonalMessage("");
        setIsStudentSaved(false);
        setIsEditing(false);
      }
    };

    void loadStudentReport();

    return () => {
      cancelled = true;
    };
  }, [
    examData.examId,
    examData.studentId,
    examData.gradeId,
    setIsEditing,
    setIsModalOpen,
    setIsStudentSaved,
    setPersonalMessage,
  ]);
};
