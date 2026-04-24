"use client";

import { useMemo, useState } from "react";

import { useLecturesList } from "@/hooks/lectures/useLecturesList";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { useExamsAll } from "@/hooks/exams/useExamsAll";
import { mapExamApiToView } from "@/services/exams/exams.mapper";

export const useExamsPage = () => {
  const { data: lecturesData, isPending: isLecturesPending } = useLecturesList({
    page: 1,
    limit: 100,
  });
  const lectures = lecturesData?.lectures ?? [];

  const [selectedLectureId, setSelectedLectureId] = useState("all");
  const isAllSelected = selectedLectureId === "all";
  const activeLectureId = isAllSelected
    ? "all"
    : selectedLectureId &&
        lectures.some((lecture) => lecture.id === selectedLectureId)
      ? selectedLectureId
      : (lectures[0]?.id ?? "");

  const selectedLecture = isAllSelected
    ? undefined
    : lectures.find((lecture) => lecture.id === activeLectureId);

  const { data: examsAll = [], isPending: isExamsAllPending } =
    useExamsAll(isAllSelected);

  const { data: examsByLecture = [], isPending: isExamsByLecturePending } =
    useExamsByLecture(isAllSelected ? "" : activeLectureId);

  const examsData = isAllSelected ? examsAll : examsByLecture;

  const exams = useMemo(() => {
    return examsData.map((exam) =>
      mapExamApiToView(exam, selectedLecture?.name ?? "수업 미지정")
    );
  }, [examsData, selectedLecture?.name]);

  return {
    lectures,
    exams,
    activeLectureId,
    setSelectedLectureId,
    isLoading:
      isLecturesPending ||
      (isAllSelected ? isExamsAllPending : isExamsByLecturePending),
    isLecturesPending,
    isExamsPending: isAllSelected ? isExamsAllPending : isExamsByLecturePending,
  };
};
