import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { LearnerProfile } from "@/types/learners-profile.type";

type LearnersBasicInfoProps = {
  profile: LearnerProfile;
  onPhoneChangeClick: () => void;
};

export function LearnersBasicInfo({
  profile,
  onPhoneChangeClick,
}: LearnersBasicInfoProps) {
  return (
    <Card className="w-full rounded-[24px] border border-[#eaecf2] bg-white">
      <CardContent className="flex flex-col justify-center space-y-6 p-5 sm:p-6">
        <h3 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
          기본 정보
        </h3>
        <div>
          <Label className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#6b6f80]">
            이름
          </Label>
          <p className="mt-1 text-base font-medium text-[#16161b]/88">
            {profile.name}
          </p>
        </div>
        <div>
          <Label className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#6b6f80]">
            이메일
          </Label>
          <div className="mt-1 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#8b90a3]" />
            <p className="text-base font-medium text-[#16161b]/88">
              {profile.email}
            </p>
          </div>
        </div>
        <div>
          <Label className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#6b6f80]">
            휴대폰 번호
          </Label>
          <div className="mt-1 flex flex-col gap-3 rounded-[12px] border border-[#d6d9e0] bg-[#f7f8fa] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#8b90a3]" />
              <p className="text-base font-medium text-[#16161b]/88">
                {profile.phone}
              </p>
              {profile.phoneVerified && (
                <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[#16a34a]">
                  인증완료
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={onPhoneChangeClick}
              className="h-8 rounded-[10px] border border-[#d6d9e0] bg-white px-3 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
            >
              변경
            </Button>
          </div>
        </div>

        {profile.userType === "STUDENT" ? (
          <div>
            <Label className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#6b6f80]">
              학부모 연락처
            </Label>
            <div className="mt-1 flex items-center gap-2 rounded-[12px] border border-[#d6d9e0] bg-[#f7f8fa] p-4">
              <Phone className="h-4 w-4 text-[#8b90a3]" />
              <p className="text-base font-medium text-[#16161b]/88">
                {profile.parentPhone || "-"}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
