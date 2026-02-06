"use client";

import { useMemo, useState } from "react";

import { useExamsAll } from "@/hooks/exams/useExamsAll";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { useClinicsList } from "@/hooks/clinics/useClinicsList";
import { useUpdateClinics } from "@/hooks/clinics/useUpdateClinics";
import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { mapClinicApiToStudent } from "@/services/exams/clinics.mapper";

import { ClinicHeader } from "./_components/ClinicHeader";
import { ClinicStats } from "./_components/ClinicStats";
import { ClinicFilters } from "./_components/ClinicFilters";
import { ClinicTable } from "./_components/ClinicTable";

export default function ClinicPage() {
  const ALL_VALUE = "all";
  const [selectedLectureId, setSelectedLectureId] = useState<string>(ALL_VALUE);
  const [selectedExamId, setSelectedExamId] = useState<string>(ALL_VALUE);
  const [selectedIdsState, setSelectedIdsState] = useState<string[]>([]);

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

  const examOptionsSource = useMemo(
    () =>
      activeLectureId
        ? (examsByLectureQuery.data ?? [])
        : (examsAllQuery.data ?? []),
    [activeLectureId, examsAllQuery.data, examsByLectureQuery.data]
  );

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
      { value: ALL_VALUE, label: "모든 시험" },
      ...examOptionsSource.map((exam) => ({
        value: exam.id,
        label: exam.title,
      })),
    ],
    [examOptionsSource]
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

  const selectedIds = useMemo(() => {
    const validIds = new Set(students.map((student) => student.id));
    return selectedIdsState.filter((id) => validIds.has(id));
  }, [selectedIdsState, students]);

  const handleLectureChange = (value: string) => {
    setSelectedLectureId(value);
    setSelectedExamId(ALL_VALUE);
  };

  const handleExamChange = (value: string) => {
    setSelectedExamId(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIdsState(
        Array.from(new Set(students.map((student) => student.id)))
      );
    } else {
      setSelectedIdsState([]);
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
        selectedCount={selectedIds.length}
        onMarkCompleted={handleMarkCompleted}
        isMarkingCompleted={updateClinicsMutation.isPending}
      />
      <ClinicTable
        students={students}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        selectedExamLabel={selectedExamLabel}
      />
    </div>
  );
}
