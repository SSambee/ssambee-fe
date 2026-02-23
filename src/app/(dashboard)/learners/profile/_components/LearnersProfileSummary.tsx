import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Edit, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <Avatar className="size-24 border-2 border-neutral-50">
              <AvatarImage
                src={profile.image || undefined}
                alt={profile.name}
              />
              <AvatarFallback className="bg-neutral-50 text-2xl text-neutral-400">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-800">
                  {profile.name}
                </h1>
                <p className="text-sm text-neutral-400">
                  | {roleLabelMap[profile.userType]}
                </p>
              </div>
              <div className="flex flex-col text-sm text-neutral-600 gap-1">
                {profile.userType === "STUDENT" ? (
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-neutral-400" />
                    <span>
                      {profile.school} / {profile.schoolYear}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-neutral-400" />
                    <span>자녀 {profile.children.length}명 연동</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span>
                    가입일:{" "}
                    {parsedCreatedAt !== null &&
                    !Number.isNaN(parsedCreatedAt.getTime())
                      ? format(parsedCreatedAt, "yyyy년 MM월 dd일", {
                          locale: ko,
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={onEditClick} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              프로필 수정
            </Button>
            <Button onClick={onSettingsClick} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              설정 및 보안
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
