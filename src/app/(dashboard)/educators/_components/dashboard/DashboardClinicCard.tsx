import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { Button } from "@/components/ui/button";
import { DashboardClinicItem } from "@/types/dashboard";

type DashboardClinicCardProps = {
  clinics: DashboardClinicItem[];
};

export function DashboardClinicCard({ clinics }: DashboardClinicCardProps) {
  return (
    <div className="w-full rounded-[24px] border border-[#eaecf2] bg-white px-6 pb-8 pt-8 shadow-none sm:pl-8 xl:w-[440px]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-bold leading-7 tracking-[-0.2px] text-[#040405]">
            클리닉
          </h2>
          <p className="text-[14px] font-medium leading-5 tracking-[-0.14px] text-[rgba(22,22,27,0.28)]">
            예정된 클리닉 일정을 확인하세요
          </p>
        </div>
        <Button
          variant={null}
          asChild
          aria-label="클리닉 페이지로 이동"
          className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#8b90a3] shadow-none transition-colors hover:bg-transparent hover:text-[#4a4d5c]"
        >
          <Link href="/educators/exams/clinic">
            더보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            className="flex flex-col gap-2 rounded-xl border border-[#eaecf2] bg-[#fcfcfd] px-6 py-5"
          >
            <p className="text-[14px] font-semibold leading-5 tracking-[-0.14px] text-[#8b90a3]">
              {clinic.date}
            </p>
            <p className="truncate text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#4a4d5c]">
              {clinic.title}
            </p>

            {(clinic.studentName || clinic.meta) && (
              <div className="flex items-center justify-between gap-2">
                {clinic.studentName ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <StudentProfileAvatar
                      size={24}
                      seedKey={clinic.studentName}
                      label={`${clinic.studentName} 프로필 이미지`}
                    />
                    <p className="truncate text-[13px] font-medium leading-5 tracking-[-0.13px] text-[#7f8494]">
                      {clinic.studentName}
                    </p>
                  </div>
                ) : (
                  <span />
                )}

                {clinic.meta ? (
                  <span className="inline-flex shrink-0 items-center rounded-full border border-[#e4e7ee] bg-white px-2.5 py-0.5 text-[12px] font-medium leading-4 tracking-[-0.12px] text-[#8b90a3]">
                    {clinic.meta}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
