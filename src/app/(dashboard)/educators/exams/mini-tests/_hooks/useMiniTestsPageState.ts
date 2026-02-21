"use client";

import { useState } from "react";

import type {
  IncludedAssignment,
  SelectionByStudent,
} from "@/types/exams/mini-tests";

export const useMiniTestsPageState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAssignmentData, setIsLoadingAssignmentData] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultSearchTerm, setResultSearchTerm] = useState("");
  const [showOnlyMissingResults, setShowOnlyMissingResults] = useState(false);
  const [isCategoryApplyFeedback, setIsCategoryApplyFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState("");
  const [isTargetSelectorOpen, setIsTargetSelectorOpen] = useState(false);
  const [isAdvancedCategoryOpen, setIsAdvancedCategoryOpen] = useState(false);
  const [includedAssignments, setIncludedAssignments] = useState<
    IncludedAssignment[]
  >([]);
  const [selectionsByExam, setSelectionsByExam] = useState<
    Record<string, SelectionByStudent>
  >({});
  const [examFinalizedMap, setExamFinalizedMap] = useState<
    Record<string, boolean>
  >({});
  const [assignmentDataVersion, setAssignmentDataVersion] = useState(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingPresetInput, setEditingPresetInput] = useState("");
  const [editingPresetDrafts, setEditingPresetDrafts] = useState<string[]>([]);
  const [editingError, setEditingError] = useState<string | null>(null);

  return {
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
  };
};
