import type { LearnerRole } from "@/types/auth.type";

export type LearnerInstructor = {
  id: string;
  name: string;
  academyName: string;
  subject: string;
};

export type LearnerChild = {
  id: string;
  name: string;
  phone: string;
};

export type LearnerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentPhone: string;
  image: string | null;
  phoneVerified: boolean;
  userType: LearnerRole;
  createdAt: string;
  school: string;
  schoolYear: string;
  instructors: LearnerInstructor[];
  children: LearnerChild[];
};
