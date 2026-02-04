import { BookOpen, FileText, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardStat } from "@/types/dashboard";

type DashboardStatCardsProps = {
  stats: DashboardStat[];
};

const statConfig = {
  students: {
    icon: Users,
    cardClass: "border-emerald-100 bg-emerald-50/60",
    iconClass: "text-emerald-600 bg-emerald-100",
  },
  lectures: {
    icon: BookOpen,
    cardClass: "border-sky-100 bg-sky-50/60",
    iconClass: "text-sky-600 bg-sky-100",
  },
  exams: {
    icon: FileText,
    cardClass: "border-amber-100 bg-amber-50/60",
    iconClass: "text-amber-600 bg-amber-100",
  },
} as const;

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const config = statConfig[stat.key];
        const Icon = config.icon;

        return (
          <Card
            key={stat.id}
            className={cn("min-h-[120px] shadow-sm", config.cardClass)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-semibold text-foreground lg:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                  {stat.note ? (
                    <p className="text-xs text-muted-foreground">{stat.note}</p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    config.iconClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
