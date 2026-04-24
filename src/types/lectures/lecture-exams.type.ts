// 리스트 및 차트
export type LectureExamResult = {
  examId: string;
  examName: string;
  examDate: string; // YYYY-MM-DD
  subject: string; // 과목
  score: number; // 점수
  classAverage: number; // 학급 평균
  classRank: number; // 학급 석차
  totalStudents: number; // 반 인원
};

// mock
export type LectureExamDetail = {
  lectureId: string;
  lectureName: string;
  studentId: string;
  studentName: string;
  exams: LectureExamResult[];
};
