"use client";

import { useEffect, useMemo, useState } from "react";

import { useReportPage } from "./useReportPage";

export const useReportSearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningExamName, setWarningExamName] = useState("");

  const {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    loadClasses,
    selectClass,
    selectExam,
    selectStudent,
  } = useReportPage();

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  const filteredClasses = useMemo(
    () =>
      classes.filter((cls) =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [classes, searchTerm]
  );

  const handleExamClick = (
    examId: string,
    examName: string,
    ready: boolean
  ) => {
    if (!ready) {
      setWarningExamName(examName);
      setWarningOpen(true);
      return;
    }

    void selectExam(examId);
  };

  const handleClassClick = (classId: string) => {
    void selectClass(classId);
  };

  const handleStudentClick = (studentId: string) => {
    void selectStudent(studentId);
  };

  return {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    searchTerm,
    setSearchTerm,
    warningOpen,
    setWarningOpen,
    warningExamName,
    filteredClasses,
    handleClassClick,
    handleExamClick,
    handleStudentClick,
  };
};
