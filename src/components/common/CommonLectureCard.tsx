import { Clock3, Users } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CommonLectureCardProps {
  subject: string;
  schoolYear: string;
  title: string;
  scheduleDays: string;
  scheduleTime: string;
  hasSchedule: boolean;
  currentStudents?: number;
  instructorName: string;
  onClick?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function CommonLectureCard({
  subject,
  schoolYear,
  title,
  scheduleDays,
  scheduleTime,
  hasSchedule,
  currentStudents,
  instructorName,
  onClick,
  action,
  className,
}: CommonLectureCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[18px] border border-[#d6d9e0] bg-white text-[#040405] shadow-[0_0_14px_rgba(138,138,138,0.08)] transition-colors",
        onClick && "cursor-pointer hover:bg-[#fcfcfd]",
        className
      )}
      onClick={onClick}
    >
      {action && (
        <div className="absolute right-2.5 top-2.5 z-10">{action}</div>
      )}

      <CardContent className="flex-1 px-5 pb-3 pt-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-[#e1e7fe] px-3 py-1.5 text-[13px] font-semibold leading-[18px] tracking-[-0.13px] text-[#2554f5]">
            {subject}
          </span>
          <span className="inline-flex items-center rounded-lg bg-[#e9ebf0] px-3 py-1.5 text-[13px] font-semibold leading-[18px] tracking-[-0.13px] text-[#5e6275]">
            {schoolYear}
          </span>
        </div>

        <h3 className="line-clamp-1 text-[20px] font-semibold leading-7 tracking-[-0.2px]">
          {title}
        </h3>

        <div className="mt-3 space-y-1.5 text-[#6b6f80]">
          <div className="flex items-center gap-2 text-[16px] font-medium leading-6 tracking-[-0.16px]">
            <Clock3 className="h-5 w-5 shrink-0 text-[#b0b4c2]" />
            {hasSchedule ? (
              <div className="flex items-center gap-2">
                <span>{scheduleDays}</span>
                <div className="h-2 w-[1px] bg-[#d6d9e0]" />
                <span>{scheduleTime}</span>
              </div>
            ) : (
              <span>{scheduleDays}</span>
            )}
          </div>
          {typeof currentStudents === "number" && (
            <div className="flex items-center gap-2 text-[16px] font-medium leading-6 tracking-[-0.16px]">
              <Users className="h-5 w-5 shrink-0 text-[#b0b4c2]" />
              <span className="text-[#6b6f80]">{currentStudents}명</span>
            </div>
          )}
        </div>
      </CardContent>

      <div className="border-t border-[#f4f6fa] bg-white px-5 py-3">
        <div className="flex items-center gap-3 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3]">
          <StudentProfileAvatar
            size={36}
            sizePreset="Medium"
            seedKey={`${instructorName}-${title}`}
            label={`${instructorName} 프로필 이미지`}
            className="border-[1.5px] border-[#f4f6fa] bg-[#f7f8fb]"
          />
          <div className="flex items-center gap-[6px]">
            <span>담당 강사</span>
            <span>{instructorName}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
