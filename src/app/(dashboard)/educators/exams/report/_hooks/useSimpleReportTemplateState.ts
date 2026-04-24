"use client";

import { useMemo, useState } from "react";

import type { ReportTemplateExamData } from "@/types/report";

export type SimpleMiniTestRow = {
  id: string;
  name: string;
  value: string;
};

export const useSimpleReportTemplateState = ({
  examData,
  isCommonSaved,
}: {
  examData: ReportTemplateExamData;
  isCommonSaved: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isStudentSaved, setIsStudentSaved] = useState(false);
  const [isStudentSaving, setIsStudentSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const instructorName = examData.instructorName?.trim() || "담당 강사";
  const canSendOrDownload = isCommonSaved && isStudentSaved;

  const miniTestRows = useMemo<SimpleMiniTestRow[]>(() => {
    return (examData.assignmentResults ?? []).map((assignment) => ({
      id: assignment.id,
      name: `${assignment.categoryName} - ${assignment.title}`,
      value: assignment.value,
    }));
  }, [examData.assignmentResults]);

  return {
    isModalOpen,
    setIsModalOpen,
    isGeneratingPdf,
    setIsGeneratingPdf,
    personalMessage,
    setPersonalMessage,
    isStudentSaved,
    setIsStudentSaved,
    isStudentSaving,
    setIsStudentSaving,
    isEditing,
    setIsEditing,
    instructorName,
    canSendOrDownload,
    miniTestRows,
  };
};

export type SimpleReportTemplateState = ReturnType<
  typeof useSimpleReportTemplateState
>;
