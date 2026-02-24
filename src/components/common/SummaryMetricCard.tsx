import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryMetricTone = "primary" | "secondary" | "neutral";

type SummaryMetricCardProps = {
  title: string;
  subtitle: string;
  value: number | string;
  unit?: string;
  tone?: SummaryMetricTone;
  className?: string;
};

const toneStyles: Record<
  SummaryMetricTone,
  {
    card: string;
    title: string;
    subtitle: string;
    value: string;
  }
> = {
  primary: {
    card: "border-transparent bg-[#4b72f7]",
    title: "text-[rgba(255,255,255,0.88)]",
    subtitle: "text-[rgba(255,255,255,0.4)]",
    value: "text-white",
  },
  secondary: {
    card: "border-transparent bg-[#33363f]",
    title: "text-[rgba(255,255,255,0.88)]",
    subtitle: "text-[rgba(255,255,255,0.4)]",
    value: "text-white",
  },
  neutral: {
    card: "border-[#d6d9e0] bg-white",
    title: "text-[#222222]",
    subtitle: "text-[#8b90a3]",
    value: "text-[#222222]",
  },
};

export function SummaryMetricCard({
  title,
  subtitle,
  value,
  unit,
  tone = "primary",
  className,
}: SummaryMetricCardProps) {
  const styles = toneStyles[tone];
  const hasUnit = typeof value === "number" && Boolean(unit);

  return (
    <Card
      className={cn(
        "h-40 rounded-[24px] border shadow-[0_0_14px_rgba(138,138,138,0.08)]",
        styles.card,
        className
      )}
    >
      <CardContent className="flex h-full items-end justify-between px-6 pb-6 pt-8 sm:px-10">
        <div className="flex h-full flex-col items-start gap-1">
          <p
            className={cn(
              "text-[20px] font-semibold leading-7 tracking-[-0.2px]",
              styles.title
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-base font-semibold leading-6 tracking-[-0.16px]",
              styles.subtitle
            )}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex h-full items-end gap-[3px]">
          <p
            className={cn(
              hasUnit
                ? "text-[40px] font-bold leading-[52px] tracking-[-0.4px]"
                : "text-[32px] font-bold leading-[42px] tracking-[-0.32px]",
              styles.value
            )}
          >
            {value}
          </p>
          {hasUnit ? (
            <p
              className={cn(
                "pb-[7px] text-[28px] font-bold leading-[38px] tracking-[-0.28px]",
                styles.value
              )}
            >
              {unit}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
