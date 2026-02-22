import type { LearnerEnrollmentLectureEnrollmentApi } from "@/types/learners-enrollment.api";
import type {
  AttendanceList,
  LectureEnrollmentDetail,
} from "@/types/students.type";

export type LearnerLectureCardVM = {
  id: string;
  enrollmentId: string;
  lectureEnrollmentId: string | null;
  title: string;
  instructorId: string;
  lectureTimes: {
    id: string;
    lectureId: string;
    day: string;
    startTime: string;
    endTime: string;
  }[];
};

export const toLearnerLectureCard = ({
  enrollmentId,
  lectureEnrollment,
}: {
  enrollmentId: string;
  lectureEnrollment: LearnerEnrollmentLectureEnrollmentApi;
}): LearnerLectureCardVM | null => {
  const lectureId =
    lectureEnrollment.lectureId ?? lectureEnrollment.lecture?.id;

  if (!lectureId) {
    return null;
  }

  return {
    id: lectureId,
    enrollmentId,
    lectureEnrollmentId:
      lectureEnrollment.id ?? lectureEnrollment.lectureEnrollmentId ?? null,
    title: lectureEnrollment.lecture?.title ?? "제목 없는 강의",
    instructorId: lectureEnrollment.lecture?.instructorId ?? "",
    lectureTimes: (lectureEnrollment.lecture?.lectureTimes ?? []).map(
      (lectureTime) => ({
        id: lectureTime.id,
        lectureId: lectureTime.lectureId,
        day: lectureTime.day,
        startTime: lectureTime.startTime,
        endTime: lectureTime.endTime,
      })
    ),
  };
};

export const summarizeLectureAttendances = (
  attendances: LectureEnrollmentDetail["attendances"]
) => {
  const safeAttendances = attendances ?? [];
  const totalCount = safeAttendances.length;
  const lateCount = safeAttendances.filter(
    (attendance) => attendance.status === "LATE"
  ).length;
  const absentCount = safeAttendances.filter(
    (attendance) => attendance.status === "ABSENT"
  ).length;

  const presentCount = safeAttendances.filter(
    (attendance) => attendance.status !== "ABSENT"
  ).length;

  const attendanceRate =
    totalCount > 0 ? (presentCount / totalCount) * 100 : null;

  const records: AttendanceList[] = safeAttendances.map((attendance) => ({
    date: attendance.date,
    status: attendance.status,
    memo: attendance.memo ?? null,
  }));

  return {
    totalCount,
    lateCount,
    absentCount,
    attendanceRate,
    records,
  };
};

export const sortAttendanceRecordsDesc = (records: AttendanceList[]) => {
  records.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
};
