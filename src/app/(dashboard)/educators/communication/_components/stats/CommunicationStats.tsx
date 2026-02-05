import { Card, CardContent } from "@/components/ui/card";

type StatItemProps = {
  label: string;
  value: number | string;
  description: React.ReactNode;
  valueColor: string;
};

function StatItem({ label, value, description, valueColor }: StatItemProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="pb-3">
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
        </div>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        <div className="pt-3">
          <p className="text-xs font-bold text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunicationStats() {
  const stats = [
    {
      label: "누적 게시글",
      value: 6,
      valueColor: "text-green-600",
      description: (
        <>
          지난 달 기준 <span className="text-green-600">12.5%</span> 증가
        </>
      ),
    },
    {
      label: "미답변",
      value: 4,
      valueColor: "text-red-600",
      description: (
        <>
          <span className="text-red-600">4건 </span> 지연 중
        </>
      ),
    },
    {
      label: "이번 달 답변 완료",
      value: 8,
      valueColor: "text-blue-600",
      description: (
        <>
          <span className="text-blue-600">3건 </span> 응답 진행 중
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
}
