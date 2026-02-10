import Link from "next/link";

import type { AssistantsStatItem } from "@/app/(dashboard)/educators/assistants/_types/assistants.page.types";
import { Card, CardContent } from "@/components/ui/card";

type AssistantsStatsGridProps = {
  stats: AssistantsStatItem[];
  onOpenContractManageModal: () => void;
};

export default function AssistantsStatsGrid({
  stats,
  onOpenContractManageModal,
}: AssistantsStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isInteractive = Boolean(stat.href || stat.modal);
        const card = (
          <Card
            className={
              isInteractive
                ? "transition hover:border-primary/40 hover:shadow-md"
                : undefined
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className={`mt-2 text-xs ${stat.accent}`}>{stat.delta}</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
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
