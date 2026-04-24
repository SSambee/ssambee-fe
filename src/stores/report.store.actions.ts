import type { ExamCommonSaveResult } from "@/services/exams/report.service";
import type { ExamStatisticsApi } from "@/types/exams";
import type { LectureStudent } from "@/types/lectures";
import type { ClassExam, ExamStudent, ReportClass } from "@/types/report";

import {
  loadReportClassSelectionResource,
  loadReportClassesResource,
  loadReportCommonMessageResource,
  loadReportExamSelectionResource,
  loadReportStudentDetailsResource,
  saveReportCommonMessageResource,
} from "./report.store.resources";

type ReportStoreStateSnapshot = {
  classes: ReportClass[];
  exams: ClassExam[];
  students: ExamStudent[];
  enrollments: LectureStudent[];
  selectedClassId: string | null;
  selectedExamId: string | null;
  selectedStudentId: string | null;
  selectedTemplate: "premium" | "simple";
  commonMessage: string;
  isCommonSaved: boolean;
  isCommonSaving: boolean;
  commonSaveResult: ExamCommonSaveResult | null;
  examStatsById: Record<string, ExamStatisticsApi | null>;
  isLoadingClasses: boolean;
  isLoadingExams: boolean;
  isLoadingStudents: boolean;
};

type ReportStoreSetState = (
  partial:
    | Partial<ReportStoreStateSnapshot>
    | ((state: ReportStoreStateSnapshot) => Partial<ReportStoreStateSnapshot>)
) => void;

type ReportStoreGetState = () => ReportStoreStateSnapshot;

export const createReportStoreActions = ({
  set,
  get,
}: {
  set: ReportStoreSetState;
  get: ReportStoreGetState;
}) => ({
  loadClasses: async () => {
    if (get().isLoadingClasses) return;

    set({ isLoadingClasses: true });

    try {
      const classes = await loadReportClassesResource();
      set({ classes });
    } catch (error) {
      console.error("수업 목록 로드 실패:", error);
      set({ classes: [] });
    } finally {
      set({ isLoadingClasses: false });
    }
  },

  selectClass: async (classId: string) => {
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
      const { exams, enrollments, nextStatsById } =
        await loadReportClassSelectionResource({
          classId,
          prevStatsById: get().examStatsById,
        });

      if (get().selectedClassId !== classId) return;

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

  selectExam: async (examId: string) => {
    set({
      selectedExamId: examId,
      selectedStudentId: null,
      students: [],
      commonMessage: "",
      isCommonSaved: false,
      commonSaveResult: null,
      isLoadingStudents: true,
    });

    const { selectedClassId, classes, enrollments, examStatsById, exams } =
      get();

    try {
      const className =
        classes.find((item) => item.id === selectedClassId)?.name ?? "";
      const selectedExamType =
        exams.find((exam) => exam.id === examId)?.examType ?? "-";

      const { students, stats } = await loadReportExamSelectionResource({
        examId,
        existingStats: examStatsById[examId],
        enrollments,
        className,
        selectedExamType,
      });

      if (get().selectedExamId !== examId) return;

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

  selectStudent: async (studentId: string) => {
    set({ selectedStudentId: studentId });

    const { selectedExamId } = get();
    if (!selectedExamId) return;

    const selectedStudent = get().students.find(
      (student) => student.id === studentId
    );
    const gradeId = selectedStudent?.gradeId;

    if (!gradeId) {
      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId ? { ...student, attendance: "-" } : student
        ),
      }));
      return;
    }

    try {
      const { attendance, questionResults, assignmentResults, academyName } =
        await loadReportStudentDetailsResource(gradeId);

      if (
        get().selectedExamId !== selectedExamId ||
        get().selectedStudentId !== studentId
      ) {
        return;
      }

      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId
            ? {
                ...student,
                academyName: academyName ?? student.academyName,
                attendance,
                questionResults,
                assignmentResults,
              }
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

  loadExamCommonMessage: async () => {
    const { selectedExamId } = get();

    if (!selectedExamId) {
      set({
        commonMessage: "",
        isCommonSaved: false,
        commonSaveResult: null,
      });
      return;
    }

    try {
      const examId = selectedExamId;
      const loadedMessage = await loadReportCommonMessageResource(examId);
      if (get().selectedExamId !== examId) return;

      const hasSavedCommonMessage = loadedMessage.trim().length > 0;

      set({
        commonMessage: loadedMessage,
        isCommonSaved: hasSavedCommonMessage,
        commonSaveResult: null,
      });
    } catch (error) {
      console.error("시험 공통 전달사항 로드 실패:", error);
      if (get().selectedExamId !== selectedExamId) return;

      set({
        commonMessage: "",
        isCommonSaved: false,
        commonSaveResult: null,
      });
    }
  },

  saveExamCommonMessage: async (message?: string) => {
    const { selectedExamId, commonMessage, selectedTemplate } = get();
    if (!selectedExamId) return null;

    const messageToSave = message ?? commonMessage;
    set({ isCommonSaving: true });

    try {
      const examId = selectedExamId;
      const result = await saveReportCommonMessageResource({
        examId,
        message: messageToSave,
        template: selectedTemplate,
      });

      if (get().selectedExamId !== examId) return result;

      const isFullyApplied =
        result.totalCount > 0 && result.updatedCount === result.totalCount;

      set({
        commonMessage: messageToSave,
        isCommonSaved: isFullyApplied,
        commonSaveResult: result,
      });

      return result;
    } catch (error) {
      console.error("시험 공통 전달사항 저장 실패:", error);
      set({
        commonMessage: messageToSave,
        isCommonSaved: false,
      });
      throw error;
    } finally {
      set({ isCommonSaving: false });
    }
  },
});
