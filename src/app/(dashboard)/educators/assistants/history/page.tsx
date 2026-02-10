"use client";

import {
  CalendarClock,
  ClipboardCheck,
  CheckCircle2,
  ClipboardList,
  ListFilter,
  Search,
} from "lucide-react";

import AssistantsTabs from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import { useAssistantsHistoryPage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Pagination } from "@/components/common/pagination/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AssistantsTaskHistoryPage() {
  useSetBreadcrumb([{ label: "업무 지시 내역" }]);

  const {
    statusOptions,
    priorityOptions,
    periodOptions,
    statusColorMap,
    priorityClassMap,
    priorityDetailLabelMap,
    priorityDetailClassMap,
    taskRecords,
    totalCount,
    paginatedTasks,
    progressCount,
    completedCount,
    pagination,
    selectedTask,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    periodFilter,
    setPeriodFilter,
    setCurrentPage,
    setSelectedTaskId,
    resetPagination,
  } = useAssistantsHistoryPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
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
                <p className="mt-2 text-3xl font-bold">{taskRecords.length}</p>
                <p className="mt-2 text-xs text-muted-foreground">연동 대기</p>
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
                <p className="mt-2 text-3xl font-bold">{progressCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">연동 대기</p>
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
                <p className="mt-2 text-3xl font-bold">{completedCount}</p>
                <p className="mt-2 text-xs text-muted-foreground">연동 대기</p>
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
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchKeyword}
                onChange={(event) => {
                  setSearchKeyword(event.target.value);
                  resetPagination();
                }}
                placeholder="업무 제목 또는 조교 이름으로 검색"
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap">
              <Select
                value={statusFilter}
                onValueChange={(value: (typeof statusOptions)[number]) => {
                  setStatusFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full xl:w-[130px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      상태: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(value: (typeof priorityOptions)[number]) => {
                  setPriorityFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full xl:w-[140px]">
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      우선순위: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={periodFilter}
                onValueChange={(value: (typeof periodOptions)[number]) => {
                  setPeriodFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full xl:w-[150px]">
                  <SelectValue placeholder="기간" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      기간: {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              백엔드 API 연동 대기 상태입니다.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <ListFilter className="h-4 w-4" />
            <span>총 {totalCount}건의 업무 내역</span>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>업무 제목</TableHead>
                  <TableHead>담당 조교</TableHead>
                  <TableHead>지시자</TableHead>
                  <TableHead>지시 일자</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      백엔드 API 연동 전입니다. 업무 내역 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <button
                            type="button"
                            className="text-left text-sm font-semibold text-primary underline-offset-2 hover:underline"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            {task.title}
                          </button>
                          <p className="text-xs text-muted-foreground">
                            {task.subtitle}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {task.assistantName}
                      </TableCell>
                      <TableCell>{task.instructorName}</TableCell>
                      <TableCell>{task.issuedAt}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityClassMap[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusLabel color={statusColorMap[task.status]}>
                          {task.status}
                        </StatusLabel>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination pagination={pagination} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>

      <Dialog
        open={selectedTask !== null}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
      >
        {selectedTask ? (
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 p-2 text-primary">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    업무 상세 정보
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    지시 일자 · {selectedTask.issuedAt}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="rounded-lg border bg-muted/40 px-4 py-4 text-sm">
              <div className="mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${priorityDetailClassMap[selectedTask.priority]}`}
                >
                  {priorityDetailLabelMap[selectedTask.priority]}
                </span>
              </div>
              <p className="text-lg font-bold leading-tight">
                {selectedTask.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedTask.subtitle}
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="grid gap-4 rounded-lg border bg-background px-4 py-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    담당 조교
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedTask.assistantName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    지시 일자
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedTask.issuedAt}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">업무 내용</p>
                <div className="rounded-lg border bg-background px-4 py-3 text-sm leading-relaxed">
                  {selectedTask.description}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">첨부파일</p>
                <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-5 text-center text-sm text-muted-foreground">
                  {selectedTask.attachmentCount > 0
                    ? `연결된 첨부파일 ${selectedTask.attachmentCount}개`
                    : "연결된 첨부파일이 없습니다."}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">상태</p>
                <StatusLabel color={statusColorMap[selectedTask.status]}>
                  {selectedTask.status}
                </StatusLabel>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setSelectedTaskId(null)}
              >
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
