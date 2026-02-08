import { BarChart3, CheckSquare, Clock3, TrendingUp } from "lucide-react";

import { type LearnersMetricCard } from "@/types/learners-dashboard";
import { Card, CardContent } from "@/components/ui/card";

type LearnersStatCardsProps = {
  cards: LearnersMetricCard[];
};

type VisibleMetricKey = Exclude<LearnersMetricCard["key"], "todaySchedule">;

type VisibleMetricCard = LearnersMetricCard & {
  key: VisibleMetricKey;
};

const iconMap = {
  attendance: Clock3,
  retake: CheckSquare,
  previousRank: BarChart3,
} as const;

export default function LearnersStatCards({ cards }: LearnersStatCardsProps) {
  const cardClassMap = {
    attendance: "border-emerald-100 bg-emerald-50/60",
    retake: "border-rose-100 bg-rose-50/60",
    previousRank: "border-sky-100 bg-sky-50/60",
  } as const;

  const iconClassMap = {
    attendance: "text-emerald-600 bg-emerald-100",
    retake: "text-rose-600 bg-rose-100",
    previousRank: "text-sky-600 bg-sky-100",
  } as const;

  const visibleCards = cards.filter(
    (card): card is VisibleMetricCard => card.key !== "todaySchedule"
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleCards.map((card) => {
        const Icon = iconMap[card.key];

        return (
          <Card
            key={card.id}
            className={`min-h-[170px] rounded-2xl shadow-sm ${cardClassMap[card.key]}`}
          >
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClassMap[card.key]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {card.cta ? (
                  <p className="text-sm font-semibold text-rose-600">
                    {card.cta} {">"}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
                {card.note ? (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {card.key === "previousRank" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
                    ) : null}
                    <span>{card.note}</span>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
