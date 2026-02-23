import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BookOpen,
  Building2,
  Calendar,
  Edit,
  Mail,
  Phone,
  Settings,
} from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile.type";

type ProfileSummaryProps = {
  profile: Profile;
  onEditClick: () => void;
  onSettingsClick: () => void;
  onPhoneChangeClick: () => void;
};

export function ProfileSummary({
  profile,
  onEditClick,
  onSettingsClick,
  onPhoneChangeClick,
}: ProfileSummaryProps) {
  const parsedCreatedAt = profile.createdAt
    ? new Date(profile.createdAt)
    : null;

  const avatarSeedKey = profile.id || "default-profile";

  return (
    <Card className="w-full rounded-[24px] border border-[#eaecf2] bg-white">
      <CardContent className="space-y-6 p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4 md:gap-5">
            <StudentProfileAvatar
              seedKey={avatarSeedKey}
              size={48}
              sizePreset="Medium"
              label={`${profile.name}님의 프로필 아바타`}
              className="border border-[#f4f6fa]"
            />
            <div className="flex flex-col justify-center gap-1">
              <div className="flex items-end gap-2">
                <h2 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
                  {profile.name}
                </h2>
                <p className="text-base font-medium tracking-tight text-[#8b90a3]">
                  {profile.role === "INSTRUCTOR" ? "강사" : "조교"}
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
          <div className="flex h-[42px] items-center gap-3">
            <Building2 className="h-6 w-6 text-[#6b6f80]" />
            <p className="w-[88px] text-base font-medium text-[#6b6f80]">
              소속 학원
            </p>
            <p className="text-base font-medium text-[#16161b]/88">
              {profile.academyName}
            </p>
          </div>

          <div className="flex h-[42px] items-center gap-3">
            <BookOpen className="h-6 w-6 text-[#6b6f80]" />
            <p className="w-[88px] text-base font-medium text-[#6b6f80]">
              담당과목
            </p>
            <p className="text-base font-medium text-[#16161b]/88">
              {profile.subjects.length > 0 ? profile.subjects.join(", ") : "-"}
            </p>
          </div>

          <div className="flex h-[42px] items-center gap-3">
            <Mail className="h-6 w-6 text-[#6b6f80]" />
            <p className="w-[88px] text-base font-medium text-[#6b6f80]">
              Email
            </p>
            <p className="text-base font-medium text-[#16161b]/88">
              {profile.email}
            </p>
          </div>

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

          <div className="flex h-[42px] items-center gap-3 md:col-span-2">
            <Phone className="h-6 w-6 text-[#6b6f80]" />
            <p className="w-[88px] text-base font-medium text-[#6b6f80]">
              전화번호
            </p>
            <p className="text-base font-medium text-[#16161b]/88">
              {profile.phone}
            </p>
            {profile.phoneVerified && (
              <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[#16a34a]">
                인증완료
              </span>
            )}
            <Button
              variant="outline"
              onClick={onPhoneChangeClick}
              className="ml-1 h-8 rounded-[10px] border border-[#d6d9e0] bg-white px-3 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
            >
              변경
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
