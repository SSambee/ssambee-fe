import { fetchExamsByLectureAPI } from "@/services/exams/exams.service";
import {
  fetchExamGradesAPI,
  fetchExamGradeReportAPI,
} from "@/services/exams/grades.service";
import {
  getExamCommonReport,
  saveExamCommonReport,
  type ExamCommonSaveResult,
} from "@/services/exams/report.service";
import { fetchExamStatisticsAPI } from "@/services/exams/statistics.service";
import {
  fetchLectureEnrollmentsAPI,
  fetchLecturesAPI,
} from "@/services/lectures/lectures.service";
import type { ExamStatisticsApi } from "@/types/exams";
import type { LectureStudent } from "@/types/lectures";
import type { ClassExam, ExamStudent, ReportClass } from "@/types/report";
import {
  mapClassExamsFromApi,
  mapExamStudentsFromGrades,
  mapReportDetailsToStudentFields,
} from "@/stores/report.store.mapper";

export const loadReportClassesResource = async (): Promise<ReportClass[]> => {
  const classesById = new Map<string, ReportClass>();
  const limit = 100;
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetchLecturesAPI({ page, limit });

    response.lectures.forEach((lecture) => {
      classesById.set(lecture.id, {
        id: lecture.id,
        name: lecture.title,
        instructorName: lecture.instructorName ?? null,
      });
    });

    if (response.lectures.length === 0) {
      break;
    }

    hasNextPage = response.pagination.hasNextPage;
    page += 1;
  }

  return Array.from(classesById.values());
};

export const loadReportClassSelectionResource = async ({
  classId,
  prevStatsById,
}: {
  classId: string;
  prevStatsById: Record<string, ExamStatisticsApi | null>;
}): Promise<{
  exams: ClassExam[];
  enrollments: LectureStudent[];
  nextStatsById: Record<string, ExamStatisticsApi | null>;
}> => {
  const enrollmentsPromise = fetchLectureEnrollmentsAPI(classId).catch(
    (error) => {
      console.error(
        "수강생 목록 로드 실패(시험 목록은 계속 진행):",
        classId,
        error
      );
      return [] as LectureStudent[];
    }
  );

  const [examsApi, enrollments] = await Promise.all([
    fetchExamsByLectureAPI(classId),
    enrollmentsPromise,
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

  const nextStatsById = { ...prevStatsById };
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

  const gradeCountByExamId = new Map(
    gradeCountEntries.map((entry) => [entry.examId, entry.count])
  );

  const exams = mapClassExamsFromApi({
    examsApi,
    statsByExamId: nextStatsById,
    gradeCountByExamId,
  });

  return { exams, enrollments, nextStatsById };
};

export const loadReportExamSelectionResource = async ({
  examId,
  existingStats,
  enrollments,
  className,
  selectedExamType,
}: {
  examId: string;
  existingStats: ExamStatisticsApi | null | undefined;
  enrollments: LectureStudent[];
  className: string;
  selectedExamType: string;
}): Promise<{ students: ExamStudent[]; stats: ExamStatisticsApi | null }> => {
  const statsPromise = existingStats
    ? Promise.resolve(existingStats)
    : fetchExamStatisticsAPI(examId).catch((error) => {
        console.error("시험 통계 로드 실패:", examId, error);
        return null;
      });

  const [grades, stats] = await Promise.all([
    fetchExamGradesAPI(examId),
    statsPromise,
  ]);

  const students = mapExamStudentsFromGrades({
    examId,
    grades,
    stats,
    enrollments,
    className,
    selectedExamType,
  });

  return {
    students,
    stats,
  };
};

export const loadReportStudentDetailsResource = async (gradeId: string) => {
  const report = await fetchExamGradeReportAPI(gradeId);
  return mapReportDetailsToStudentFields(report);
};

export const loadReportCommonMessageResource = async (examId: string) => {
  const report = await getExamCommonReport(examId);
  return report.message ?? "";
};

export const saveReportCommonMessageResource = async ({
  examId,
  message,
  template,
}: {
  examId: string;
  message: string;
  template: "premium" | "simple";
}): Promise<ExamCommonSaveResult> => {
  return saveExamCommonReport(examId, {
    message,
    template,
  });
};
