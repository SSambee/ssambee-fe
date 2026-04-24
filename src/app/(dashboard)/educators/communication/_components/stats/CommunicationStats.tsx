"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInstructorPosts } from "@/hooks/useInstructorPost";

type StatItemProps = {
  label: string;
  value: number | string;
  description: React.ReactNode;
  bgColor: string;
};

function StatItem({ label, value, description, bgColor }: StatItemProps) {
  return (
    <Card
      className={cn(
        "w-full rounded-[20px] border border-[#eaecf2] shadow-none sm:w-[272px] xl:w-[300px]",
        bgColor
      )}
    >
      <CardContent className="flex h-[124px] items-end justify-between px-5 pb-4 pt-5 xl:px-6">
        <div className="flex h-full flex-col gap-1">
          <p className="text-base font-semibold tracking-tight text-white/88">
            {label}
          </p>
          <p className="text-xs font-semibold tracking-tight text-white/40">
            {description}
          </p>
        </div>
        <div className="flex items-end gap-1 font-bold text-white">
          <span className="text-[30px] leading-[38px] tracking-tight">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunicationStats() {
  const { data } = useInstructorPosts({
    page: 1,
    limit: 10,
    postType: null,
  });

  const statsData = data?.stats;

  const stats = [
    {
      label: "누적 게시글",
      value: statsData?.totalCount ?? 0,
      bgColor: "bg-[#4b72f7]",
      description: `지난 달 기준 ${statsData?.increaseRate ?? 0} 증가`,
    },
    {
      label: "미답변",
      value: statsData?.unansweredCount ?? 0,
      bgColor: "bg-[#6b6f80]",
      description: `${statsData?.unansweredCriteria ?? 0}건 지연 중`,
    },
    {
      label: "이번 달 답변 완료",
      value: statsData?.answeredThisMonthCount ?? 0,
      bgColor: "bg-white",
      description: `${statsData?.processingCount ?? 0}건 응답 진행 중`,
    },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-4 xl:gap-5">
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          label={stat.label}
          value={stat.value}
          bgColor={index === 1 ? stat.bgColor : "bg-[#4b72f7]"}
          description={stat.description}
        />
      ))}
    </div>
  );
}
