/**
 * Lectures Mapper 함수
 * - API 응답 → View 타입 변환
 * - View 타입 → API 요청 변환
 */
import { formatDateYMD } from "@/utils/date";
import { DAY_ORDER } from "@/constants/lectures.constants";
import type {
  Lecture,
  LectureStatus,
  LectureStudent,
  LectureTime,
} from "@/types/lectures";
import type {
  LectureApi,
  LectureApiStatus,
  LectureDetailApi,
  LectureTimeApi,
} from "@/types/lectures";

// ============================================
// Status Mappers
// ============================================
export const mapLectureStatusToView = (
  status?: LectureApiStatus | null
): LectureStatus | undefined => {
  if (!status) return undefined;

  const statusMap: Record<LectureApiStatus, LectureStatus> = {
    SCHEDULED: "개강전",
    IN_PROGRESS: "진행중",
    COMPLETED: "완료",
  };

  return statusMap[status];
};

export const mapLectureStatusToApi = (
  status?: LectureStatus | null
): LectureApiStatus | undefined => {
  if (!status) return undefined;

  const statusMap: Record<LectureStatus, LectureApiStatus> = {
    개강전: "SCHEDULED",
    진행중: "IN_PROGRESS",
    완료: "COMPLETED",
  };

  return statusMap[status];
};

// ============================================
// Schedule Mappers
// ============================================
export const buildScheduleFromTimes = (
  lectureTimes?: LectureTimeApi[]
): Lecture["schedule"] => {
  if (!lectureTimes || lectureTimes.length === 0) {
    return { days: [], time: "일정 없음" };
  }

  const days = Array.from(
    new Set(lectureTimes.map((time) => time.day).filter(Boolean))
  ).sort((a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99));

  const [first] = lectureTimes;
  const hasValidTime = first.startTime && first.endTime;
  const isSameTime = lectureTimes.every(
    (time) =>
      time.startTime === first.startTime && time.endTime === first.endTime
  );
  const time = !hasValidTime
    ? "시간 미지정"
    : isSameTime
      ? `${first.startTime} - ${first.endTime}`
      : "시간표 상이";

  return { days, time };
};

// ============================================
// Student Mappers
// ============================================
export const parseSchoolWithSchoolYear = (
  schoolLabel: string
): { school: string; schoolYear: string } => {
  const value = schoolLabel?.trim() ?? "";
  if (!value) return { school: "-", schoolYear: "-" };

  const parts = value.split(" ");
  if (parts.length === 1) return { school: value, schoolYear: "-" };

  const schoolYear = parts.pop() ?? "-";
  return { school: parts.join(" "), schoolYear };
};

// ============================================
// Lecture Mappers
// ============================================
export const mapLectureApiToView = (lecture: LectureApi): Lecture => {
  const startDate = formatDateYMD(lecture.startAt);
  const lectureTimes: LectureTime[] =
    lecture.lectureTimes?.map((time) => ({
      day: time.day,
      startTime: time.startTime,
      endTime: time.endTime,
    })) ?? [];

  return {
    id: lecture.id,
    name: lecture.title,
    subject: lecture.subject ?? "과목 미지정",
    schoolYear: lecture.schoolYear ?? "미지정",
    instructor: lecture.instructorName ?? "미지정",
    currentStudents: lecture.enrollmentsCount ?? 0,
    maxStudents: 0,
    schedule: buildScheduleFromTimes(lecture.lectureTimes),
    lectureTimes,
    startDate,
    status: mapLectureStatusToView(lecture.status),
  };
};

export const mapLectureDetailApiToView = (
  payload: LectureDetailApi
): Lecture => {
  const students: LectureStudent[] =
    payload?.students?.map((student) => {
      const { school, schoolYear } = parseSchoolWithSchoolYear(student.school);
      return {
        id: student.id,
        name: student.name,
        school,
        schoolYear,
        phone: student.phone,
        parentPhone: student.parentPhone,
      };
    }) ?? [];

  return {
    ...mapLectureApiToView(payload),
    students,
  };
};
