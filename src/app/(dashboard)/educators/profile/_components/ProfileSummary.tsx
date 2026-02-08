import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Building2, BookOpen, Calendar, Edit, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile.type";

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
                  | {profile.role === "INSTRUCTOR" ? "강사" : "조교"}
                </p>
              </div>
              <div className="flex flex-col text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-neutral-400" />
                  <span>{profile.academyName}</span>|
                  <BookOpen className="h-4 w-4 text-neutral-400" />
                  <span>{profile.subjects.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span>
                    가입일:{" "}
                    {format(new Date(profile.createdAt), "yyyy년 MM월 dd일", {
                      locale: ko,
                    })}
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
