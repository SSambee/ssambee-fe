"use client";

import { useEffect } from "react";

import { getExamReportAssignmentsAPI } from "@/services/exams/exam-report-assignments.service";
import { fetchExamGradeReportAPI } from "@/services/exams/grades.service";
import {
  hasCompleteMiniTestSelections,
  mapIncludedAssignments,
} from "@/services/exams/mini-tests.mapper";
import type {
  IncludedAssignment,
  MiniTestStudent,
  SelectionByStudent,
} from "@/types/exams/mini-tests";

type UseMiniTestsPageResourcesParams = {
  loadClasses: () => Promise<void> | void;
  isCategoryApplyFeedback: boolean;
  setIsCategoryApplyFeedback: (value: boolean) => void;
  setFeedbackMessage: (value: string | null) => void;
  isCategoryModalOpen: boolean;
  setAssignmentSearchQuery: (value: string) => void;
  assignmentDataVersion: number;
  selectedExamId?: string | null;
  students: MiniTestStudent[];
  setIncludedAssignments: (value: IncludedAssignment[]) => void;
  setSelectionsByExam: (
    updater: (
      prev: Record<string, SelectionByStudent>
    ) => Record<string, SelectionByStudent>
  ) => void;
  setExamFinalizedMap: (
    updater: (prev: Record<string, boolean>) => Record<string, boolean>
  ) => void;
  setIsLoadingAssignmentData: (value: boolean) => void;
  isExamFinalized: boolean;
  setIsEditMode: (value: boolean) => void;
  setIsResultModalOpen: (value: boolean) => void;
  setResultSearchTerm: (value: string) => void;
  setShowOnlyMissingResults: (value: boolean) => void;
};

export const useMiniTestsPageResources = ({
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
}: UseMiniTestsPageResourcesParams) => {
  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (!isCategoryApplyFeedback) return;

    const timer = window.setTimeout(() => {
      setIsCategoryApplyFeedback(false);
      setFeedbackMessage(null);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isCategoryApplyFeedback, setFeedbackMessage, setIsCategoryApplyFeedback]);

  useEffect(() => {
    if (isCategoryModalOpen) return;
    setAssignmentSearchQuery("");
  }, [isCategoryModalOpen, setAssignmentSearchQuery]);

  useEffect(() => {
    if (!selectedExamId) {
      setIncludedAssignments([]);
      return;
    }

    const requestVersion = assignmentDataVersion;
    let cancelled = false;

    const loadExamAssignmentData = async () => {
      setIsLoadingAssignmentData(true);

      try {
        const assignments = await getExamReportAssignmentsAPI(selectedExamId);
        if (cancelled) return;

        const mappedAssignments = mapIncludedAssignments(assignments);
        setIncludedAssignments(mappedAssignments);

        const nextSelections: SelectionByStudent = {};

        for (let i = 0; i < students.length; i += 5) {
          const chunk = students.slice(i, i + 5);

          await Promise.all(
            chunk.map(async (student) => {
              if (!student.gradeId) {
                nextSelections[student.id] = {};
                return;
              }

              const report = await fetchExamGradeReportAPI(student.gradeId);
              const row: Record<string, number | null> = {};

              (report.assignments ?? []).forEach((assignment) => {
                row[assignment.assignmentId] =
                  typeof assignment.resultIndex === "number"
                    ? assignment.resultIndex
                    : null;
              });

              nextSelections[student.id] = row;
            })
          );
        }

        if (cancelled) return;

        const isFinalizedFromReport = hasCompleteMiniTestSelections({
          assignments: mappedAssignments,
          students,
          selections: nextSelections,
        });

        setSelectionsByExam((prev) => {
          if (cancelled) return prev;

          void requestVersion;

          return {
            ...prev,
            [selectedExamId]: nextSelections,
          };
        });

        setExamFinalizedMap((prev) => ({
          ...prev,
          [selectedExamId]: isFinalizedFromReport,
        }));
      } catch (error) {
        console.error("Failed to load mini-test assignment data", error);
        if (!cancelled) {
          setIncludedAssignments([]);
          setSelectionsByExam((prev) => ({
            ...prev,
            [selectedExamId]: {},
          }));
          setExamFinalizedMap((prev) => ({
            ...prev,
            [selectedExamId]: false,
          }));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAssignmentData(false);
        }
      }
    };

    void loadExamAssignmentData();

    return () => {
      cancelled = true;
    };
  }, [
    assignmentDataVersion,
    selectedExamId,
    setExamFinalizedMap,
    setIncludedAssignments,
    setIsLoadingAssignmentData,
    setSelectionsByExam,
    students,
  ]);

  useEffect(() => {
    if (!selectedExamId) {
      setIsEditMode(true);
      setIsResultModalOpen(false);
      setResultSearchTerm("");
      setShowOnlyMissingResults(false);
      return;
    }

    setIsEditMode(!isExamFinalized);
    setIsResultModalOpen(false);
    setResultSearchTerm("");
    setShowOnlyMissingResults(false);
  }, [
    selectedExamId,
    isExamFinalized,
    setIsEditMode,
    setIsResultModalOpen,
    setResultSearchTerm,
    setShowOnlyMissingResults,
  ]);
};
