"use client";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import type { Exam } from "@/types/exams";

import { useExamsCategoryModalActions } from "./useExamsCategoryModalActions";
import { useExamsCategoryModalResources } from "./useExamsCategoryModalResources";
import {
  PRESET_SNIPPETS,
  useExamsCategoryModalState,
} from "./useExamsCategoryModalState";

export const useExamsCategoryModal = (exams: Exam[]) => {
  const { showAlert, showConfirm } = useDialogAlert();

  const state = useExamsCategoryModalState({
    exams,
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
    isFetchingAssignments: state.isFetchingAssignments,
    isCreatingCategory: state.isCreatingCategory,
    isCreatingAssignment: state.isCreatingAssignment,
    isUpdatingCategory: state.isUpdatingCategory,
    isDeletingCategory: state.isDeletingCategory,
    deletingCategoryId: state.deletingCategoryId,
    isDeletingAssignment: state.isDeletingAssignment,
    deletingAssignmentId: state.deletingAssignmentId,
    isSavingAssignments: state.isSavingAssignments,
    isBusy: state.isBusy,
    categories: state.categories,
    availableAssignments: state.availableAssignments,
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
    assignmentTitle: state.assignmentTitle,
    setAssignmentTitle: state.setAssignmentTitle,
    assignmentCategoryId: state.assignmentCategoryId,
    setAssignmentCategoryId: state.setAssignmentCategoryId,
    presetInput: state.presetInput,
    setPresetInput: state.setPresetInput,
    presetDrafts: state.presetDrafts,
    createError: state.createError,
    setCreateError: state.setCreateError,
    createAssignmentError: state.createAssignmentError,
    canCreateCategory: state.canCreateCategory,
    canCreateAssignment: state.canCreateAssignment,
    duplicatedCategoryName: state.duplicatedCategoryName,
    showIncludedOnly: state.showIncludedOnly,
    setShowIncludedOnly: state.setShowIncludedOnly,
    effectiveExamId: state.effectiveExamId,
    includedCategoryIds: state.includedCategoryIds,
    visibleCategories: state.visibleCategories,
    includedAssignmentIds: state.includedAssignmentIds,
    visibleAssignments: state.visibleAssignments,
    hasPendingChanges: state.hasPendingChanges,
    pendingAssignmentDeltaCount: state.pendingAssignmentDeltaCount,
    pushPresetDraft: actions.pushPresetDraft,
    removePresetDraft: actions.removePresetDraft,
    applySnippet: actions.applySnippet,
    handleCreateCategory: actions.handleCreateCategory,
    handleCreateAssignment: actions.handleCreateAssignment,
    handleDeleteAssignment: actions.handleDeleteAssignment,
    handleUpdateCategory: actions.handleUpdateCategory,
    handleDeleteCategory: actions.handleDeleteCategory,
    toggleIncluded: actions.toggleIncluded,
    toggleIncludedAssignment: actions.toggleIncludedAssignment,
    handleSaveModal: actions.handleSaveModal,
    handleModalOpenChange: actions.handleModalOpenChange,
    handleOpenModal: actions.handleOpenModal,
  };
};
