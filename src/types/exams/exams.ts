export type ExamStatus = "진행 중" | "채점 완료";

export type ExamType = string;

export type ExamSource = string;

export type Exam = {
  id: string;
  name: string; // 과제명 (예: "리포트용 영어 모의평가")
  subtitle: string; // 시험지 유형
  type?: ExamType; // 시험지 유형
  source?: ExamSource; // 시험지 출처
  lectureName: string; // 반 이름 (예: "고2 영어 리포트반")
  registrationDate: string; // 등록일 (예: "2026. 01. 10")
  createdAt?: string; // 정렬용 원본 날짜
  status: ExamStatus; // 시험지 상태
  lectureId?: string;
  icon?: string; // 아이콘 (예: "📖", "A+")
};
