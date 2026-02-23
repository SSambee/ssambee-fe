"use client";

import { useReportStore } from "@/stores/report.store";

export const useReportPage = () => {
  const classes = useReportStore((state) => state.classes);
  const exams = useReportStore((state) => state.exams);
  const students = useReportStore((state) => state.students);
  const selectedClassId = useReportStore((state) => state.selectedClassId);
  const selectedExamId = useReportStore((state) => state.selectedExamId);
  const selectedStudentId = useReportStore((state) => state.selectedStudentId);
  const selectedTemplate = useReportStore((state) => state.selectedTemplate);
  const commonMessage = useReportStore((state) => state.commonMessage);
  const isCommonSaved = useReportStore((state) => state.isCommonSaved);
  const commonSaveResult = useReportStore((state) => state.commonSaveResult);
  const isLoadingClasses = useReportStore((state) => state.isLoadingClasses);
  const isLoadingExams = useReportStore((state) => state.isLoadingExams);
  const isLoadingStudents = useReportStore((state) => state.isLoadingStudents);
  const isCommonSaving = useReportStore((state) => state.isCommonSaving);
  const loadClasses = useReportStore((state) => state.loadClasses);
  const loadExamCommonMessage = useReportStore(
    (state) => state.loadExamCommonMessage
  );
  const selectClass = useReportStore((state) => state.selectClass);
  const selectExam = useReportStore((state) => state.selectExam);
  const selectStudent = useReportStore((state) => state.selectStudent);
  const selectTemplate = useReportStore((state) => state.selectTemplate);
  const setCommonMessage = useReportStore((state) => state.setCommonMessage);
  const saveExamCommonMessage = useReportStore(
    (state) => state.saveExamCommonMessage
  );
  const getSelectedStudent = useReportStore(
    (state) => state.getSelectedStudent
  );
  const clearSelection = useReportStore((state) => state.clearSelection);

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
