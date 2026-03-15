import type { ProfileUpdateFormData } from "@/validation/profile.validation";
import type { Lecture, Profile } from "@/types/profile.type";
import type {
  MyProfileApiResponse,
  ProfileApiLecture,
  UpdateMyProfilePayload,
} from "@/types/profile.api";

const toSafeString = (value: string | null | undefined, fallback = "") => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

const toOptionalString = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const mapProfileRole = (userType: string): Profile["role"] => {
  return userType === "INSTRUCTOR" ? "INSTRUCTOR" : "ASSISTANT";
};

const mapLectureApiToView = (lecture: ProfileApiLecture): Lecture => {
  return {
    id: lecture.id,
    name: toSafeString(lecture.title, "강의명 미정"),
    target: toSafeString(lecture.schoolYear, "-"),
    studentCount: lecture.enrollmentCount ?? 0,
  };
};

export const mapMyProfileApiToView = (payload: MyProfileApiResponse) => {
  const profile: Profile = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phoneNumber,
    phoneVerified: payload.phoneVerified ?? false,
    image: payload.image ?? null,
    academyName: toSafeString(payload.academy, "-"),
    subjects: payload.subject ? [payload.subject] : [],
    bio: payload.bio ?? "",
    createdAt: payload.createdAt ?? "",
    role: mapProfileRole(payload.userType),
  };

  const rawLectures = payload.lectures ?? payload.instructorLectures ?? [];
  const lectures = rawLectures.map(mapLectureApiToView);

  return { profile, lectures };
};

export const mapProfileUpdateFormToApi = (
  formData: ProfileUpdateFormData,
  currentProfile: Profile
): UpdateMyProfilePayload => {
  const subjectFromForm =
    formData.subjects && formData.subjects.length > 0
      ? formData.subjects[0]
      : currentProfile.subjects[0];

  return {
    name: toOptionalString(formData.name),
    academy: toOptionalString(formData.academyName),
    subject: toOptionalString(subjectFromForm),
  };
};
