import { SectionHeader } from "@/components/common/SectionHeader";

type LearnersDashboardHeaderProps = {
  learnerName: string;
};

export default function LearnersDashboardHeader({
  learnerName,
}: LearnersDashboardHeaderProps) {
  return (
    <SectionHeader
      title="학생 대시보드"
      description={`안녕하세요, ${learnerName}님! 오늘의 학습 요약입니다.`}
    />
  );
}
