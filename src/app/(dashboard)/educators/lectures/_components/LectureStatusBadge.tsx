"use client";

import { LECTURE_STATUS_BADGE_CLASSES } from "@/constants/lectures.constants";
import { LectureStatus } from "@/types/lectures";

type LectureStatusBadgeProps = {
  status: LectureStatus;
};

export function LectureStatusBadge({ status }: LectureStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[13px] font-semibold leading-[18px] tracking-[-0.13px] ${LECTURE_STATUS_BADGE_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}
