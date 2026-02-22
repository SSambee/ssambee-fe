import type { LearnerRole } from "@/types/auth.type";

export type LearnerProfileApiInstructor = {
  instructorId: string;
  instructorName: string;
  academy?: string | null;
  subject?: string | null;
};

export type LearnerProfileApiChild = {
  id: string;
  name: string;
  phoneNumber: string;
};

type LearnerProfileApiBase = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: LearnerRole;
  createdAt?: string | null;
  image?: string | null;
  phoneVerified?: boolean | null;
};

export type StudentMyProfileApiResponse = LearnerProfileApiBase & {
  userType: "STUDENT";
  school?: string | null;
  schoolYear?: string | null;
  parentPhoneNumber?: string | null;
  instructors?: LearnerProfileApiInstructor[];
};

export type ParentMyProfileApiResponse = LearnerProfileApiBase & {
  userType: "PARENT";
  children?: LearnerProfileApiChild[];
};

export type LearnerMyProfileApiResponse =
  | StudentMyProfileApiResponse
  | ParentMyProfileApiResponse;

export type UpdateLearnerMyProfilePayload = {
  name?: string;
  school?: string;
  schoolYear?: string;
  parentPhoneNumber?: string | null;
};
