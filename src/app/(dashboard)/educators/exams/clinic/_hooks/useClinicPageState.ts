"use client";

import { useState } from "react";

export const CLINIC_ALL_VALUE = "all";

export const useClinicPageState = () => {
  const [selectedLectureId, setSelectedLectureId] =
    useState<string>(CLINIC_ALL_VALUE);
  const [selectedExamId, setSelectedExamId] =
    useState<string>(CLINIC_ALL_VALUE);
  const [selectedIdsState, setSelectedIdsState] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSort, setDateSort] = useState<"latest" | "oldest">("latest");
  const [incompleteFirst, setIncompleteFirst] = useState(true);
  const [examSearch, setExamSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  const activeLectureId =
    selectedLectureId === CLINIC_ALL_VALUE ? undefined : selectedLectureId;
  const activeExamId =
    selectedExamId === CLINIC_ALL_VALUE ? undefined : selectedExamId;

  return {
    selectedLectureId,
    setSelectedLectureId,
    selectedExamId,
    setSelectedExamId,
    selectedIdsState,
    setSelectedIdsState,
    currentPage,
    setCurrentPage,
    dateSort,
    setDateSort,
    incompleteFirst,
    setIncompleteFirst,
    examSearch,
    setExamSearch,
    statusFilter,
    setStatusFilter,
    activeLectureId,
    activeExamId,
  };
};

export type ClinicPageState = ReturnType<typeof useClinicPageState>;
