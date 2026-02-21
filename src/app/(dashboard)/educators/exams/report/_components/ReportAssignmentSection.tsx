"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReportAssignmentSection() {
  return (
    <Button asChild className="w-full gap-2">
      {/* TODO: [BE-준비] assignmentResults 연동 안정화 후 성적표 화면의 인라인 입력 플로우 재연결 */}
      <Link href="/educators/exams/mini-tests">
        <ListChecks className="h-4 w-4" />
        미니테스트로 이동
      </Link>
    </Button>
  );
}
