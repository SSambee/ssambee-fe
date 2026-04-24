"use client";

import { useEffect } from "react";

import { fetchAssignmentCategoriesAPI } from "@/services/exams/assignment-categories.service";
import { fetchAssignmentsAPI } from "@/services/exams/assignments.service";
import { getExamReportAssignmentsAPI } from "@/services/exams/exam-report-assignments.service";

import type {
  ExamsCategoryModalState,
  ReportCategory,
} from "./useExamsCategoryModalState";

type AlertFn = (payload: {
  title: string;
  description: string;
}) => Promise<void> | void;

export const useExamsCategoryModalResources = ({
  state,
  showAlert,
}: {
  state: ExamsCategoryModalState;
  showAlert: AlertFn;
}) => {
  const {
    isCategoryModalOpen,
    setIsFetchingCategories,
    setIsFetchingAssignments,
    setCategories,
    setAvailableAssignments,
    selectedExam,
    effectiveExamId,
    setExamAssignmentMap,
    setBaselineExamAssignmentMapSerialized,
  } = state;

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    const loadCategories = async () => {
      setIsFetchingCategories(true);

      try {
        const data = await fetchAssignmentCategoriesAPI();
        const mappedCategories: ReportCategory[] = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          presets: cat.resultPresets,
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        showAlert({
          title: "오류",
          description: "카테고리 목록을 불러오는데 실패했습니다.",
        });
      } finally {
        setIsFetchingCategories(false);
      }
    };

    void loadCategories();
  }, [isCategoryModalOpen, setCategories, setIsFetchingCategories, showAlert]);

  useEffect(() => {
    if (!isCategoryModalOpen || !selectedExam?.lectureId || !effectiveExamId) {
      return;
    }

    const loadAssignments = async () => {
      setIsFetchingAssignments(true);

      try {
        const [assignments, includedAssignments] = await Promise.all([
          fetchAssignmentsAPI(selectedExam.lectureId),
          getExamReportAssignmentsAPI(effectiveExamId),
        ]);

        const mappedAssignments = assignments.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          categoryId: assignment.categoryId,
          categoryName: assignment.category?.name ?? "카테고리 미지정",
          presets: assignment.category?.resultPresets ?? [],
        }));

        const includedIds = includedAssignments.map(
          (assignment) => assignment.assignmentId
        );

        setAvailableAssignments(mappedAssignments);
        setExamAssignmentMap((prev) => {
          const next = {
            ...prev,
            [effectiveExamId]: includedIds,
          };
          setBaselineExamAssignmentMapSerialized(JSON.stringify(next));
          return next;
        });
      } catch (error) {
        console.error("Failed to load report assignments", error);
        showAlert({
          title: "오류",
          description: "시험별 포함 과제를 불러오는데 실패했습니다.",
        });
      } finally {
        setIsFetchingAssignments(false);
      }
    };

    void loadAssignments();
  }, [
    effectiveExamId,
    isCategoryModalOpen,
    selectedExam?.lectureId,
    setAvailableAssignments,
    setBaselineExamAssignmentMapSerialized,
    setExamAssignmentMap,
    setIsFetchingAssignments,
    showAlert,
  ]);
};
