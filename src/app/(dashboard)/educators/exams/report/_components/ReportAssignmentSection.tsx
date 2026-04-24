"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReportAssignmentSection() {
  return (
    <Button
      asChild
      variant="outline"
      className="h-full min-h-16 w-full gap-2 rounded-[20px] border border-[#eaecf2] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] shadow-none hover:bg-[#fcfcfd] hover:text-[#5e6275]"
    >
      <Link href="/educators/exams/mini-tests">
        <ListChecks className="h-4 w-4" />
        미니테스트로 이동
      </Link>
    </Button>
  );
}
