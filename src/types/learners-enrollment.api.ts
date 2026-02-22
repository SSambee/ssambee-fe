export type LearnerEnrollmentLectureEnrollmentApi = {
  id?: string;
  lectureEnrollmentId?: string;
  lectureId?: string | null;
  lecture?: {
    id: string;
    title?: string | null;
    instructorId?: string | null;
    subject?: string | null;
    schoolYear?: string | null;
    lectureTimes?: {
      id: string;
      lectureId: string;
      day: string;
      startTime: string;
      endTime: string;
    }[];
  } | null;
};

export type LearnerEnrollmentApi = {
  id: string;
  studentName?: string | null;
  studentPhone?: string | null;
  lectureEnrollments?: LearnerEnrollmentLectureEnrollmentApi[];
};
