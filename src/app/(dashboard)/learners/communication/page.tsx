import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";

import TabSectionSVC from "./_components/filter/TabSectionSVC";

export default function LearnersCommunicationPage() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between gap-4">
        <Title
          title="소통 관리 대시보드"
          description="나의 문의 내역을 관리하고 공지를 확인합니다."
        />

        <Button
          variant="outline"
          className="max-w-[180px] h-[50px] w-full rounded-lg text-base cursor-pointer"
          asChild
        >
          <Link href="/learners/communication/create">작성하기</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[550px]">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        }
      >
        <TabSectionSVC />
      </Suspense>
    </div>
  );
}
