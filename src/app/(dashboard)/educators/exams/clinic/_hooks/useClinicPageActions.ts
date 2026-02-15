"use client";

import type { ClinicStudent } from "@/types/clinics";

import { CLINIC_ALL_VALUE, type ClinicPageState } from "./useClinicPageState";
import type { ClinicPageResources } from "./useClinicPageResources";

export const useClinicPageActions = ({
  state,
  resources,
  selectedIds,
  pagedStudents,
}: {
  state: ClinicPageState;
  resources: ClinicPageResources;
  selectedIds: string[];
  pagedStudents: ClinicStudent[];
}) => {
  const handleLectureChange = (value: string) => {
    state.setSelectedLectureId(value);
    state.setSelectedExamId(CLINIC_ALL_VALUE);
    state.setExamSearch("");
    state.setCurrentPage(1);
  };

  const handleExamChange = (value: string) => {
    state.setSelectedExamId(value);
    state.setCurrentPage(1);
  };

  const handleExamSearchChange = (value: string) => {
    state.setExamSearch(value);
    state.setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: "all" | "pending" | "completed") => {
    state.setStatusFilter(value);
    state.setCurrentPage(1);
  };

  const handleSortLatest = () => {
    state.setDateSort((prev) => (prev === "latest" ? "oldest" : "latest"));
    state.setCurrentPage(1);
  };

  const handleSortIncomplete = () => {
    state.setIncompleteFirst((prev) => !prev);
    state.setCurrentPage(1);
  };

  const handleResetFilters = () => {
    state.setSelectedLectureId(CLINIC_ALL_VALUE);
    state.setSelectedExamId(CLINIC_ALL_VALUE);
    state.setExamSearch("");
    state.setStatusFilter("all");
    state.setDateSort("latest");
    state.setIncompleteFirst(true);
    state.setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    const pageIds = new Set(pagedStudents.map((student) => student.id));
    if (checked) {
      state.setSelectedIdsState((prev) =>
        Array.from(new Set([...prev, ...pageIds]))
      );
    } else {
      state.setSelectedIdsState((prev) =>
        prev.filter((id) => !pageIds.has(id))
      );
    }
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    state.setSelectedIdsState((prev) =>
      checked
        ? prev.includes(id)
          ? prev
          : [...prev, id]
        : prev.filter((value) => value !== id)
    );
  };

  const handleMarkCompleted = () => {
    if (selectedIds.length === 0) return;
    const ids = [...selectedIds];
    resources.updateClinicsMutation.mutate(
      {
        clinicIds: ids,
        updates: { status: "COMPLETED" },
      },
      {
        onSuccess: () => {
          state.setSelectedIdsState((prev) =>
            prev.filter((id) => !ids.includes(id))
          );
        },
      }
    );
  };

  return {
    handleLectureChange,
    handleExamChange,
    handleExamSearchChange,
    handleStatusFilterChange,
    handleSortLatest,
    handleSortIncomplete,
    handleResetFilters,
    handleSelectAll,
    handleToggleSelect,
    handleMarkCompleted,
  };
};
