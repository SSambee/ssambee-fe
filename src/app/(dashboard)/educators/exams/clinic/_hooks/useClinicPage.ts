"use client";

import { useMemo } from "react";

import { mapClinicApiToStudent } from "@/services/exams/clinics.mapper";

import { useClinicPageActions } from "./useClinicPageActions";
import { useClinicPageResources } from "./useClinicPageResources";
import { CLINIC_ALL_VALUE, useClinicPageState } from "./useClinicPageState";

export const useClinicPage = () => {
  const state = useClinicPageState();
  const resources = useClinicPageResources({
    activeLectureId: state.activeLectureId,
    activeExamId: state.activeExamId,
  });

  const pageSize = 10;

  const examOptionsSource = useMemo(() => {
    return state.activeLectureId
      ? (resources.examsByLectureQuery.data ?? [])
      : (resources.examsAllQuery.data ?? []);
  }, [
    resources.examsAllQuery.data,
    resources.examsByLectureQuery.data,
    state.activeLectureId,
  ]);

  const isLectureOptionsLoading = resources.lecturesQuery.isLoading;
  const isExamOptionsLoading = state.activeLectureId
    ? resources.examsByLectureQuery.isLoading
    : resources.examsAllQuery.isLoading;

  const lectureOptions = useMemo(
    () => [
      { value: CLINIC_ALL_VALUE, label: "전체 수업" },
      ...(resources.lecturesQuery.data?.lectures ?? []).map((lecture) => ({
        value: lecture.id,
        label: lecture.name,
      })),
    ],
    [resources.lecturesQuery.data?.lectures]
  );

  const examOptions = useMemo(
    () => [
      { value: CLINIC_ALL_VALUE, label: "전체 시험" },
      ...examOptionsSource
        .filter((exam) => {
          if (!state.examSearch.trim()) return true;
          const keyword = state.examSearch.trim().toLowerCase();
          const title = exam.title.toLowerCase();
          const date = exam.examDate ?? "";
          return title.includes(keyword) || date.includes(keyword);
        })
        .map((exam) => ({
          value: exam.id,
          label: exam.title,
        })),
    ],
    [examOptionsSource, state.examSearch]
  );

  const selectedExamLabel =
    state.selectedExamId === CLINIC_ALL_VALUE
      ? "모든 시험"
      : (examOptionsSource.find((exam) => exam.id === state.selectedExamId)
          ?.title ?? "선택된 시험");

  const students = useMemo(() => {
    const items = resources.clinicsQuery.data ?? [];
    return items.map((clinic, index) => mapClinicApiToStudent(clinic, index));
  }, [resources.clinicsQuery.data]);

  const filteredStudents = useMemo(() => {
    const keyword = state.examSearch.trim().toLowerCase();
    return students.filter((student) => {
      if (state.statusFilter === "pending" && student.status !== "알림 예정") {
        return false;
      }

      if (state.statusFilter === "completed" && student.status !== "완료") {
        return false;
      }

      if (!keyword) return true;

      const name = student.name.toLowerCase();
      const examName = student.examName.toLowerCase();
      const date = student.failedDate.toLowerCase();
      return (
        name.includes(keyword) ||
        examName.includes(keyword) ||
        date.includes(keyword)
      );
    });
  }, [students, state.statusFilter, state.examSearch]);

  const sortedStudents = useMemo(() => {
    const next = [...filteredStudents];
    const dateComparator =
      state.dateSort === "latest"
        ? (a: (typeof students)[number], b: (typeof students)[number]) =>
            b.failedDateSort - a.failedDateSort
        : (a: (typeof students)[number], b: (typeof students)[number]) =>
            a.failedDateSort - b.failedDateSort;

    next.sort((a, b) => {
      if (state.incompleteFirst) {
        const aIsDone = a.status === "완료";
        const bIsDone = b.status === "완료";
        if (aIsDone !== bIsDone) {
          return aIsDone ? 1 : -1;
        }
      }
      return dateComparator(a, b);
    });

    return next;
  }, [filteredStudents, state.dateSort, state.incompleteFirst]);

  const pagedStudents = useMemo(() => {
    const totalPage = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
    const safeCurrentPage = Math.min(state.currentPage, totalPage);
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [state.currentPage, sortedStudents]);

  const selectedIds = useMemo(() => {
    const validIds = new Set(students.map((student) => student.id));
    return state.selectedIdsState.filter((id) => validIds.has(id));
  }, [state.selectedIdsState, students]);

  const pagination = useMemo(() => {
    const totalCount = sortedStudents.length;
    const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
    const safeCurrentPage = Math.min(state.currentPage, totalPage);
    const hasPrevPage = safeCurrentPage > 1;
    const hasNextPage = safeCurrentPage < totalPage;
    return {
      totalCount,
      totalPage,
      currentPage: safeCurrentPage,
      limit: pageSize,
      hasNextPage,
      hasPrevPage,
    };
  }, [state.currentPage, sortedStudents.length]);

  const sortSummary = `${
    state.incompleteFirst ? "미완료 우선" : "완료 포함"
  } · ${state.dateSort === "latest" ? "최신순" : "오래된순"}`;

  const isFilteredEmpty = students.length > 0 && filteredStudents.length === 0;
  const emptyMessage = isFilteredEmpty
    ? "현재 조건에 맞는 대상이 없습니다."
    : "표시할 클리닉 대상자가 없습니다.";

  const actions = useClinicPageActions({
    state,
    resources,
    selectedIds,
    pagedStudents,
  });

  return {
    students,
    selectedIds,
    selectedLectureId: state.selectedLectureId,
    selectedExamId: state.selectedExamId,
    examSearch: state.examSearch,
    statusFilter: state.statusFilter,
    dateSort: state.dateSort,
    incompleteFirst: state.incompleteFirst,
    lectureOptions,
    examOptions,
    isLectureOptionsLoading,
    isExamOptionsLoading,
    selectedExamLabel,
    sortSummary,
    isFilteredEmpty,
    emptyMessage,
    pagedStudents,
    pagination,
    isMarkingCompleted: resources.updateClinicsMutation.isPending,
    setCurrentPage: state.setCurrentPage,
    handleLectureChange: actions.handleLectureChange,
    handleExamChange: actions.handleExamChange,
    handleExamSearchChange: actions.handleExamSearchChange,
    handleStatusFilterChange: actions.handleStatusFilterChange,
    handleSortLatest: actions.handleSortLatest,
    handleSortIncomplete: actions.handleSortIncomplete,
    handleResetFilters: actions.handleResetFilters,
    handleSelectAll: actions.handleSelectAll,
    handleToggleSelect: actions.handleToggleSelect,
    handleMarkCompleted: actions.handleMarkCompleted,
  };
};
