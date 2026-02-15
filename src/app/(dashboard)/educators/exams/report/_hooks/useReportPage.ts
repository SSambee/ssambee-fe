"use client";

import { useReportStore } from "@/stores/report.store";

export const useReportPage = () => {
  const {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    selectedTemplate,
    commonMessage,
    isCommonSaved,
    commonSaveResult,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    isCommonSaving,
    loadClasses,
    loadExamCommonMessage,
    selectClass,
    selectExam,
    selectStudent,
    selectTemplate,
    setCommonMessage,
    saveExamCommonMessage,
    getSelectedStudent,
    clearSelection,
  } = useReportStore();

  return {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    selectedTemplate,
    commonMessage,
    isCommonSaved,
    commonSaveResult,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    isCommonSaving,
    loadClasses,
    loadExamCommonMessage,
    selectClass,
    selectExam,
    selectStudent,
    selectTemplate,
    setCommonMessage,
    saveExamCommonMessage,
    getSelectedStudent,
    clearSelection,
  };
};
