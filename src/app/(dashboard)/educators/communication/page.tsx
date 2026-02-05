import Link from "next/link";

import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";

import CommunicationStats from "./_components/stats/CommunicationStats";
import TabSection from "./_components/filter/TabSection";

export default function CommunicationListPage() {
  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between gap-4">
        <Title
          title="소통 관리 대시보드"
          description="학생/학부모의 문의 내역과 강사/조교가 관리합니다."
        />

        <Button
          variant="outline"
          className="max-w-[180px] h-[50px] w-full rounded-lg text-base cursor-pointer"
          asChild
        >
          <Link href="/educators/communication/create">작성하기</Link>
        </Button>
      </div>

      {/* 통계 */}
      <CommunicationStats />

      {/* 탭 & 필터 & 테이블 */}
      <TabSection />
    </div>
  );
}
