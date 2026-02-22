import { ChevronRight } from "lucide-react";

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
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="준비 중"
          className="inline-flex h-auto items-center gap-1 cursor-not-allowed rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] opacity-60 transition-colors hover:bg-transparent"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            className="flex flex-col gap-1 rounded-xl border border-[#eaecf2] bg-[#fcfcfd] px-6 py-5"
          >
            <p className="text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#8b90a3]">
              {clinic.date}
            </p>
            <p className="truncate text-[16px] font-semibold leading-6 tracking-[-0.16px] text-[#4a4d5c]">
              {clinic.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
