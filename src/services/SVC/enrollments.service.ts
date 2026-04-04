import { axiosClientSVC } from "@/shared/common/api/axiosClient";
import type { ApiResponse } from "@/types/api";
import type { LectureEnrollmentDetail } from "@/types/students.type";
import type {
  LearnerEnrollmentApi,
  LearnerEnrollmentLectureEnrollmentApi,
} from "@/types/learners-enrollment.api";

type EnrollmentsPayload =
  | LearnerEnrollmentApi[]
  | {
      enrollments?: LearnerEnrollmentApi[];
      list?: LearnerEnrollmentApi[];
    };

export type SvcGradeDetail = {
  studentName: string;
  score: number;
  rank: number;
  average: number;
  examTitle: string;
  examCategory: string;
  assignmentResults: {
    assignmentId: string;
    title: string;
    categoryName: string;
    resultLabel: string;
  }[];
  questionStatistics: {
    questionNumber: number;
    score: number;
    correctRate: number;
  }[];
  questionDetails: {
    questionNumber: number;
    type: string;
    category: string;
    source: string;
    isCorrect: boolean | null;
  }[];
};

type FetchByChildOptions = {
  childId?: string;
};

const getLectureDetailPath = (
  lectureEnrollmentId: string,
  options?: FetchByChildOptions
) => {
  if (options?.childId) {
    return `/children/${options.childId}/enrollments/lectures/${lectureEnrollmentId}`;
  }

  return `/lectures/${lectureEnrollmentId}`;
};

const getGradeDetailPath = (gradeId: string, options?: FetchByChildOptions) => {
  if (options?.childId) {
    return `/children/${options.childId}/grades/${gradeId}`;
  }

  return `/grades/${gradeId}`;
};

const getEnrollmentsPath = (options?: FetchByChildOptions) => {
  if (options?.childId) {
    return `/children/${options.childId}/enrollments`;
  }

  return "/enrollments";
};

const getEnrollmentLectureEnrollmentsPath = (
  enrollmentId: string,
  options?: FetchByChildOptions
) => {
  if (options?.childId) {
    return `/children/${options.childId}/enrollments/${enrollmentId}`;
  }

  return `/enrollments/${enrollmentId}`;
};

const resolveAssignmentResultLabel = (
  itemRecord: Record<string, unknown> | null
): string => {
  if (!itemRecord) {
    return "-";
  }

  const directLabel = asString(itemRecord.resultLabel);
  if (directLabel) {
    return directLabel;
  }

  const resultIndex =
    typeof itemRecord.resultIndex === "number" ? itemRecord.resultIndex : null;
  const resultPresets = Array.isArray(itemRecord.resultPresets)
    ? itemRecord.resultPresets
    : [];

  if (resultIndex !== null && resultPresets[resultIndex]) {
    return asString(resultPresets[resultIndex], "-");
  }

  return "-";
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
};

const isLectureEnrollmentDetailRecord = (value: unknown): boolean => {
  const record = asRecord(value);

  if (!record) {
    return false;
  }

  return Array.isArray(record.grades) && Boolean(asRecord(record.lecture));
};

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeEnrollmentStatus = (
  value: unknown
): "ACTIVE" | "PAUSED" | "DROPPED" => {
  if (value === "PAUSED" || value === "DROPPED") {
    return value;
  }

  return "ACTIVE";
};

const normalizeAttendanceStatus = (
  value: unknown
): "PRESENT" | "LATE" | "ABSENT" | "EARLY_LEAVE" => {
  if (
    value === "PRESENT" ||
    value === "LATE" ||
    value === "ABSENT" ||
    value === "EARLY_LEAVE"
  ) {
    return value;
  }

  return "PRESENT";
};

