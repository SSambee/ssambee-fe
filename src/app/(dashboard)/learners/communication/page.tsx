import Link from "next/link";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";

import CommunicationStatsSVC from "./_components/stats/CommunicationStatsSVC";
import TabSectionSVC from "./_components/filter/TabSectionSVC";

export default function LearnersCommunicationPage() {
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
          <Link href="/learners/communication/create">작성하기</Link>
        </Button>
      </div>

      <CommunicationStatsSVC />

      <TabSectionSVC />
    </div>
  );
}
