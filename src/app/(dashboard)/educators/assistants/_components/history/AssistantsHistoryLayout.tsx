"use client";

import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ListFilter,
  Search,
} from "lucide-react";

import AssistantsTabs from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import type { AssistantsHistoryPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Pagination } from "@/components/common/pagination/Pagination";
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 업무</p>
                <p className="mt-2 text-3xl font-bold">{vm.totalCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {vm.isHistoryLoading ? "불러오는 중" : "전체 기간"}
                </p>
              </div>
              <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                <CalendarClock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">진행 중</p>
                <p className="mt-2 text-3xl font-bold">{vm.progressCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {vm.isHistoryLoading ? "불러오는 중" : "전체 기간"}
                </p>
              </div>
              <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="mt-2 text-3xl font-bold">{vm.completedCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {vm.isHistoryLoading ? "불러오는 중" : "전체 기간"}
                </p>
              </div>
              <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={vm.searchKeyword}
                onChange={(event) => {
                  vm.setSearchKeyword(event.target.value);
                  vm.resetPagination();
                }}
                placeholder="업무 제목 또는 조교 이름으로 검색"
                className="pl-9"
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
                <SelectTrigger className="w-full xl:w-[130px]">
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
                <SelectTrigger className="w-full xl:w-[140px]">
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
                <SelectTrigger className="w-full xl:w-[150px]">
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

            <div className="text-xs text-muted-foreground">
              {vm.historyError
                ? vm.historyError
                : (vm.historyNotice ?? "서버 데이터 기준으로 조회합니다.")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <ListFilter className="h-4 w-4" />
            <span>총 {vm.totalCount}건의 업무 내역</span>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>업무 제목</TableHead>
                  <TableHead>담당 조교</TableHead>
                  <TableHead>지시 일자</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.isHistoryLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      업무 내역을 불러오는 중입니다.
                    </TableCell>
                  </TableRow>
                ) : vm.paginatedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      {vm.historyError
                        ? "업무 내역을 불러오지 못했습니다."
                        : "조건에 맞는 업무 내역이 없습니다."}
                    </TableCell>
                  </TableRow>
                ) : (
                  vm.paginatedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <button
                            type="button"
                            className="cursor-pointer text-left text-sm font-semibold text-primary underline-offset-2 hover:underline"
                            onClick={() => vm.setSelectedTaskId(task.id)}
                          >
                            {task.title}
                          </button>
                          {task.subtitle ? (
                            <p className="text-xs text-muted-foreground">
                              {task.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {task.assistantName}
                      </TableCell>
                      <TableCell>{task.issuedAt}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${vm.priorityClassMap[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusLabel color={vm.statusColorMap[task.status]}>
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
                className="rounded-full"
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
