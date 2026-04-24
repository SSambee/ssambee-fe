"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GradingPageHeaderProps = {
  examName: string;
  lectureName: string;
  examSubtitle: string;
};

export function GradingPageHeader({
  examName,
  lectureName,
  examSubtitle,
}: GradingPageHeaderProps) {
  const router = useRouter();

  return (
    <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
            학생 답안 입력 및 채점 관리
          </h1>
          <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
            {examName} · {lectureName}
          </p>
          <p className="text-[13px] font-semibold leading-5 tracking-[-0.13px] text-[#8b90a3]">
            {examSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="current">
            <SelectTrigger className="h-11 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[14px] font-medium text-[#4a4d5c] sm:w-[320px]">
              <SelectValue placeholder="시험 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">
                {examName} · {lectureName}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-11 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </div>
      </div>
    </section>
  );
}
