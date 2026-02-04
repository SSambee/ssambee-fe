"use client";

import { ReactNode } from "react";

import { Lecture } from "@/types/lectures";
import { LectureStatusBadge } from "@/app/(dashboard)/educators/lectures/_components/LectureStatusBadge";

type InfoItemProps = {
  label: string;
  value: ReactNode;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

type LectureDetailInfoProps = {
  lecture: Lecture;
};

export function LectureDetailInfo({ lecture }: LectureDetailInfoProps) {
  const items: InfoItemProps[] = [
    { label: "과목", value: lecture.subject },
    { label: "학년", value: lecture.schoolYear },
    { label: "담당 강사", value: lecture.instructor },
  ];

  if (lecture.assistant) {
    items.push({ label: "담당 조교", value: lecture.assistant });
  }

  if (lecture.startDate) {
    items.push({ label: "개강일", value: lecture.startDate });
  }

  if (lecture.status) {
    items.push({
      label: "수업 상태",
      value: <LectureStatusBadge status={lecture.status} />, // status is checked
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <InfoItem key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
