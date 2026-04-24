import Link from "next/link";

import { cn } from "@/lib/utils";
import { DashboardStat } from "@/types/dashboard";

type DashboardStatCardsProps = {
  stats: DashboardStat[];
};

const statHrefByKey: Record<DashboardStat["key"], string> = {
  students: "/educators/students",
  lectures: "/educators/lectures",
  exams: "/educators/exams",
};

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {stats.slice(0, 3).map((stat, index) => {
        const isPrimary = index === 0;
        const isSecondary = index === 1;
        const isTertiary = index === 2;
        const href = statHrefByKey[stat.key];

        return (
          <Link
            key={stat.id}
            href={href}
            aria-label={`${stat.label} 페이지로 이동`}
            className="block rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b72f7] focus-visible:ring-offset-2"
          >
            <div
              className={cn(
                "flex h-[160px] w-full items-end justify-between rounded-[24px] border border-[#eaecf2] px-8 pb-6 pt-8 transition-transform hover:-translate-y-0.5 xl:px-10",
                isPrimary && "bg-[#4b72f7]",
                isSecondary && "bg-[#6b6f80]",
                isTertiary && "bg-white"
              )}
            >
              <div className="flex h-full flex-col items-start gap-1">
                <p
                  className={cn(
                    "text-xl font-semibold tracking-tight",
                    isTertiary ? "text-[#4a4d5c]" : "text-white/88"
                  )}
                >
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-base font-semibold tracking-tight",
                    isTertiary ? "text-[#8b90a3]" : "text-white/40"
                  )}
                >
                  {stat.note}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-end gap-1 font-bold",
                  isTertiary ? "text-[#4a4d5c]" : "text-white"
                )}
              >
                <span className="text-4xl leading-[52px] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[28px] leading-[38px] tracking-tight">
                  {stat.unit}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
