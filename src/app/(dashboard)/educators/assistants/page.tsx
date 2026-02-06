"use client";

import {
  Briefcase,
  CalendarCheck,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  Paperclip,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Pagination } from "@/components/common/pagination/Pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";

const stats = [
  {
    label: "전체 배정 조교",
    value: "5",
    delta: "+1명",
    icon: Users,
    accent: "text-emerald-400",
  },
  {
    label: "현재 근무 중",
    value: "2",
    delta: "40%",
    icon: Briefcase,
    accent: "text-sky-400",
  },
  {
    label: "조교 계약서 관리",
    value: "3건",
    delta: "미제출 2건",
    icon: ClipboardList,
    accent: "text-amber-300",
  },
  {
    label: "업무 지시 내역",
    value: "128건",
    delta: "이번 주 +12건",
    icon: CalendarCheck,
    accent: "text-emerald-300",
  },
];

const statusOptions = ["근무중", "휴가", "퇴사"] as const;

type AssistantStatus = (typeof statusOptions)[number];

type Assistant = {
  id: string;
  name: string;
  subject: string;
  phone: string;
  className: string;
  task: string;
  status: AssistantStatus;
  badge: string;
};

const assistants: Assistant[] = [
  {
    id: "1",
    name: "김민수",
    subject: "수학",
    phone: "010-1234-5678",
    className: "중2 수학 심화반",
    task: "주간 테스트 채점",
    status: "근무중",
    badge: "bg-emerald-400/20 text-emerald-200",
  },
  {
    id: "2",
    name: "이진은",
    subject: "영어",
    phone: "010-9876-5432",
    className: "고1 영어 내신대비",
    task: "단어 시험 감독",
    status: "근무중",
    badge: "bg-emerald-400/20 text-emerald-200",
  },
  {
    id: "3",
    name: "박성호",
    subject: "과학",
    phone: "010-5555-4444",
    className: "초6 창의과학 실험",
    task: "업무 배정 예정",
    status: "퇴사",
    badge: "bg-slate-500/20 text-slate-300",
  },
  {
    id: "4",
    name: "최유리",
    subject: "국어",
    phone: "010-1111-2222",
    className: "중3 국어 문법특강",
    task: "학생 상담",
    status: "휴가",
    badge: "bg-amber-300/20 text-amber-100",
  },
  {
    id: "5",
    name: "정우성",
    subject: "과학",
    phone: "010-3333-7777",
    className: "고2 물리 개념완성",
    task: "업무 배정 예정",
    status: "퇴사",
    badge: "bg-slate-500/20 text-slate-300",
  },
];

const statusColorMap: Record<AssistantStatus, "green" | "yellow" | "gray"> = {
  근무중: "green",
  휴가: "yellow",
  퇴사: "gray",
};

const PAGE_LIMIT = 5;

export default function AssistantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const totalCount = assistants.length;
  const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));
  const hasNextPage = currentPage < totalPage;
  const hasPrevPage = currentPage > 1;
  const paginatedAssistants = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    return assistants.slice(startIndex, startIndex + PAGE_LIMIT);
  }, [currentPage]);

  const pagination = {
    totalCount,
    totalPage,
    currentPage,
    limit: PAGE_LIMIT,
    hasNextPage,
    hasPrevPage,
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="space-y-6">
        <Title
          title="조교 관리"
          description="배정된 조교를 조회하고 업무를 배정/평가합니다."
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild className="rounded-full">
            <Link href="/educators/assistants">조교 관리</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/educators/assistants/approval">조교 승인</Link>
          </Button>
          <Button
            className="rounded-full"
            onClick={() => setTaskModalOpen(true)}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            조교 업무 지시
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                    <p className={`mt-2 text-xs ${stat.accent}`}>
                      {stat.delta}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="조교 이름 또는 연락처 검색"
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>총 {totalCount}명의 조교</span>
          </div>

          <div className="mt-4 rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>조교명</TableHead>
                  <TableHead>담당 과목</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>배정 클래스</TableHead>
                  <TableHead>최근 업무</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssistants.map((assistant) => (
                  <TableRow key={assistant.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {assistant.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{assistant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {assistant.subject}
                      </span>
                    </TableCell>
                    <TableCell>{assistant.phone}</TableCell>
                    <TableCell>{assistant.className}</TableCell>
                    <TableCell>{assistant.task}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <StatusLabel color={statusColorMap[assistant.status]}>
                          {assistant.status}
                        </StatusLabel>
                        <Select defaultValue={assistant.status}>
                          <SelectTrigger className="h-8 w-[96px] rounded-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination pagination={pagination} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>

      <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  새 업무 지시 등록
                </DialogTitle>
                <DialogDescription className="mt-1">
                  김민수 조교에게 업무를 전달합니다.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            업무 지시는 상세 모달 기준으로 저장되어 조교에게 즉시 전달됩니다.
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">대상 조교</p>
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">김민수</p>
                <p className="text-xs text-muted-foreground">010-1234-5678</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">지시자</label>
              <Input placeholder="강사 담당자" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">업무명</label>
              <Input placeholder="예: 중등 2학년 1학기 기말고사 채점" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">업무 분류/요약</label>
              <Input placeholder="예: 고3 수능 기출 / 25문항" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">우선순위</label>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="rounded-full">
                  높음
                </Button>
                <Button className="rounded-full">보통</Button>
                <Button variant="secondary" className="rounded-full">
                  낮음
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">지시 일자</label>
              <Input type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">업무 내용</label>
            <Textarea
              placeholder="업무에 대한 상세한 내용을 입력해주세요."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">첨부파일</label>
            <label
              htmlFor="task-file"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-6 text-sm text-muted-foreground"
            >
              <Paperclip className="h-4 w-4" />
              파일 첨부 (PDF/JPG/PNG)
            </label>
            <Input id="task-file" type="file" className="hidden" />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setTaskModalOpen(false)}
            >
              취소
            </Button>
            <Button
              className="rounded-full"
              onClick={() => setTaskModalOpen(false)}
            >
              <CheckSquare className="h-4 w-4" />
              지시 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
