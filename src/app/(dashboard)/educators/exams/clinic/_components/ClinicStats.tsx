import { Card, CardContent } from "@/components/ui/card";

type ClinicStatsProps = {
  totalTargets: number;
  completedTargets: number;
};

export function ClinicStats({
  totalTargets,
  completedTargets,
}: ClinicStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 전체 클리닉 대상자 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  전체 클리닉 대상자
                </p>
                <p className="text-3xl font-bold">
                  {totalTargets}
                  <span className="text-lg font-normal text-muted-foreground">
                    명
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 완료 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="text-3xl font-bold">
                  {completedTargets}
                  <span className="text-lg font-normal text-muted-foreground">
                    명
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
