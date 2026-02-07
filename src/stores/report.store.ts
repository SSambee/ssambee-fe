import { create } from "zustand";

import { fetchExamsByLectureAPI } from "@/services/exams/exams.service";
import {
  fetchExamGradeReportAPI,
  fetchExamGradesAPI,
} from "@/services/exams/grades.service";
import { fetchExamStatisticsAPI } from "@/services/exams/statistics.service";
import {
  fetchLectureEnrollmentsAPI,
  fetchLecturesAPI,
} from "@/services/lectures/lectures.service";
import type { ExamStatisticsApi } from "@/types/exams";
import type { LectureStudent } from "@/types/lectures";
import {
  ClassExam,
  ExamStudent,
  QuestionResult,
  ReportClass,
} from "@/types/report";
import { formatYMDFromISO } from "@/utils/date";

export type { ReportClass, ClassExam, ExamStudent };

type ReportStore = {
  classes: ReportClass[];
  exams: ClassExam[];
  students: ExamStudent[];
  enrollments: LectureStudent[];
  examStatsById: Record<string, ExamStatisticsApi | null>;
  selectedClassId: string | null;
  selectedExamId: string | null;
  selectedStudentId: string | null;
  selectedTemplate: "premium" | "simple";
  isLoadingClasses: boolean;
  isLoadingExams: boolean;
  isLoadingStudents: boolean;
  loadClasses: () => Promise<void>;
  selectClass: (classId: string) => Promise<void>;
  selectExam: (examId: string) => Promise<void>;
  selectStudent: (studentId: string) => Promise<void>;
  selectTemplate: (template: "premium" | "simple") => void;
  clearSelection: () => void;
  getSelectedStudent: () => ExamStudent | null;
};

