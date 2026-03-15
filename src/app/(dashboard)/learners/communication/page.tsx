import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import TabSectionSVC from "./_components/filter/TabSectionSVC";

export default function LearnersCommunicationPage() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          소통 관리 대시보드
        </h1>
        <p className="mt-[6px] text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          나의 문의 내역을 관리하고 공지를 확인합니다.
        </p>
      </section>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="default"
            className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
            asChild
          >
            <Link href="/learners/communication/create">작성하기</Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          }
        >
          <TabSectionSVC />
        </Suspense>
      </div>
    </div>
  );
}
