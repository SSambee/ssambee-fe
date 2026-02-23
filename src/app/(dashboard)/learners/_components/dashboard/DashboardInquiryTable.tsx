"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { formatYMDFromISO } from "@/utils/date";
import { LearnersDashboardResponse } from "@/types/dashboard/learnersDashboard";

type DashboardInquiryTableProps = {
  announcements: LearnersDashboardResponse["announcements"];
};

export function DashboardInquiryTable({
  announcements,
}: DashboardInquiryTableProps) {
  const router = useRouter();

  const moveToAnnouncementDetail = (communicationId: string) => {
    router.push(`/learners/communication/${communicationId}?type=notice`);
  };

  return (
    <section className="space-y-5 rounded-[24px] border border-[#eaecf2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-neutral-700 xl:text-2xl">
            최근 공지사항
          </h2>
          <p className="text-base font-medium tracking-tight text-label-alternative xl:text-lg">
            최근 공지사항을 확인하세요
          </p>
        </div>
        <Button
          variant={null}
          asChild
          aria-label="공지사항 페이지로 이동"
          className="h-auto rounded-full px-2 py-1 text-[13px] font-medium leading-5 text-neutral-400 shadow-none transition-colors hover:bg-transparent hover:text-neutral-700"
        >
          <Link href="/learners/communication">
            더보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-neutral-100">
        <Table className="min-w-[600px]">
          <TableHeader className="bg-surface-elevated-light">
            <TableRow className="border-neutral-100 hover:bg-transparent">
              <TableHead className="h-[66px] w-[400px] pl-10 text-lg font-semibold text-neutral-400">
                제목
              </TableHead>
              <TableHead className="h-[66px] w-[200px] text-center text-lg font-semibold text-neutral-400">
                등록일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => {
              return (
                <TableRow
                  key={announcement.id}
                  tabIndex={0}
                  onClick={() => moveToAnnouncementDetail(announcement.id)}
                  className="h-[72px] cursor-pointer border-neutral-100 hover:bg-surface-normal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset"
                >
                  <TableCell className="pl-10">
                    <span
                      className="block max-w-[360px] truncate text-lg font-medium text-label-normal"
                      title={announcement.title}
                    >
                      {announcement.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-lg font-medium text-label-normal">
                    {formatYMDFromISO(announcement.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
