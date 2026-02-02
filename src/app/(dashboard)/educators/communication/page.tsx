"use client";

import Link from "next/link";

import SelectBtn from "@/components/common/button/SelectBtn";
import Title from "@/components/common/header/Title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import InquiryTable from "./_components/table/InquiryTable";

const ANSWER_STATUS_OPTIONS = [
  { label: "답변 상태", value: "all" },
  { label: "미답변", value: "unanswered" },
  { label: "답변 완료", value: "answered" },
];

const REPRESENTATIVE_OPTIONS = [
  { label: "담당자", value: "all" },
  { label: "김강사", value: "instructor_01" },
  { label: "최강사", value: "instructor_02" },
  { label: "이강사", value: "instructor_03" },
];

const ANSWER_OPTIONS = [
  { label: "답변자", value: "all" },
  { label: "강사", value: "instructor" },
  { label: "조교", value: "assistant" },
];

export default function CommunicationListPage() {
  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1200px]">
      <div className="flex items-center gap-4">
        <Title
          title="소통 총괄 대시보드"
          description="학생/학부모의 문의 내역과 강사/조교가 관리합니다."
        />
      </div>

      <div className="relative">
        <Button
          variant="outline"
          className="max-w-[150px] absolute right-0 bottom-2 w-full"
        >
          <Link href="/educators/communication/create">문의 등록</Link>
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="pb-3">
              <p className="text-sm font-bold text-muted-foreground">
                누적 문의
              </p>
            </div>
            <p className="text-3xl font-bold">6</p>
            <div className="pt-3">
              <p className="text-xs font-bold text-muted-foreground">
                지난 달 기준 12.5% 증가
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="pb-3">
              <p className="text-sm font-bold text-muted-foreground">
                미답변 문의
              </p>
            </div>
            <p className="text-3xl font-bold">4</p>
            <div className="pt-3">
              <p className="text-xs font-bold text-muted-foreground">
                4건 지연 중
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="pb-3">
              <p className="text-sm font-bold text-muted-foreground">
                이번 달 답변 문의 완료
              </p>
            </div>
            <p className="text-3xl font-bold">8</p>
            <div className="pt-3">
              <p className="text-xs font-bold text-muted-foreground">
                3건 응답 진행 중
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <div className="flex items-center">
        <div className="flex gap-2 w-full">
          <Input
            className="flex-1"
            placeholder="학생명, 문의 제목으로 검색..."
          />

          <SelectBtn
            className="max-w-[120px]"
            value="all"
            placeholder="답변 상태"
            options={ANSWER_STATUS_OPTIONS}
          />

          <SelectBtn
            className="max-w-[120px]"
            value="all"
            placeholder="담당자"
            options={REPRESENTATIVE_OPTIONS}
          />

          <SelectBtn
            className="max-w-[120px]"
            value="all"
            placeholder="답변자"
            options={ANSWER_OPTIONS}
          />
        </div>
      </div>

      <InquiryTable />
    </div>
  );
}
