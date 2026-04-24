"use client";

import { ListFilter, Search } from "lucide-react";

import AssistantsTabs from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import type { AssistantsHistoryPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Pagination } from "@/components/common/pagination/Pagination";
import { SummaryMetricCard } from "@/components/common/SummaryMetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AssistantsHistoryLayoutProps = {
  vm: AssistantsHistoryPageViewModel;
};

export default function AssistantsHistoryLayout({
  vm,
}: AssistantsHistoryLayoutProps) {
  const summaryCards = [
    {
      id: "history-total",
      title: "전체 업무",
      subtitle: vm.isHistoryLoading ? "불러오는 중" : "전체 기간",
      value: `${vm.totalCount}건`,
      tone: "primary" as const,
    },
    {
      id: "history-progress",
      title: "진행 중",
      subtitle: vm.isHistoryLoading ? "불러오는 중" : "전체 기간",
      value: `${vm.progressCount}건`,
      tone: "secondary" as const,
    },
    {
      id: "history-completed",
      title: "완료",
      subtitle: vm.isHistoryLoading ? "불러오는 중" : "전체 기간",
      value: `${vm.completedCount}건`,
      tone: "neutral" as const,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Title
            title="업무 지시 내역 관리"
            description="조교에게 배정된 업무를 모니터링하고 진행 현황을 관리합니다."
          />
        </div>

        <AssistantsTabs active="history" />
      </div>

      <div className="flex flex-wrap items-stretch gap-4 xl:gap-5">
        {summaryCards.map((card) => (
          <SummaryMetricCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            value={card.value}
            tone={card.tone}
            className="w-full sm:w-[272px] xl:w-[300px]"
          />
        ))}
      </div>

      <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b90a3]" />
              <Input
                value={vm.searchKeyword}
                onChange={(event) => {
                  vm.setSearchKeyword(event.target.value);
                  vm.resetPagination();
                }}
                placeholder="업무 제목 또는 조교 이름으로 검색"
                className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-9 placeholder:text-[#8b90a3]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap">
              <Select
                value={vm.statusFilter}
                onValueChange={(value: (typeof vm.statusOptions)[number]) => {
                  vm.setStatusFilter(value);
                  vm.resetPagination();
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[#6b6f80] xl:w-[130px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  {vm.statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      상태: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={vm.priorityFilter}
                onValueChange={(value: (typeof vm.priorityOptions)[number]) => {
                  vm.setPriorityFilter(value);
                  vm.resetPagination();
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[#6b6f80] xl:w-[140px]">
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  {vm.priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      우선순위: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={vm.periodFilter}
                onValueChange={(value: (typeof vm.periodOptions)[number]) => {
                  vm.setPeriodFilter(value);
                  vm.resetPagination();
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[#6b6f80] xl:w-[150px]">
                  <SelectValue placeholder="기간" />
                </SelectTrigger>
                <SelectContent>
                  {vm.periodOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      기간: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-[16px] text-[#8b90a3]">
              {vm.historyError
                ? vm.historyError
                : (vm.historyNotice ?? "서버 데이터 기준으로 조회합니다.")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2 text-[20px] text-[#8b90a3]">
            <ListFilter className="h-4 w-4 text-[#8b90a3]" />
            <span>총 {vm.totalCount}건의 업무 내역</span>
          </div>

          <div className="overflow-x-auto rounded-[20px] border border-[#eaecf2] bg-white">
            <Table className="text-[18px]">
              <TableHeader className="bg-[#fcfcfd] [&_tr]:border-b-[#eaecf2]">
                <TableRow>
                  <TableHead className="h-14 text-[18px] font-semibold text-[#8b90a3]">
                    업무 제목
                  </TableHead>
                  <TableHead className="h-14 text-[18px] font-semibold text-[#8b90a3]">
                    담당 조교
                  </TableHead>
                  <TableHead className="h-14 text-[18px] font-semibold text-[#8b90a3]">
                    지시 일자
                  </TableHead>
                  <TableHead className="h-14 text-[18px] font-semibold text-[#8b90a3]">
                    우선순위
                  </TableHead>
                  <TableHead className="h-14 text-[18px] font-semibold text-[#8b90a3]">
                    상태
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.isHistoryLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-[18px] font-medium text-[#8b90a3]"
                    >
                      업무 내역을 불러오는 중입니다.
                    </TableCell>
                  </TableRow>
                ) : vm.paginatedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-[18px] font-medium text-[#8b90a3]"
                    >
                      {vm.historyError
                        ? "업무 내역을 불러오지 못했습니다."
                        : "조건에 맞는 업무 내역이 없습니다."}
                    </TableCell>
                  </TableRow>
                ) : (
                  vm.paginatedTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="border-b-[#eaecf2] hover:bg-[#fcfcfd]"
                    >
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <button
                            type="button"
                            className="cursor-pointer text-left text-[18px] font-semibold text-[#3863f6] underline-offset-2 hover:underline"
                            onClick={() => vm.setSelectedTaskId(task.id)}
                          >
                            {task.title}
                          </button>
                          {task.subtitle ? (
                            <p className="text-[18px] text-[#8b90a3]">
                              {task.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-[#4a4d5c]">
                        {task.assistantName}
                      </TableCell>
                      <TableCell className="py-4 text-[#4a4d5c]">
                        {task.issuedAt}
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3.5 py-2 text-[16px] font-medium ${vm.priorityClassMap[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusLabel
                          color={vm.statusColorMap[task.status]}
                          className="px-3.5 py-2 text-[16px]"
                        >
                          {task.status}
                        </StatusLabel>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            pagination={vm.pagination}
            onPageChange={vm.setCurrentPage}
          />

          {vm.historyError ? (
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={() => void vm.loadTaskRecords()}
              >
                다시 시도
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
