"use client";

import { useEffect } from "react";

import { getStudentReport } from "@/services/exams/report.service";
import { fetchLectureEnrollmentDetailAPI } from "@/services/lectures/lectures.service";
import { formatYMDFromISO } from "@/utils/date";

import type { ReportTemplateExamData } from "../_types/report-template";

import type { PremiumReportTemplateState } from "./usePremiumReportTemplateState";

const formatMonthDay = (iso?: string | null) => {
  const ymd = formatYMDFromISO(iso);
  if (!ymd) return "";
  const [, month, day] = ymd.split("-");
  return `${Number(month)}/${Number(day)}`;
};

export const usePremiumReportTemplateResources = ({
  examData,
  state,
}: {
  examData: ReportTemplateExamData;
  state: PremiumReportTemplateState;
}) => {
  const {
    setScoreHistory,
    setIsScoreHistoryLoading,
    setIsStudentSaved,
    setIsEditing,
    setReviewTest,
    setHomeworkWord,
    setHomeworkTask,
    setHomeworkExtra,
    setPersonalMessage,
  } = state;

  useEffect(() => {
    let cancelled = false;

    const loadScoreHistory = async () => {
      if (!examData.studentId) {
        setScoreHistory([]);
        return;
      }

      setIsScoreHistoryLoading(true);
      try {
        const detail = await fetchLectureEnrollmentDetailAPI(
          examData.studentId
        );
        const mapped = detail.grades
          .map((item) => ({
            round: formatMonthDay(item.exam.examDate) || item.exam.title,
            score: item.grade.score,
            sortKey: item.exam.examDate
              ? new Date(item.exam.examDate).getTime()
              : 0,
          }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ round, score }) => ({ round, score }));

        if (!cancelled) {
          setScoreHistory(mapped);
        }
      } catch (error) {
        console.error("성적 추이 로드 실패:", error);
        if (!cancelled) {
          setScoreHistory([]);
        }
      } finally {
        if (!cancelled) {
          setIsScoreHistoryLoading(false);
        }
      }
    };

    void loadScoreHistory();

    return () => {
      cancelled = true;
    };
  }, [examData.studentId, setIsScoreHistoryLoading, setScoreHistory]);

  useEffect(() => {
    let cancelled = false;

    const loadStudentReport = async () => {
      if (!examData.examId || !examData.studentId || !examData.gradeId) {
        setIsStudentSaved(false);
        setIsEditing(false);
        return;
      }

      setIsStudentSaved(false);
      setIsEditing(false);

      try {
        const studentReport = await getStudentReport(examData.gradeId);
        if (cancelled) return;

        setReviewTest(studentReport.reviewTest ?? "");
        setHomeworkWord(studentReport.homeworkWord ?? "");
        setHomeworkTask(studentReport.homeworkTask ?? "");
        setHomeworkExtra(studentReport.homeworkExtra ?? "");
        setPersonalMessage(studentReport.weaknessType ?? "");

        const hasSavedStudentData = Boolean(
          (studentReport.reviewTest ?? "").trim() ||
          (studentReport.homeworkWord ?? "").trim() ||
          (studentReport.homeworkTask ?? "").trim() ||
          (studentReport.homeworkExtra ?? "").trim() ||
          (studentReport.weaknessType ?? "").trim() ||
          (studentReport.attendanceRate ?? "").trim()
        );

        setIsStudentSaved(hasSavedStudentData);
        setIsEditing(!hasSavedStudentData);
      } catch (error) {
        console.error("학생 리포트 로드 실패:", error);
        if (cancelled) return;
        setIsStudentSaved(false);
        setIsEditing(false);
      }
    };

    void loadStudentReport();

    return () => {
      cancelled = true;
    };
  }, [
    examData.examId,
    examData.studentId,
    examData.gradeId,
    setHomeworkExtra,
    setHomeworkTask,
    setHomeworkWord,
    setIsEditing,
    setIsStudentSaved,
    setPersonalMessage,
    setReviewTest,
  ]);
};