const normalizeLectureEnrollmentDetail = (
  payload: unknown
): LectureEnrollmentDetail => {
  const payloadRecord = asRecord(payload);
  const detailRecord = isLectureEnrollmentDetailRecord(payloadRecord)
    ? payloadRecord
    : asRecord(payloadRecord?.enrollment);

  if (!detailRecord || !isLectureEnrollmentDetailRecord(detailRecord)) {
    throw new Error("강의 상세 응답 형식이 올바르지 않습니다.");
  }

  const lectureRecord = asRecord(detailRecord.lecture);
  const instructorRecord = asRecord(lectureRecord?.instructor);
  const instructorUserRecord = asRecord(instructorRecord?.user);
  const enrollmentRecord = asRecord(detailRecord.enrollment);
  const attendancesRecord = Array.isArray(detailRecord.attendances)
    ? detailRecord.attendances
    : [];
  const gradesRecord = Array.isArray(detailRecord.grades)
    ? detailRecord.grades
    : [];

  const normalizedAttendances: NonNullable<
    LectureEnrollmentDetail["attendances"]
  > = attendancesRecord.map((item, index) => {
    const attendanceRecord = asRecord(item);

    return {
      id: asString(attendanceRecord?.id, `attendance-${index}`),
      date: asString(attendanceRecord?.date),
      status: normalizeAttendanceStatus(attendanceRecord?.status),
      memo:
        typeof attendanceRecord?.memo === "string" ||
        attendanceRecord?.memo === null
          ? attendanceRecord.memo
          : null,
    };
  });

  const normalizedGrades: LectureEnrollmentDetail["grades"] = gradesRecord.map(
    (item) => {
      const itemRecord = asRecord(item);
      const examRecord = asRecord(itemRecord?.exam);
      const gradeRecord = asRecord(itemRecord?.grade);

      return {
        gradeId: asString(
          itemRecord?.gradeId,
          asString(itemRecord?.id, asString(gradeRecord?.id))
        ),
        exam: {
          id: asString(examRecord?.id, asString(itemRecord?.examId)),
          title: asString(
            examRecord?.title,
            asString(itemRecord?.examTitle, "시험")
          ),
          examType: asString(
            examRecord?.examType,
            asString(examRecord?.category, asString(itemRecord?.examType))
          ),
          examDate: asString(
            examRecord?.examDate,
            asString(itemRecord?.examDate)
          ),
          subject: asString(examRecord?.subject, asString(itemRecord?.subject)),
          average: asNumber(
            examRecord?.average,
            asNumber(examRecord?.averageScore, asNumber(itemRecord?.average))
          ),
          totalExaminees: asNumber(
            examRecord?.totalExaminees,
            asNumber(
              examRecord?.gradesCount,
              asNumber(itemRecord?.totalExaminees)
            )
          ),
        },
        grade: {
          score: asNumber(gradeRecord?.score, asNumber(itemRecord?.score)),
          rank: asNumber(gradeRecord?.rank, asNumber(itemRecord?.rank)),
        },
      };
    }
  );

  return {
    lectureEnrollmentId: asString(
      detailRecord.lectureEnrollmentId,
      asString(detailRecord.id)
    ),
    attendanceRate:
      typeof detailRecord.attendanceRate === "number" &&
      Number.isFinite(detailRecord.attendanceRate)
        ? detailRecord.attendanceRate
        : null,
    attendances: normalizedAttendances,
    lecture: {
      title: asString(lectureRecord?.title, "강의 상세"),
      instructor: {
        name: asString(
          instructorRecord?.name,
          asString(instructorUserRecord?.name, "담당 강사")
        ),
      },
      subject: asString(lectureRecord?.subject),
      schoolYear: asString(lectureRecord?.schoolYear),
    },
    enrollment: {
      name: asString(
        enrollmentRecord?.name,
        asString(enrollmentRecord?.studentName, "-")
      ),
      school: asString(enrollmentRecord?.school, "-"),
      status: normalizeEnrollmentStatus(enrollmentRecord?.status),
    },
    grades: normalizedGrades,
  };
};

const normalizeEnrollments = (
  payload: EnrollmentsPayload
): LearnerEnrollmentApi[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.enrollments)) {
    return payload.enrollments;
  }

  if (Array.isArray(payload.list)) {
    return payload.list;
  }

  return [];
};

export const fetchMyEnrollmentsSVC = async (): Promise<
  LearnerEnrollmentApi[]
> => {
  const { data } =
    await axiosClientSVC.get<ApiResponse<unknown>>(getEnrollmentsPath());

  if (Array.isArray(data.data)) {
    return normalizeEnrollments(data.data as EnrollmentsPayload);
  }

  const payload = asRecord(data.data);

  if (!payload) {
    return [];
  }

  return normalizeEnrollments(payload as EnrollmentsPayload);
};

