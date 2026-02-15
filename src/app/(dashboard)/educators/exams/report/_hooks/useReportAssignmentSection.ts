"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import {
  defaultReportCategoryStorageConfig,
  readReportCategoryStorageConfig,
  saveReportStudentSelections,
  subscribeReportCategoryStorageConfig,
} from "@/services/exams/report-category-persistence.service";
import { useDialogAlert } from "@/hooks/useDialogAlert";

import { useReportPage } from "./useReportPage";

export const useReportAssignmentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftSelections, setDraftSelections] = useState<
    Record<string, string>
  >({});

  const { selectedExamId, selectedStudentId, getSelectedStudent } =
    useReportPage();
  const { showAlert, showConfirm } = useDialogAlert();

  const storage = useSyncExternalStore(
    subscribeReportCategoryStorageConfig,
    readReportCategoryStorageConfig,
    () => defaultReportCategoryStorageConfig
  );

  const selectedStudent = getSelectedStudent();
  const backendAssignmentRows = selectedStudent?.assignmentResults ?? [];

  const includedCategories = useMemo(() => {
    const includedCategoryIds =
      selectedExamId && storage.examCategoryMap[selectedExamId]
        ? storage.examCategoryMap[selectedExamId]
        : [];

    return storage.categories.filter((category) =>
      includedCategoryIds.includes(category.id)
    );
  }, [selectedExamId, storage.categories, storage.examCategoryMap]);

  const selectedValues =
    selectedExamId && selectedStudentId
      ? (storage.studentSelections[selectedExamId]?.[selectedStudentId] ?? {})
      : {};

  const selectedCount = includedCategories.filter(
    (category) => typeof selectedValues[category.id] === "string"
  ).length;
  const backendSelectedCount = backendAssignmentRows.filter(
    (row) => row.value.trim() && row.value !== "-"
  ).length;
  const includedCategoryNames =
    backendAssignmentRows.length > 0
      ? backendAssignmentRows.map((row) => `${row.categoryName} - ${row.title}`)
      : includedCategories.map((category) => category.name);

  const isInputReady =
    Boolean(selectedExamId && selectedStudentId) &&
    (includedCategories.length > 0 || backendAssignmentRows.length > 0);
  const hasSavedSelection =
    isInputReady && (selectedCount > 0 || backendSelectedCount > 0);

  const draftSelectedCount = includedCategories.filter(
    (category) => typeof draftSelections[category.id] === "string"
  ).length;
  const draftMissingCount = Math.max(
    includedCategories.length - draftSelectedCount,
    0
  );

  const draftSelectionKey = includedCategories
    .map((category) => `${category.id}:${draftSelections[category.id] ?? ""}`)
    .join("|");
  const savedSelectionKey = includedCategories
    .map((category) => `${category.id}:${selectedValues[category.id] ?? ""}`)
    .join("|");
  const draftDirty = draftSelectionKey !== savedSelectionKey;

  const handleOpenModal = () => {
    if (!selectedExamId) {
      void showAlert({
        title: "시험 선택 필요",
        description: "먼저 시험을 선택해주세요.",
      });
      return;
    }

    setDraftSelections(selectedValues);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = async (nextOpen: boolean) => {
    if (nextOpen) {
      setIsModalOpen(true);
      return;
    }

    if (draftDirty) {
      const shouldClose = await showConfirm({
        title: "미저장 변경사항",
        description:
          "저장하지 않은 과제/카테고리 변경사항이 있습니다. 닫으시겠습니까?",
        confirmText: "닫기",
        cancelText: "계속 입력",
      });

      if (!shouldClose) {
        return;
      }
    }

    setIsModalOpen(false);
  };

  const handleSelectPreset = (categoryId: string, preset: string) => {
    if (!selectedExamId || !selectedStudentId) return;

    setDraftSelections((prev) => ({
      ...prev,
      [categoryId]: preset,
    }));
  };

  const handleSaveDraft = () => {
    if (!selectedExamId || !selectedStudentId) return;

    saveReportStudentSelections({
      examId: selectedExamId,
      studentId: selectedStudentId,
      selections: draftSelections,
    });
    setIsModalOpen(false);
  };

  return {
    selectedExamId,
    selectedStudentId,
    selectedStudent,
    includedCategories,
    includedCategoryNames,
    isInputReady,
    hasSavedSelection,
    draftMissingCount,
    draftSelections,
    isModalOpen,
    setIsModalOpen,
    handleOpenModal,
    handleModalOpenChange,
    handleSelectPreset,
    handleSaveDraft,
    backendAssignmentRows,
  };
};
