import type { LearnersProfileUpdateFormData } from "@/validation/learners-profile.validation";
import type {
  LearnerMyProfileApiResponse,
  UpdateLearnerMyProfilePayload,
} from "@/types/learners-profile.api";
import type { LearnerProfile } from "@/types/learners-profile.type";

const toSafeString = (value: string | null | undefined, fallback = "-") => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

const toOptionalString = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const toEditableString = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "";
};

export const mapLearnerMyProfileApiToView = (
  payload: LearnerMyProfileApiResponse
): LearnerProfile => {
  const instructors =
    payload.userType === "STUDENT"
      ? (payload.instructors ?? []).map((instructor) => ({
          id: instructor.instructorId,
          name: toSafeString(instructor.instructorName),
          academyName: toSafeString(instructor.academy),
          subject: toSafeString(instructor.subject),
        }))
      : [];

  const children =
    payload.userType === "PARENT"
      ? (payload.children ?? []).map((child) => ({
          id: child.id,
          name: toSafeString(child.name),
          phone: toSafeString(child.phoneNumber),
        }))
      : [];

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phoneNumber,
    parentPhone:
      payload.userType === "STUDENT"
        ? toEditableString(payload.parentPhoneNumber)
        : "",
    image: payload.image ?? null,
    phoneVerified: payload.phoneVerified ?? false,
    userType: payload.userType,
    createdAt: payload.createdAt ?? "",
    school: payload.userType === "STUDENT" ? toSafeString(payload.school) : "-",
    schoolYear:
      payload.userType === "STUDENT" ? toSafeString(payload.schoolYear) : "-",
    instructors,
    children,
  };
};

export const mapLearnersProfileUpdateFormToApi = (
  formData: LearnersProfileUpdateFormData,
  currentProfile: LearnerProfile
): UpdateLearnerMyProfilePayload => {
  const payload: UpdateLearnerMyProfilePayload = {
    name: toOptionalString(formData.name),
  };

  if (currentProfile.userType === "STUDENT") {
    payload.school = toOptionalString(formData.school);
    payload.schoolYear = toOptionalString(formData.schoolYear);
    const trimmedParentPhoneNumber = formData.parentPhoneNumber?.trim();
    payload.parentPhoneNumber =
      trimmedParentPhoneNumber && trimmedParentPhoneNumber.length > 0
        ? trimmedParentPhoneNumber
        : null;
  }

  return payload;
};
