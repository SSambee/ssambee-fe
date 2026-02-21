import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DashboardInquiry } from "@/types/dashboard";

type DashboardInquiryTableProps = {
  inquiries: DashboardInquiry[];
};

export function DashboardInquiryTable({
  inquiries,
}: DashboardInquiryTableProps) {
  return (
    <section className="space-y-5 rounded-[24px] border border-[#eaecf2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
            최근 문의 요청사항
          </h2>
          <p className="text-base font-medium tracking-tight text-[#16161b]/28 xl:text-lg">
            최근 문의 요청을 확인하세요
          </p>
        </div>
        <Button
          variant={null}
          className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-[#b0b4c2] shadow-none transition-colors hover:bg-transparent hover:text-[#8b90a3]"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[#eaecf2]">
        <Table className="min-w-[820px]">
          <TableHeader className="bg-[#fcfcfd]">
            <TableRow className="border-[#eaecf2] hover:bg-transparent">
              <TableHead className="h-[66px] w-[400px] pl-10 text-lg font-semibold text-[#8b90a3]">
                내용
              </TableHead>
              <TableHead className="h-[66px] w-[140px] text-center text-lg font-semibold text-[#8b90a3]">
                작성자
              </TableHead>
              <TableHead className="h-[66px] w-[140px] text-center text-lg font-semibold text-[#8b90a3]">
                등록일
              </TableHead>
              <TableHead className="h-[66px] w-[140px] text-center text-lg font-semibold text-[#8b90a3]">
                상태
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="h-[72px] border-[#eaecf2] hover:bg-transparent"
              >
                <TableCell className="pl-10">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-medium text-[#16161b]/88">
                      {inquiry.message}
                    </span>
                    <span className="text-base font-bold text-[#3863f6]">
                      (1)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-lg font-medium text-[#16161b]/88">
                      {inquiry.name}
                    </span>
                    <span className="text-base text-[#16161b]/40">
                      {inquiry.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-lg font-medium text-[#16161b]/88">
                  {inquiry.createdAt}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-semibold",
                        inquiry.status === "답변 완료" ||
                          inquiry.status === "완료"
                          ? "bg-[#dcfce7] text-[#16a34a]"
                          : "bg-[#fef3c7] text-[#d97706]"
                      )}
                    >
                      {inquiry.status === "답변 완료" ||
                      inquiry.status === "완료"
                        ? "답변 등록"
                        : "대기 중"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
