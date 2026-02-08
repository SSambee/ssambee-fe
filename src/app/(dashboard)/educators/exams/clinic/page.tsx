"use client";

import { useMemo, useState } from "react";

import { useExamsAll } from "@/hooks/exams/useExamsAll";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { useClinicsList } from "@/hooks/clinics/useClinicsList";
import { useUpdateClinics } from "@/hooks/clinics/useUpdateClinics";
import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { mapClinicApiToStudent } from "@/services/exams/clinics.mapper";
import { Pagination } from "@/components/common/pagination/Pagination";

import { ClinicHeader } from "./_components/ClinicHeader";
import { ClinicStats } from "./_components/ClinicStats";
import { ClinicFilters } from "./_components/ClinicFilters";
import { ClinicTable } from "./_components/ClinicTable";

export default function ClinicPage() {
  const ALL_VALUE = "all";
  const [selectedLectureId, setSelectedLectureId] = useState<string>(ALL_VALUE);
  const [selectedExamId, setSelectedExamId] = useState<string>(ALL_VALUE);
  const [selectedIdsState, setSelectedIdsState] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [dateSort, setDateSort] = useState<"latest" | "oldest">("latest");
  const [incompleteFirst, setIncompleteFirst] = useState(true);
  const [examSearch, setExamSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  const activeLectureId =
    selectedLectureId === ALL_VALUE ? undefined : selectedLectureId;
  const activeExamId =
    selectedExamId === ALL_VALUE ? undefined : selectedExamId;

  const lecturesQuery = useLecturesList({ page: 1, limit: 100 });
  const examsAllQuery = useExamsAll(activeLectureId === undefined);
  const examsByLectureQuery = useExamsByLecture(activeLectureId);
  const clinicsQuery = useClinicsList({
    lectureId: activeLectureId,
    examId: activeExamId,
  });
  const updateClinicsMutation = useUpdateClinics();

  const examOptionsSource = useMemo(() => {
    return activeLectureId
      ? (examsByLectureQuery.data ?? [])
      : (examsAllQuery.data ?? []);
  }, [activeLectureId, examsAllQuery.data, examsByLectureQuery.data]);

  const isLectureOptionsLoading = lecturesQuery.isLoading;
  const isExamOptionsLoading = activeLectureId
    ? examsByLectureQuery.isLoading
    : examsAllQuery.isLoading;

  const lectureOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: "전체 수업" },
      ...(lecturesQuery.data?.lectures ?? []).map((lecture) => ({
        value: lecture.id,
        label: lecture.name,
      })),
    ],
    [lecturesQuery.data?.lectures]
  );

  const examOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: "전체 시험" },
      ...examOptionsSource
        .filter((exam) => {
          if (!examSearch.trim()) return true;
          const keyword = examSearch.trim().toLowerCase();
          const title = exam.title.toLowerCase();
          const date = exam.examDate ?? "";
          return title.includes(keyword) || date.includes(keyword);
        })
        .map((exam) => ({
          value: exam.id,
          label: exam.title,
        })),
    ],
    [examOptionsSource, examSearch]
  );

  const selectedExamLabel =
    selectedExamId === ALL_VALUE
      ? "모든 시험"
      : (examOptionsSource.find((exam) => exam.id === selectedExamId)?.title ??
        "선택된 시험");

  const students = useMemo(() => {
    const items = clinicsQuery.data ?? [];
    return items.map((clinic, index) => mapClinicApiToStudent(clinic, index));
  }, [clinicsQuery.data]);

  const filteredStudents = useMemo(() => {
    const keyword = examSearch.trim().toLowerCase();
    return students.filter((student) => {
      if (statusFilter === "pending" && student.status !== "알림 예정") {
        return false;
      }

      if (statusFilter === "completed" && student.status !== "완료") {
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
  }, [students, statusFilter, examSearch]);

  const sortedStudents = useMemo(() => {
    const next = [...filteredStudents];
    const dateComparator =
      dateSort === "latest"
        ? (a: (typeof students)[number], b: (typeof students)[number]) =>
            b.failedDateSort - a.failedDateSort
        : (a: (typeof students)[number], b: (typeof students)[number]) =>
            a.failedDateSort - b.failedDateSort;

    next.sort((a, b) => {
      if (incompleteFirst) {
        const aIsDone = a.status === "완료";
        const bIsDone = b.status === "완료";
        if (aIsDone !== bIsDone) {
          return aIsDone ? 1 : -1;
        }
      }
      return dateComparator(a, b);
    });

    return next;
  }, [filteredStudents, dateSort, incompleteFirst]);

  const pagedStudents = useMemo(() => {
    const totalPage = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPage);
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedStudents]);

  const selectedIds = useMemo(() => {
    const validIds = new Set(students.map((student) => student.id));
    return selectedIdsState.filter((id) => validIds.has(id));
  }, [selectedIdsState, students]);

  const pagination = useMemo(() => {
    const totalCount = sortedStudents.length;
    const totalPage = Math.max(1, Math.ceil(totalCount / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPage);
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
  }, [currentPage, pageSize, sortedStudents.length]);

  const handleLectureChange = (value: string) => {
    setSelectedLectureId(value);
    setSelectedExamId(ALL_VALUE);
    setExamSearch("");
    setCurrentPage(1);
  };

  const handleExamChange = (value: string) => {
    setSelectedExamId(value);
    setCurrentPage(1);
  };

  const handleExamSearchChange = (value: string) => {
    setExamSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: "all" | "pending" | "completed") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSortLatest = () => {
    setDateSort((prev) => (prev === "latest" ? "oldest" : "latest"));
    setCurrentPage(1);
  };

  const handleSortIncomplete = () => {
    setIncompleteFirst((prev) => !prev);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedLectureId(ALL_VALUE);
    setSelectedExamId(ALL_VALUE);
    setExamSearch("");
    setStatusFilter("all");
    setDateSort("latest");
    setIncompleteFirst(true);
    setCurrentPage(1);
  };

  const sortSummary = `${
    incompleteFirst ? "미완료 우선" : "완료 포함"
  } · ${dateSort === "latest" ? "최신순" : "오래된순"}`;

  const isFilteredEmpty = students.length > 0 && filteredStudents.length === 0;
  const emptyMessage = isFilteredEmpty
    ? "현재 조건에 맞는 대상이 없습니다."
    : "표시할 클리닉 대상자가 없습니다.";

  const handleSelectAll = (checked: boolean) => {
    const pageIds = new Set(pagedStudents.map((student) => student.id));
    if (checked) {
      setSelectedIdsState((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedIdsState((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIdsState((prev) =>
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
    updateClinicsMutation.mutate(
      {
        clinicIds: ids,
        updates: { status: "COMPLETED" },
      },
      {
        onSuccess: () => {
          setSelectedIdsState((prev) => prev.filter((id) => !ids.includes(id)));
        },
      }
    );
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <ClinicHeader
        students={students}
        selectedIds={selectedIds}
        onSendNotification={handleMarkCompleted}
        isSending={updateClinicsMutation.isPending}
      />
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-10 rounded-lg border bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
          선택 {selectedIds.length}명 · 완료 처리 예정
        </div>
      )}
      <ClinicStats
        totalTargets={students.length}
        completedTargets={
          students.filter((student) => student.status === "완료").length
        }
      />
      <ClinicFilters
        lectureOptions={lectureOptions}
        examOptions={examOptions}
        lectureValue={selectedLectureId}
        examValue={selectedExamId}
        onLectureChange={handleLectureChange}
        onExamChange={handleExamChange}
        isLectureLoading={isLectureOptionsLoading}
        isExamLoading={isExamOptionsLoading}
        examSearch={examSearch}
        onExamSearchChange={handleExamSearchChange}
        isLectureSelected={true}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sortSummary={sortSummary}
        selectedCount={selectedIds.length}
        onMarkCompleted={handleMarkCompleted}
        isMarkingCompleted={updateClinicsMutation.isPending}
      />
      <ClinicTable
        students={pagedStudents}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        selectedExamLabel={selectedExamLabel}
        dateSort={dateSort}
        incompleteFirst={incompleteFirst}
        onSortLatest={handleSortLatest}
        onSortIncomplete={handleSortIncomplete}
        emptyMessage={emptyMessage}
        showResetButton={isFilteredEmpty}
        onResetFilters={handleResetFilters}
      />
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
