"use client";

import { useMemo } from "react";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import { useReportStore } from "@/stores/report.store";
import { MAX_INCLUDED_ASSIGNMENTS } from "@/constants/exams.constants";

import { useExamsCategoryModal } from "../../_hooks/useExamsCategoryModal";
import { useExamsPage } from "../../_hooks/useExamsPage";

import { useMiniTestsPageActions } from "./useMiniTestsPageActions";
import { useMiniTestsPageResources } from "./useMiniTestsPageResources";
import { useMiniTestsPageState } from "./useMiniTestsPageState";

export const useMiniTestsPage = () => {
  const state = useMiniTestsPageState();
  const {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    loadClasses,
    selectClass,
    selectExam,
  } = useReportStore();
  const { showAlert, showConfirm } = useDialogAlert();
  const { exams: modalExams } = useExamsPage();

  const {
    searchTerm,
    setSearchTerm,
    isEditMode,
    setIsEditMode,
    isSaving,
    setIsSaving,
    isLoadingAssignmentData,
    setIsLoadingAssignmentData,
    isResultModalOpen,
    setIsResultModalOpen,
    resultSearchTerm,
    setResultSearchTerm,
    showOnlyMissingResults,
    setShowOnlyMissingResults,
    isCategoryApplyFeedback,
    setIsCategoryApplyFeedback,
    feedbackMessage,
    setFeedbackMessage,
    assignmentSearchQuery,
    setAssignmentSearchQuery,
    isTargetSelectorOpen,
    setIsTargetSelectorOpen,
    isAdvancedCategoryOpen,
    setIsAdvancedCategoryOpen,
    includedAssignments,
    setIncludedAssignments,
    selectionsByExam,
    setSelectionsByExam,
    examFinalizedMap,
    setExamFinalizedMap,
    assignmentDataVersion,
    setAssignmentDataVersion,
    editingCategoryId,
    setEditingCategoryId,
    editingCategoryName,
    setEditingCategoryName,
    editingPresetInput,
    setEditingPresetInput,
    editingPresetDrafts,
    setEditingPresetDrafts,
    editingError,
    setEditingError,
  } = state;
  const isCategoryMutationBlocked = false;

  const {
    presetSnippets,
    isCategoryModalOpen,
    isFetchingCategories,
    isCreatingCategory,
    isCreatingAssignment,
    isUpdatingCategory,
    isDeletingCategory,
    isDeletingAssignment,
    deletingAssignmentId,
    isSavingAssignments,
    isBusy,
    categories,
    availableAssignments,
    selectedExam: modalSelectedExam,
    classSelectValue,
    filteredClassOptions,
    setSelectedClassKey,
    examSelectValue,
    filteredExamsInSelectedClass,
    setSelectedExamId: setModalSelectedExamId,
    categoryName,
    setCategoryName,
    assignmentTitle,
    setAssignmentTitle,
    assignmentCategoryId,
    setAssignmentCategoryId,
    presetInput,
    setPresetInput,
    presetDrafts,
    createError,
    setCreateError,
    createAssignmentError,
    canCreateCategory,
    canCreateAssignment,
    duplicatedCategoryName,
    showIncludedOnly,
    setShowIncludedOnly,
    effectiveExamId,
    includedAssignmentIds,
    visibleAssignments,
    hasPendingChanges,
    pendingAssignmentDeltaCount,
    pushPresetDraft,
    removePresetDraft,
    applySnippet,
    handleCreateCategory,
    handleCreateAssignment,
    handleDeleteAssignment,
    handleUpdateCategory,
    handleDeleteCategory,
    toggleIncludedAssignment,
    handleSaveModal,
    handleModalOpenChange,
    handleOpenModal,
  } = useExamsCategoryModal(modalExams);

  const assignmentCountByCategory = useMemo(() => {
    return availableAssignments.reduce<Record<string, number>>((acc, row) => {
      acc[row.categoryId] = (acc[row.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [availableAssignments]);

  const normalizedAssignmentSearchQuery = assignmentSearchQuery
    .trim()
    .toLowerCase();
  const hasExactAssignmentTitle = useMemo(
    () =>
      availableAssignments.some(
        (assignment) =>
          assignment.title.trim().toLowerCase() ===
          normalizedAssignmentSearchQuery
      ),
    [availableAssignments, normalizedAssignmentSearchQuery]
  );
  const canSuggestCreateFromSearch =
    normalizedAssignmentSearchQuery.length > 0 && !hasExactAssignmentTitle;
  const includeLimitReached =
    includedAssignmentIds.length >= MAX_INCLUDED_ASSIGNMENTS;
  const canCreateAssignmentForSelectedExam = Boolean(
    modalSelectedExam?.lectureId
  );
  const filteredVisibleAssignments = useMemo(() => {
    if (!normalizedAssignmentSearchQuery) return visibleAssignments;

    return visibleAssignments.filter((assignment) => {
      const haystack = [
        assignment.title,
        assignment.categoryName,
        assignment.presets.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedAssignmentSearchQuery);
    });
  }, [normalizedAssignmentSearchQuery, visibleAssignments]);

  const filteredClasses = useMemo(() => {
    if (!searchTerm) return classes;
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  const isExamFinalized = selectedExamId
    ? Boolean(examFinalizedMap[selectedExamId])
    : false;

  useMiniTestsPageResources({
    loadClasses,
    isCategoryApplyFeedback,
    setIsCategoryApplyFeedback,
    setFeedbackMessage,
    isCategoryModalOpen,
    setAssignmentSearchQuery,
    assignmentDataVersion,
    selectedExamId,
    students,
    setIncludedAssignments,
    setSelectionsByExam,
    setExamFinalizedMap,
    setIsLoadingAssignmentData,
    isExamFinalized,
    setIsEditMode,
    setIsResultModalOpen,
    setResultSearchTerm,
    setShowOnlyMissingResults,
  });

  const currentSelections = useMemo(() => {
    if (!selectedExamId) return {};
    return selectionsByExam[selectedExamId] ?? {};
  }, [selectedExamId, selectionsByExam]);

  const resultRows = useMemo(() => {
    return students.map((student) => {
      const values = includedAssignments.map((assignment) => {
        const selection =
          currentSelections[student.id]?.[assignment.id] ?? null;
        if (selection === null || selection === undefined) return "-";

        return assignment.presets[selection]?.trim() || "-";
      });

      return {
        id: student.id,
        name: student.name,
        values,
      };
    });
  }, [students, includedAssignments, currentSelections]);

  const filteredResultRows = useMemo(() => {
    const normalizedQuery = resultSearchTerm.trim().toLowerCase();

    return resultRows.filter((row) => {
      const matchedByName = normalizedQuery
        ? row.name.toLowerCase().includes(normalizedQuery)
        : true;
      const hasMissingValue = row.values.some((value) => value === "-");
      const matchedByMissing = showOnlyMissingResults ? hasMissingValue : true;

      return matchedByName && matchedByMissing;
    });
  }, [resultRows, resultSearchTerm, showOnlyMissingResults]);

  const {
    handleQuickEdit,
    handlePrefillAssignmentTitleFromSearch,
    handleOpenResultModal,
    handleSelectionChange,
    handleSaveAll,
    handleQuickSaveModal,
    handleOpenAssignmentCreationGuide,
    handleEnableEditMode,
    handleStartEditCategory,
    handleCancelEditCategory,
    handlePushEditPreset,
    handleRemoveEditPreset,
    handleSubmitEditCategory,
    handleClickDeleteCategory,
  } = useMiniTestsPageActions({
    selectedExamId,
    isEditMode,
    isSaving,
    students,
    includedAssignments,
    currentSelections,
    assignmentSearchQuery,
    editingCategoryId,
    editingCategoryName,
    editingPresetInput,
    editingPresetDrafts,
    categories,
    setIsSaving,
    setExamFinalizedMap,
    setIsEditMode,
    setFeedbackMessage,
    setIsCategoryApplyFeedback,
    setAssignmentDataVersion,
    setResultSearchTerm,
    setShowOnlyMissingResults,
    setIsResultModalOpen,
    setSelectionsByExam,
    setAssignmentSearchQuery,
    setIsTargetSelectorOpen,
    setIsAdvancedCategoryOpen,
    setAssignmentTitle,
    setEditingCategoryId,
    setEditingCategoryName,
    setEditingPresetDrafts,
    setEditingPresetInput,
    setEditingError,
    showConfirm,
    showAlert,
    handleOpenModal,
    handleSaveModal,
    handleUpdateCategory,
    handleDeleteCategory,
  });

  const selectedExamMeta = useMemo(
    () => exams.find((exam) => exam.id === selectedExamId) ?? null,
    [exams, selectedExamId]
  );

  const isModalTargetMismatch = Boolean(
    selectedExamId &&
    modalSelectedExam?.id &&
    selectedExamId !== modalSelectedExam.id
  );

  return {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    selectClass,
    selectExam,
    feedbackMessage,
    isEditMode,
    isSaving,
    isExamFinalized,
    searchTerm,
    setSearchTerm,
    filteredClasses,
    includedAssignments,
    isCategoryApplyFeedback,
    isLoadingAssignmentData,
    currentSelections,
    resultSearchTerm,
    setResultSearchTerm,
    showOnlyMissingResults,
    setShowOnlyMissingResults,
    isResultModalOpen,
    setIsResultModalOpen,
    filteredResultRows,
    handleQuickEdit,
    handleOpenResultModal,
    handleSaveAll,
    handleEnableEditMode,
    handleSelectionChange,
    handleQuickSaveModal,
    handleOpenAssignmentCreationGuide,
    selectedExamMeta,
    isModalTargetMismatch,
    assignmentSearchQuery,
    setAssignmentSearchQuery,
    isTargetSelectorOpen,
    setIsTargetSelectorOpen,
    isAdvancedCategoryOpen,
    setIsAdvancedCategoryOpen,
    editingCategoryId,
    editingCategoryName,
    setEditingCategoryName,
    editingPresetInput,
    setEditingPresetInput,
    editingPresetDrafts,
    editingError,
    setEditingError,
    isCategoryMutationBlocked,
    assignmentCountByCategory,
    normalizedAssignmentSearchQuery,
    canSuggestCreateFromSearch,
    includeLimitReached,
    canCreateAssignmentForSelectedExam,
    filteredVisibleAssignments,
    presetSnippets,
    isCategoryModalOpen,
    isFetchingCategories,
    isCreatingCategory,
    isCreatingAssignment,
    isUpdatingCategory,
    isDeletingCategory,
    isDeletingAssignment,
    deletingAssignmentId,
    isSavingAssignments,
    isBusy,
    categories,
    availableAssignments,
    modalSelectedExam,
    classSelectValue,
    filteredClassOptions,
    setSelectedClassKey,
    examSelectValue,
    filteredExamsInSelectedClass,
    setModalSelectedExamId,
    categoryName,
    setCategoryName,
    assignmentTitle,
    setAssignmentTitle,
    assignmentCategoryId,
    setAssignmentCategoryId,
    presetInput,
    setPresetInput,
    presetDrafts,
    createError,
    setCreateError,
    createAssignmentError,
    canCreateCategory,
    canCreateAssignment,
    duplicatedCategoryName,
    showIncludedOnly,
    setShowIncludedOnly,
    effectiveExamId,
    includedAssignmentIds,
    visibleAssignments,
    hasPendingChanges,
    pendingAssignmentDeltaCount,
    pushPresetDraft,
    removePresetDraft,
    applySnippet,
    handleCreateCategory,
    handleCreateAssignment,
    handleDeleteAssignment,
    handleUpdateCategory,
    handleDeleteCategory,
    toggleIncludedAssignment,
    handleModalOpenChange,
    handlePrefillAssignmentTitleFromSearch,
    handleStartEditCategory,
    handleCancelEditCategory,
    handlePushEditPreset,
    handleRemoveEditPreset,
    handleSubmitEditCategory,
    handleClickDeleteCategory,
  };
};
