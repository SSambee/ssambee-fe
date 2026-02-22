import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Building2, BookOpen, Calendar, Edit, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile.type";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";

type ProfileSummaryProps = {
  profile: Profile;
  onEditClick: () => void;
  onSettingsClick: () => void;
};

export function ProfileSummary({
  profile,
  onEditClick,
  onSettingsClick,
}: ProfileSummaryProps) {
  const parsedCreatedAt = profile.createdAt
    ? new Date(profile.createdAt)
    : null;
  const hasValidCreatedAt =
    parsedCreatedAt !== null && !Number.isNaN(parsedCreatedAt.getTime());

  const avatarSeedKey = profile.id || "default-profile";

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <StudentProfileAvatar
              seedKey={avatarSeedKey}
              size={96}
              sizePreset="Large"
              label={`${profile.name}님의 프로필 아바타`}
              className="border-2 border-neutral-50 shadow-sm"
            />
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-800">
                  {profile.name}
                </h1>
                <p className="text-sm text-neutral-400">
                  | {profile.role === "INSTRUCTOR" ? "강사" : "조교"}
                </p>
              </div>
              <div className="flex flex-col text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-neutral-400" />
                  <span>{profile.academyName}</span>|
                  {profile.subjects.length > 0 ? (
                    <>
                      <BookOpen className="h-4 w-4 text-neutral-400" />
                      <span>{profile.subjects.join(", ")}</span>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span>
                    가입일:{" "}
                    {hasValidCreatedAt
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
