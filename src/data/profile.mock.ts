import type { Profile, Lecture } from "@/types/profile.type";

export const mockProfile: Profile = {
  id: "1",
  name: "김진아",
  email: "jina.kim@example.com",
  phone: "010-1234-5678",
  phoneVerified: true,
  image: null,
  academyName: "대전 영어학원",
  subjects: ["영어"],
  bio: "10년 경력의 영어 전문 강사입니다.",
  createdAt: "2026-02-01T09:00:00Z",
  role: "INSTRUCTOR",
};

export const mockLectures: Lecture[] = [
  {
    id: "1",
    name: "고등 수학(상)",
    target: "고1",
    studentCount: 24,
  },
  {
    id: "2",
    name: "중등 수학 심화",
    target: "중3",
    studentCount: 18,
  },
  {
    id: "3",
    name: "수학 올림피아드 대비반",
    target: "고2-고3",
    studentCount: 12,
  },
];
