"use client";

import { useCallback, useState } from "react";

export const useLearnerLectureDetailPageState = () => {
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);

  const handleSelectExam = useCallback((examId: string) => {
    setSelectedExamIds((prev) =>
      prev.includes(examId)
        ? prev.filter((selectedId) => selectedId !== examId)
        : [...prev, examId]
    );
  }, []);

  const resetSelectedExamIds = useCallback(() => {
    setSelectedExamIds([]);
  }, []);

  return {
    selectedExamIds,
    handleSelectExam,
    resetSelectedExamIds,
  };
};
