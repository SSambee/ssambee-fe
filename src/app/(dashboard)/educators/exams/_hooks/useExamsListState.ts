"use client";

import { useEffect, useMemo, useState } from "react";

import { EXAMS_UI_ONLY } from "@/constants/exams.constants";
import { useDeleteExam } from "@/hooks/exams/useDeleteExam";
import { useExamsStore } from "@/stores/exams";
import type { Exam } from "@/types/exams";

export type ExamsStatusFilter = "all" | "in_progress" | "completed";
export type ExamsSortOrder = "latest" | "oldest";

type UseExamsListStateParams = {
  exams: Exam[];
  selectedLectureId: string;
  onLectureChange: (lectureId: string) => void;
  isLoading?: boolean;
  hasLectures: boolean;
};

export const useExamsListState = ({
  exams,
  selectedLectureId,
  onLectureChange,
  isLoading = false,
  hasLectures,
}: UseExamsListStateParams) => {
  const isUiOnly = EXAMS_UI_ONLY;
  const [statusFilter, setStatusFilter] = useState<ExamsStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<ExamsSortOrder>("latest");
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    selectedIds,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    selectAll,
    toggleSelected,
    clearSelection,
  } = useExamsStore();

  const deleteExamMutation = useDeleteExam();

  const examLectureMap = useMemo(() => {
    return new Map(exams.map((exam) => [exam.id, exam.lectureId]));
  }, [exams]);

  const filteredExams = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return exams.filter((exam) => {
      if (statusFilter === "in_progress" && exam.status !== "진행 중") {
        return false;
      }
      if (statusFilter === "completed" && exam.status !== "채점 완료") {
        return false;
      }
      if (!keyword) return true;
      return (
        exam.name.toLowerCase().includes(keyword) ||
        exam.lectureName.toLowerCase().includes(keyword)
      );
    });
  }, [exams, searchQuery, statusFilter]);

  const sortedExams = useMemo(() => {
    const toTimestamp = (exam: Exam) => {
      if (exam.createdAt) {
        return new Date(exam.createdAt).getTime();
      }
      const normalized = exam.registrationDate
        ? exam.registrationDate.replace(/\.\s*/g, "-").trim()
        : "";
      return normalized ? new Date(normalized).getTime() : 0;
    };

    return [...filteredExams].sort((a, b) => {
      const diff = toTimestamp(a) - toTimestamp(b);
      return sortOrder === "latest" ? -diff : diff;
    });
  }, [filteredExams, sortOrder]);

  const totalPages = Math.ceil(sortedExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExams = sortedExams.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
    clearSelection();
  }, [
    selectedLectureId,
    searchQuery,
    statusFilter,
    sortOrder,
    setCurrentPage,
    clearSelection,
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(paginatedExams.map((exam) => exam.id));
    } else {
      clearSelection();
    }
  };

  const handleSelectExam = (id: string, checked: boolean) => {
    toggleSelected(id, checked);
  };

  /** 삭제 확인 다이얼로그에서 '삭제' 클릭 시 호출. */
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0 || !selectedLectureId) return;
    setIsDeleting(true);

    const results = await Promise.allSettled(
      selectedIds.map((examId) =>
        deleteExamMutation.mutateAsync({
          examId,
          lectureId: examLectureMap.get(examId) ?? undefined,
        })
      )
    );

    const failedIds = results
      .map((result, index) =>
        result.status === "rejected" ? selectedIds[index] : null
      )
      .filter((id): id is string => Boolean(id));

    setIsDeleting(false);

    if (failedIds.length > 0) {
      selectAll(failedIds);
      const firstError = results.find(
        (result) => result.status === "rejected"
      ) as PromiseRejectedResult | undefined;
      const message =
        firstError?.reason instanceof Error
          ? firstError.reason.message
          : "시험 삭제 중 오류가 발생했습니다.";
      alert(`${failedIds.length}건 삭제 실패: ${message}`);
      return;
    }

    clearSelection();
  };

  const handleLectureChange = (lectureId: string) => {
    if (lectureId === selectedLectureId) return;
    onLectureChange(lectureId);
  };

  const isSelectionDisabled =
    isUiOnly || isLoading || isDeleting || !selectedLectureId;
  const isPaginationDisabled = isLoading || isDeleting || !selectedLectureId;
  const emptyMessage = isLoading
    ? "시험 목록을 불러오는 중입니다."
    : !hasLectures
      ? "등록된 수업이 없습니다."
      : !selectedLectureId
        ? "수업을 선택해주세요."
        : "검색 결과가 없습니다.";

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedIds,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    totalPages,
    sortedExams,
    paginatedExams,
    isSelectionDisabled,
    isPaginationDisabled,
    emptyMessage,
    handleSelectAll,
    handleSelectExam,
    handleDeleteSelected,
    handleLectureChange,
  };
};
