import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const typeBadgeClasses = {
  학생: "bg-emerald-100 text-emerald-700",
  학부모: "bg-sky-100 text-sky-700",
} as const;

const statusBadgeClasses = {
  "진행 중": "bg-amber-100 text-amber-700",
  대기: "bg-slate-100 text-slate-700",
  완료: "bg-emerald-100 text-emerald-700",
  "답변 완료": "bg-indigo-100 text-indigo-700",
} as const;

export function DashboardInquiryTable({
  inquiries,
}: DashboardInquiryTableProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                최근 문의 요청 사항 (학생/학부모)
              </p>
              <p className="text-xs text-muted-foreground">
                최근 문의 요청을 확인하세요
              </p>
            </div>
          </div>
          <Button variant="outline" className="h-8 px-3 text-xs" disabled>
            전체보기
          </Button>
        </div>

        <div className="mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">구분</TableHead>
                <TableHead className="w-[120px]">이름</TableHead>
                <TableHead>문의 내용</TableHead>
                <TableHead className="w-[120px]">등록일</TableHead>
                <TableHead className="w-[100px]">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        typeBadgeClasses[inquiry.type]
                      )}
                    >
                      {inquiry.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {inquiry.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {inquiry.createdAt}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        statusBadgeClasses[inquiry.status]
                      )}
                    >
                      {inquiry.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
