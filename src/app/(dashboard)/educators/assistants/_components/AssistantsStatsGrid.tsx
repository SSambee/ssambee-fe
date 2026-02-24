import Link from "next/link";

import type { AssistantsStatItem } from "@/types/assistants";
import { SummaryMetricCard } from "@/components/common/SummaryMetricCard";
import { cn } from "@/lib/utils";

type AssistantsStatsGridProps = {
  stats: AssistantsStatItem[];
  onOpenContractManageModal: () => void;
};

export default function AssistantsStatsGrid({
  stats,
  onOpenContractManageModal,
}: AssistantsStatsGridProps) {
  return (
    <div className="flex flex-wrap items-stretch gap-4 xl:gap-5">
      {stats.map((stat, index) => {
        const isInteractive = Boolean(stat.href || stat.modal);
        const tone =
          index === 0 ? "primary" : index === 1 ? "secondary" : "neutral";

        const card = (
          <SummaryMetricCard
            title={stat.label}
            subtitle={stat.delta}
            value={stat.value}
            tone={tone}
            className={cn(
              "w-full sm:w-[272px] xl:w-[300px]",
              isInteractive && tone === "neutral"
                ? "transition hover:border-[#4b72f7]/40 hover:bg-[#f4f7ff]"
                : isInteractive
                  ? "transition hover:brightness-95"
                  : undefined
            )}
          />
        );

        if (stat.href) {
          return (
            <Link key={stat.label} href={stat.href} className="block">
              {card}
            </Link>
          );
        }

        if (stat.modal === "contractManage") {
          return (
            <button
              key={stat.label}
              type="button"
              className="block w-full text-left"
              onClick={onOpenContractManageModal}
            >
              {card}
            </button>
          );
        }

        return <div key={stat.label}>{card}</div>;
      })}
    </div>
  );
}
