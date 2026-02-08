import { Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types/profile.type";

type BasicInfoProps = {
  profile: Profile;
  onPhoneChangeClick: () => void;
};

export function BasicInfo({ profile, onPhoneChangeClick }: BasicInfoProps) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-6 flex flex-col justify-center">
        <h3 className="text-lg font-semibold">기본 정보</h3>
        <div>
          <Label className="text-sm text-neutral-400">이름</Label>
          <p className="mt-1 text-[#2c3142]">{profile.name}</p>
        </div>
        <div>
          <Label className="text-sm text-neutral-400">이메일</Label>
          <div className="mt-1 flex items-center gap-2">
            <Mail className="h-4 w-4 text-neutral-400" />
            <p className="text-neutral-800">{profile.email}</p>
          </div>
        </div>
        <div>
          <Label className="text-sm text-neutral-400">휴대폰 번호</Label>
          <div className="mt-1 flex flex-col gap-3 rounded-lg bg-neutral-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-neutral-400" />
              <p className="text-neutral-800">{profile.phone}</p>
              {profile.phoneVerified && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  인증됨
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={onPhoneChangeClick}
              className="cursor-pointer"
            >
              번호 변경
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