export const useReportStore = create<ReportStore>((set, get) => ({
  classes: [],
  exams: [],
  students: [],
  enrollments: [],
  examStatsById: {},
  selectedClassId: null,
  selectedExamId: null,
  selectedStudentId: null,
  selectedTemplate: "simple",
  isLoadingClasses: false,
  isLoadingExams: false,
  isLoadingStudents: false,
  loadClasses: async () => {
    if (get().isLoadingClasses) return;
    set({ isLoadingClasses: true });
    try {
      const response = await fetchLecturesAPI({ page: 1, limit: 100 });
      const classes = response.lectures.map((lecture) => ({
        id: lecture.id,
        name: lecture.title,
      }));
      set({ classes });
    } catch (error) {
      console.error("수업 목록 로드 실패:", error);
      set({ classes: [] });
    } finally {
      set({ isLoadingClasses: false });
    }
  },
  selectClass: async (classId) => {
    set({
      selectedClassId: classId,
      selectedExamId: null,
      selectedStudentId: null,
      exams: [],
      students: [],
      enrollments: [],
      isLoadingExams: true,
      isLoadingStudents: false,
    });

    try {
      const [examsApi, enrollments] = await Promise.all([
        fetchExamsByLectureAPI(classId),
        fetchLectureEnrollmentsAPI(classId),
      ]);

      const statsEntries = await Promise.all(
        examsApi.map(async (exam) => {
          try {
            const stats = await fetchExamStatisticsAPI(exam.id);
            return { examId: exam.id, stats };
          } catch (error) {
            console.error("시험 통계 로드 실패:", exam.id, error);
            return { examId: exam.id, stats: null };
          }
        })
      );

      if (get().selectedClassId !== classId) return;

      const nextStatsById = { ...get().examStatsById };
      statsEntries.forEach(({ examId, stats }) => {
        nextStatsById[examId] = stats;
      });

      const gradeCountEntries = await Promise.all(
        examsApi.map(async (exam) => {
          const stats = nextStatsById[exam.id];
          const totalFromStats = stats?.examStats?.totalExaminees ?? 0;
          if (totalFromStats > 0) {
            return { examId: exam.id, count: totalFromStats };
          }

          try {
            const grades = await fetchExamGradesAPI(exam.id);
            return { examId: exam.id, count: grades.length };
          } catch (error) {
            console.error("시험 성적 로드 실패:", exam.id, error);
            return { examId: exam.id, count: 0 };
          }
        })
      );

      if (get().selectedClassId !== classId) return;

      const gradeCountByExamId = new Map(
        gradeCountEntries.map((entry) => [entry.examId, entry.count])
      );

      const exams: ClassExam[] = examsApi.map((exam) => {
        const stats = nextStatsById[exam.id];
        const hasStatistics =
          Boolean(stats?.studentStats?.length) ||
          (stats?.examStats?.totalExaminees ?? 0) > 0;
        const totalStudents = gradeCountByExamId.get(exam.id) ?? 0;

        return {
          id: exam.id,
          examName: exam.title,
          examDate: formatYMDFromISO(exam.examDate) ?? "-",
          totalStudents,
          hasStatistics,
        };
      });

      set({
        exams,
        enrollments,
        examStatsById: nextStatsById,
      });

      if (get().selectedClassId === classId) {
        set({ isLoadingExams: false });
      }
    } catch (error) {
      console.error("시험 목록 로드 실패:", error);
      if (get().selectedClassId !== classId) return;
      set({ exams: [], enrollments: [], isLoadingExams: false });
    }
  },
  selectExam: async (examId) => {
    set({
      selectedExamId: examId,
      selectedStudentId: null,
      students: [],
      isLoadingStudents: true,
    });

    const { selectedClassId, classes, enrollments, examStatsById } = get();

    try {
      const statsPromise = examStatsById[examId]
        ? Promise.resolve(examStatsById[examId])
        : fetchExamStatisticsAPI(examId).catch((error) => {
            console.error("시험 통계 로드 실패:", examId, error);
            return null;
          });

      const [grades, stats] = await Promise.all([
        fetchExamGradesAPI(examId),
        statsPromise,
      ]);

      if (get().selectedExamId !== examId) return;

      const className =
        classes.find((item) => item.id === selectedClassId)?.name ?? "";
      const hasValidStats =
        Boolean(stats?.studentStats?.length) &&
        (stats?.examStats?.totalExaminees ?? 0) > 0;
      const totalStudents = hasValidStats
        ? stats!.examStats.totalExaminees
        : grades.length;
      const averageScore = hasValidStats
        ? stats!.examStats.averageScore
        : grades.length > 0
          ? Math.round(
              (grades.reduce(
                (sum, grade) => sum + Number(grade.score ?? 0),
                0
              ) /
                grades.length) *
                10
            ) / 10
          : 0;
      const statsByEnrollment = new Map(
        hasValidStats
          ? stats!.studentStats.map((item) => [item.lectureEnrollmentId, item])
          : []
      );
      const rankByEnrollment = new Map<string, number>();
      const gradeEntries = grades
        .map((grade) => ({
          id:
            grade.lectureEnrollmentId ??
            grade.lectureEnrollment?.id ??
            grade.id,
          score: grade.score ?? 0,
        }))
        .sort((a, b) => b.score - a.score);
      let currentRank = 1;
      let previousScore: number | null = null;
      gradeEntries.forEach((entry, index) => {
        if (previousScore !== null && entry.score !== previousScore) {
          currentRank = index + 1;
        }
        rankByEnrollment.set(entry.id, currentRank);
        previousScore = entry.score;
      });
      const enrollmentsById = new Map(
        enrollments.map((enrollment) => [enrollment.id, enrollment])
      );

      const students: ExamStudent[] = grades.map((grade) => {
        const lectureEnrollmentId =
          grade.lectureEnrollmentId ?? grade.lectureEnrollment?.id ?? grade.id;
        const enrollment = enrollmentsById.get(lectureEnrollmentId);
        const stat = statsByEnrollment.get(lectureEnrollmentId);
        const fallbackRank = rankByEnrollment.get(lectureEnrollmentId) ?? 0;

        return {
          id: lectureEnrollmentId,
          examId,
          name:
            grade.lectureEnrollment?.enrollment?.studentName ??
            enrollment?.name ??
            "알 수 없음",
          className,
          phone:
            grade.lectureEnrollment?.enrollment?.studentPhone ??
            enrollment?.phone,
          parentPhone: enrollment?.parentPhone,
          score: grade.score ?? 0,
          rank: stat?.rank ?? fallbackRank,
          totalStudents: stat?.totalRank ?? totalStudents,
          averageScore,
          attendance: "-",
          nextClass: "-",
          memo: "",
        };
      });

      set((state) => ({
        students,
        examStatsById: {
          ...state.examStatsById,
          [examId]: stats,
        },
      }));

      if (get().selectedExamId === examId) {
        set({ isLoadingStudents: false });
      }
    } catch (error) {
      console.error("학생 성적 로드 실패:", error);
      if (get().selectedExamId !== examId) return;
      set({ students: [], isLoadingStudents: false });
    }
  },
  selectStudent: async (studentId) => {
    set(() => ({
      selectedStudentId: studentId,
    }));

    const { selectedExamId } = get();
    if (!selectedExamId) return;

    try {
      const report = await fetchExamGradeReportAPI(selectedExamId, studentId);
      if (
        get().selectedExamId !== selectedExamId ||
        get().selectedStudentId !== studentId
      ) {
        return;
      }
      const attendanceRate =
        typeof report.attendanceRate === "number"
          ? `${report.attendanceRate}%`
          : "-";
      const questionResults: QuestionResult[] =
        report.questions?.map((question) => ({
          no: question.questionNumber ?? 0,
          content: question.content ?? question.source ?? "-",
          source: question.source ?? "-",
          type: question.category ?? "-",
          ox: question.isCorrect ? "O" : "X",
          errorRate:
            typeof question.wrongRate === "number"
              ? `${question.wrongRate}%`
              : "-",
        })) ?? [];
      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId
            ? { ...student, attendance: attendanceRate, questionResults }
            : student
        ),
      }));
    } catch (error) {
      console.error("성적표 리포트 로드 실패:", error);
      if (
        get().selectedExamId !== selectedExamId ||
        get().selectedStudentId !== studentId
      ) {
        return;
      }
      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId ? { ...student, attendance: "-" } : student
        ),
      }));
    }
  },
  selectTemplate: (template) =>
    set(() => ({
      selectedTemplate: template,
    })),
  clearSelection: () =>
    set(() => ({
      selectedClassId: null,
      selectedExamId: null,
      selectedStudentId: null,
      exams: [],
      students: [],
      enrollments: [],
      examStatsById: {},
      isLoadingExams: false,
      isLoadingStudents: false,
    })),
  getSelectedStudent: () => {
    const state = get();
    if (!state.selectedStudentId || !state.selectedExamId) return null;
    const student = state.students.find(
      (s) => s.id === state.selectedStudentId
    );
    return student || null;
  },
}));