export const fetchMyChildEnrollmentsSVC = async (
  childId: string
): Promise<LearnerEnrollmentApi[]> => {
  const { data } = await axiosClientSVC.get<ApiResponse<unknown>>(
    getEnrollmentsPath({ childId })
  );

  if (Array.isArray(data.data)) {
    return normalizeEnrollments(data.data as EnrollmentsPayload);
  }

  const payload = asRecord(data.data);

  if (!payload) {
    return [];
  }

  return normalizeEnrollments(payload as EnrollmentsPayload);
};

export const fetchLectureEnrollmentDetailSVC = async (
  lectureEnrollmentId: string,
  options?: FetchByChildOptions
): Promise<LectureEnrollmentDetail> => {
  const { data } = await axiosClientSVC.get<ApiResponse<unknown>>(
    getLectureDetailPath(lectureEnrollmentId, options)
  );

  return normalizeLectureEnrollmentDetail(data.data);
};

export const fetchGradeDetailSVC = async (
  gradeId: string,
  options?: FetchByChildOptions
): Promise<SvcGradeDetail> => {
  const { data } = await axiosClientSVC.get<ApiResponse<unknown>>(
    getGradeDetailPath(gradeId, options)
  );
  const dataRecord = asRecord(data.data);
  const gradeRecord =
    asRecord(dataRecord?.grade) ?? (dataRecord ? dataRecord : null);

  if (!gradeRecord) {
    throw new Error("성적 상세 응답 형식이 올바르지 않습니다.");
  }

  const questionsRecord = Array.isArray(gradeRecord.questions)
    ? gradeRecord.questions
    : [];
  const questionStatisticsRecord = Array.isArray(gradeRecord.questionStatistics)
    ? gradeRecord.questionStatistics
    : questionsRecord;
  const questionDetailsRecord = Array.isArray(gradeRecord.questionDetails)
    ? gradeRecord.questionDetails
    : questionsRecord;
  const assignmentsRecord = Array.isArray(gradeRecord.assignmentResults)
    ? gradeRecord.assignmentResults
    : Array.isArray(gradeRecord.assignments)
      ? gradeRecord.assignments
      : [];

  return {
    studentName: asString(gradeRecord.studentName),
    score: asNumber(gradeRecord.score),
    rank: asNumber(gradeRecord.rank),
    average: asNumber(gradeRecord.average),
    examTitle: asString(gradeRecord.examTitle),
    examCategory: asString(gradeRecord.examCategory),
    assignmentResults: assignmentsRecord.map((item, index) => {
      const itemRecord = asRecord(item);

      return {
        assignmentId: asString(
          itemRecord?.assignmentId,
          asString(itemRecord?.id, `assignment-${index}`)
        ),
        title: asString(itemRecord?.title, "과제"),
        categoryName: asString(itemRecord?.categoryName, "카테고리"),
        resultLabel: resolveAssignmentResultLabel(itemRecord),
      };
    }),
    questionStatistics: questionStatisticsRecord.map((item) => {
      const itemRecord = asRecord(item);

      return {
        questionNumber: asNumber(itemRecord?.questionNumber),
        score: asNumber(itemRecord?.score),
        correctRate: asNumber(itemRecord?.correctRate),
      };
    }),
    questionDetails: questionDetailsRecord.map((item) => {
      const itemRecord = asRecord(item);

      return {
        questionNumber: asNumber(itemRecord?.questionNumber),
        type: asString(itemRecord?.type),
        category: asString(itemRecord?.category),
        source: asString(itemRecord?.source),
        isCorrect:
          typeof itemRecord?.isCorrect === "boolean"
            ? itemRecord.isCorrect
            : null,
      };
    }),
  };
};

export const fetchEnrollmentLectureEnrollmentsSVC = async (
  enrollmentId: string,
  options?: FetchByChildOptions
): Promise<LearnerEnrollmentLectureEnrollmentApi[]> => {
  const { data } = await axiosClientSVC.get<
    ApiResponse<{
      lectureEnrollments?: LearnerEnrollmentLectureEnrollmentApi[];
    }>
  >(getEnrollmentLectureEnrollmentsPath(enrollmentId, options));
  const payload = asRecord(data.data);

  if (!payload) {
    return [];
  }

  return Array.isArray(payload.lectureEnrollments)
    ? (payload.lectureEnrollments as LearnerEnrollmentLectureEnrollmentApi[])
    : [];
};
