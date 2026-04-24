import {
  fetchEnrollmentLectureEnrollmentsSVC,
  fetchMyEnrollmentsSVC,
} from "@/services/SVC/enrollments.service";
import type { LearnerEnrollmentApi } from "@/types/learners-enrollment.api";

type ResolveLectureEnrollmentInput = {
  lectureId: string;
  learnerPhone?: string;
  learnerName?: string;
  enrollments?: LearnerEnrollmentApi[];
};

type ResolveLectureEnrollmentResult = {
  lectureEnrollmentId: string | null;
  enrollmentId: string | null;
};

export type LectureEnrollmentResolutionMap = Record<
  string,
  {
    enrollmentId: string;
    lectureEnrollmentId: string;
  }
>;

const normalizePhone = (value?: string) => (value ?? "").replace(/\D/g, "");

const matchesLearner = ({
  studentPhone,
  studentName,
  learnerPhone,
  learnerName,
}: {
  studentPhone?: string;
  studentName?: string;
  learnerPhone?: string;
  learnerName?: string;
}) => {
  const normalizedLearnerPhone = normalizePhone(learnerPhone);
  const normalizedStudentPhone = normalizePhone(studentPhone);

  if (normalizedLearnerPhone && normalizedStudentPhone) {
    return normalizedLearnerPhone === normalizedStudentPhone;
  }

  const normalizedLearnerName = (learnerName ?? "").trim();
  const normalizedStudentName = (studentName ?? "").trim();

  if (normalizedLearnerName && normalizedStudentName) {
    return normalizedLearnerName === normalizedStudentName;
  }

  return false;
};

export const buildLectureEnrollmentResolutionMap = ({
  enrollments,
  learnerPhone,
  learnerName,
}: {
  enrollments: LearnerEnrollmentApi[];
  learnerPhone?: string;
  learnerName?: string;
}): LectureEnrollmentResolutionMap => {
  const resolutionMap: LectureEnrollmentResolutionMap = {};

  const hasLearnerIdentity = Boolean(
    normalizePhone(learnerPhone) || (learnerName ?? "").trim()
  );

  for (const enrollment of enrollments) {
    const enrollmentPhone = enrollment.studentPhone ?? undefined;
    const enrollmentName = enrollment.studentName ?? undefined;
    const hasEnrollmentIdentity = Boolean(
      normalizePhone(enrollmentPhone) || (enrollmentName ?? "").trim()
    );

    const isMatchedLearner = hasLearnerIdentity
      ? hasEnrollmentIdentity
        ? matchesLearner({
            studentPhone: enrollmentPhone,
            studentName: enrollmentName,
            learnerPhone,
            learnerName,
          })
        : true
      : true;

    if (!isMatchedLearner) {
      continue;
    }

    for (const lectureEnrollment of enrollment.lectureEnrollments ?? []) {
      const rawLectureEnrollment = lectureEnrollment as {
        id?: string;
        lectureEnrollmentId?: string;
      };
      const lectureId =
        lectureEnrollment.lectureId ?? lectureEnrollment.lecture?.id;
      const lectureEnrollmentId =
        rawLectureEnrollment.id ?? rawLectureEnrollment.lectureEnrollmentId;

      if (!lectureId || !lectureEnrollmentId) {
        continue;
      }

      if (!resolutionMap[lectureId]) {
        resolutionMap[lectureId] = {
          enrollmentId: enrollment.id,
          lectureEnrollmentId,
        };
      }
    }
  }

  return resolutionMap;
};

const resolveFromEnrollmentList = async ({
  lectureId,
  enrollments,
  learnerPhone,
  learnerName,
}: {
  lectureId: string;
  enrollments: LearnerEnrollmentApi[];
  learnerPhone?: string;
  learnerName?: string;
}): Promise<ResolveLectureEnrollmentResult | null> => {
  const hasLearnerIdentity = Boolean(
    normalizePhone(learnerPhone) || (learnerName ?? "").trim()
  );

  for (const enrollment of enrollments) {
    const enrollmentPhone = enrollment.studentPhone ?? undefined;
    const enrollmentName = enrollment.studentName ?? undefined;
    const hasEnrollmentIdentity = Boolean(
      normalizePhone(enrollmentPhone) || (enrollmentName ?? "").trim()
    );

    const isMatchedLearner = hasLearnerIdentity
      ? hasEnrollmentIdentity
        ? matchesLearner({
            studentPhone: enrollmentPhone,
            studentName: enrollmentName,
            learnerPhone,
            learnerName,
          })
        : true
      : true;

    if (!isMatchedLearner) {
      continue;
    }

    const lectureEnrollments =
      enrollment.lectureEnrollments && enrollment.lectureEnrollments.length > 0
        ? enrollment.lectureEnrollments
        : await fetchEnrollmentLectureEnrollmentsSVC(enrollment.id);

    const matchedLectureEnrollment = lectureEnrollments.find(
      (lectureEnrollment) => {
        const itemLectureId =
          lectureEnrollment.lectureId ?? lectureEnrollment.lecture?.id;
        return itemLectureId === lectureId;
      }
    );

    if (
      matchedLectureEnrollment?.id ||
      matchedLectureEnrollment?.lectureEnrollmentId
    ) {
      return {
        lectureEnrollmentId:
          matchedLectureEnrollment.id ??
          matchedLectureEnrollment.lectureEnrollmentId ??
          null,
        enrollmentId: enrollment.id,
      };
    }
  }

  return null;
};

export const resolveLectureEnrollmentFromLectureId = async ({
  lectureId,
  learnerPhone,
  learnerName,
  enrollments,
}: ResolveLectureEnrollmentInput): Promise<ResolveLectureEnrollmentResult> => {
  const sourceEnrollments = enrollments ?? (await fetchMyEnrollmentsSVC());
  const mappedByEnrollments = buildLectureEnrollmentResolutionMap({
    enrollments: sourceEnrollments,
    learnerPhone,
    learnerName,
  });

  const resolvedByEnrollments = mappedByEnrollments[lectureId];

  if (resolvedByEnrollments) {
    return {
      lectureEnrollmentId: resolvedByEnrollments.lectureEnrollmentId,
      enrollmentId: resolvedByEnrollments.enrollmentId,
    };
  }

  const resolvedByEnrollmentDetail = await resolveFromEnrollmentList({
    lectureId,
    enrollments: sourceEnrollments,
    learnerPhone,
    learnerName,
  });

  if (resolvedByEnrollmentDetail) {
    return resolvedByEnrollmentDetail;
  }

  return {
    lectureEnrollmentId: null,
    enrollmentId: null,
  };
};
