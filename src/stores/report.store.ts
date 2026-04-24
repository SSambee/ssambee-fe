import { create } from "zustand";

import type { ExamCommonSaveResult } from "@/services/exams/report.service";
import type { ExamStatisticsApi } from "@/types/exams";
import type { LectureStudent } from "@/types/lectures";
import { ClassExam, ExamStudent, ReportClass } from "@/types/report";

import { createReportStoreActions } from "./report.store.actions";

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
  commonMessage: string;
  isCommonSaved: boolean;
  isCommonSaving: boolean;
  commonSaveResult: ExamCommonSaveResult | null;
  isLoadingClasses: boolean;
  isLoadingExams: boolean;
  isLoadingStudents: boolean;
  loadClasses: () => Promise<void>;
  selectClass: (classId: string) => Promise<void>;
  selectExam: (examId: string) => Promise<void>;
  selectStudent: (studentId: string) => Promise<void>;
  selectTemplate: (template: "premium" | "simple") => void;
  loadExamCommonMessage: () => Promise<void>;
  setCommonMessage: (message: string) => void;
  saveExamCommonMessage: (
    message?: string
  ) => Promise<ExamCommonSaveResult | null>;
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
  commonMessage: "",
  isCommonSaved: false,
  isCommonSaving: false,
  commonSaveResult: null,
  isLoadingClasses: false,
  isLoadingExams: false,
  isLoadingStudents: false,

  ...createReportStoreActions({
    set: set as Parameters<typeof createReportStoreActions>[0]["set"],
    get: get as Parameters<typeof createReportStoreActions>[0]["get"],
  }),

  selectTemplate: (template) =>
    set(() => ({
      selectedTemplate: template,
    })),

  setCommonMessage: (message) => {
    set({
      commonMessage: message,
      isCommonSaved: false,
      commonSaveResult: null,
    });
  },

  clearSelection: () =>
    set(() => ({
      selectedClassId: null,
      selectedExamId: null,
      selectedStudentId: null,
      exams: [],
      students: [],
      enrollments: [],
      examStatsById: {},
      commonMessage: "",
      isCommonSaved: false,
      isCommonSaving: false,
      commonSaveResult: null,
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
