import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Edit, School, Settings, UserRound } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LearnerProfile } from "@/types/learners-profile.type";

type LearnersProfileSummaryProps = {
  profile: LearnerProfile;
  onEditClick: () => void;
  onSettingsClick: () => void;
};

const roleLabelMap = {
  STUDENT: "학생",
  PARENT: "학부모",
} as const;

export function LearnersProfileSummary({
  profile,
  onEditClick,
  onSettingsClick,
}: LearnersProfileSummaryProps) {
  const parsedCreatedAt = profile.createdAt
    ? new Date(profile.createdAt)
    : null;

  return (
    <Card className="w-full rounded-[24px] border border-[#eaecf2] bg-white">
      <CardContent className="space-y-6 p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4 md:gap-5">
            <StudentProfileAvatar
              size={48}
              sizePreset="Medium-2"
              seedKey={profile.id || profile.name}
              label={`${profile.name} 프로필 이미지`}
              className="border border-[#f4f6fa]"
            />
            <div className="flex flex-col justify-center gap-1">
              <div className="flex items-end gap-2">
                <h2 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
                  {profile.name}
                </h2>
                <p className="text-base font-medium tracking-tight text-[#8b90a3]">
                  {roleLabelMap[profile.userType]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onEditClick}
              variant="outline"
              className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
            >
              <Edit className="mr-2 h-5 w-5" />
              프로필 수정
            </Button>
            <Button
              onClick={onSettingsClick}
              variant="outline"
              className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
            >
              <Settings className="mr-2 h-5 w-5" />
              설정 및 보안
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {profile.userType === "STUDENT" ? (
            <div className="flex h-[42px] items-center gap-3">
              <School className="h-6 w-6 text-[#6b6f80]" />
              <p className="w-[88px] text-base font-medium text-[#6b6f80]">
                학교/학년
              </p>
              <p className="text-base font-medium text-[#16161b]/88">
                {profile.school} / {profile.schoolYear}
              </p>
            </div>
          ) : (
            <div className="flex h-[42px] items-center gap-3">
              <UserRound className="h-6 w-6 text-[#6b6f80]" />
              <p className="w-[88px] text-base font-medium text-[#6b6f80]">
                연동 자녀
              </p>
              <p className="text-base font-medium text-[#16161b]/88">
                {profile.children.length}명
              </p>
            </div>
          )}

          <div className="flex h-[42px] items-center gap-3">
            <Calendar className="h-6 w-6 text-[#6b6f80]" />
            <p className="w-[88px] text-base font-medium text-[#6b6f80]">
              가입일
            </p>
            <p className="text-base font-medium text-[#16161b]/88">
              {parsedCreatedAt !== null &&
              !Number.isNaN(parsedCreatedAt.getTime())
                ? format(parsedCreatedAt, "yy. MM. dd", { locale: ko })
                : "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
