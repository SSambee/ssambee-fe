"use client";

import { useMemo } from "react";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import { readReportCategoryStorageConfig } from "@/services/exams/report-category-persistence.service";
import type { Exam } from "@/types/exams";

import { useExamsCategoryModalActions } from "./useExamsCategoryModalActions";
import { useExamsCategoryModalResources } from "./useExamsCategoryModalResources";
import {
  PRESET_SNIPPETS,
  useExamsCategoryModalState,
} from "./useExamsCategoryModalState";

export const useExamsCategoryModal = (exams: Exam[]) => {
  const { showAlert, showConfirm } = useDialogAlert();
  const initialStorage = useMemo(() => readReportCategoryStorageConfig(), []);

  const state = useExamsCategoryModalState({
    exams,
    initialStorage,
  });

  useExamsCategoryModalResources({
    state,
    showAlert,
  });

  const actions = useExamsCategoryModalActions({
    exams,
    state,
    showAlert,
    showConfirm,
  });

  return {
    presetSnippets: PRESET_SNIPPETS,
    isCategoryModalOpen: state.isCategoryModalOpen,
    isFetchingCategories: state.isFetchingCategories,
    isCreatingCategory: state.isCreatingCategory,
    isBusy: state.isBusy,
    categories: state.categories,
    selectedExam: state.selectedExam,
    classOptions: state.classOptions,
    classSearchQuery: state.classSearchQuery,
    setClassSearchQuery: state.setClassSearchQuery,
    classSelectValue: state.classSelectValue,
    filteredClassOptions: state.filteredClassOptions,
    setSelectedClassKey: state.setSelectedClassKey,
    examSearchQuery: state.examSearchQuery,
    setExamSearchQuery: state.setExamSearchQuery,
    examsInSelectedClass: state.examsInSelectedClass,
    examSelectValue: state.examSelectValue,
    filteredExamsInSelectedClass: state.filteredExamsInSelectedClass,
    setSelectedExamId: state.setSelectedExamId,
    categoryName: state.categoryName,
    setCategoryName: state.setCategoryName,
    presetInput: state.presetInput,
    setPresetInput: state.setPresetInput,
    presetDrafts: state.presetDrafts,
    createError: state.createError,
    setCreateError: state.setCreateError,
    canCreateCategory: state.canCreateCategory,
    duplicatedCategoryName: state.duplicatedCategoryName,
    showIncludedOnly: state.showIncludedOnly,
    setShowIncludedOnly: state.setShowIncludedOnly,
    effectiveExamId: state.effectiveExamId,
    includedCategoryIds: state.includedCategoryIds,
    visibleCategories: state.visibleCategories,
    hasPendingChanges: state.hasPendingChanges,
    pushPresetDraft: actions.pushPresetDraft,
    removePresetDraft: actions.removePresetDraft,
    applySnippet: actions.applySnippet,
    handleCreateCategory: actions.handleCreateCategory,
    toggleIncluded: actions.toggleIncluded,
    handleSaveModal: actions.handleSaveModal,
    handleModalOpenChange: actions.handleModalOpenChange,
    handleOpenModal: actions.handleOpenModal,
  };
};
