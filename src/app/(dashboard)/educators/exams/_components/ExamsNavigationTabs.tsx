"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationTabs = [
  { label: "시험 관리", href: "/educators/exams" },
  { label: "시험 등록/수정", href: "/educators/exams/create" },
  { label: "클리닉", href: "/educators/exams/clinic" },
  { label: "미니테스트", href: "/educators/exams/mini-tests" },
  { label: "성적표 발송", href: "/educators/exams/report" },
] as const;

export function ExamsNavigationTabs() {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === "/educators/exams") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {navigationTabs.map((tab) => {
        const isActive = isTabActive(tab.href);
        return (
          <Button
            key={tab.href}
            variant="outline"
            className={cn(
              "h-10 rounded-full px-4 text-[13px] font-semibold",
              isActive
                ? "border-[#3863f6] bg-[#3863f6] text-white hover:bg-[#2f57e8] hover:text-white"
                : "border-[#d6d9e0] bg-white text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
            )}
            asChild
          >
            <Link href={tab.href}>{tab.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
