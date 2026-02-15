"use client";

import type { AssistantsApprovalPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsApprovalPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AssistantsApprovalStatusCardProps = {
  vm: AssistantsApprovalPageViewModel;
};

export default function AssistantsApprovalStatusCard({
  vm,
}: AssistantsApprovalStatusCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div>
          <h3 className="text-sm font-semibold">신청 현황</h3>
          <p className="text-xs text-muted-foreground">
            승인 단계별로 신청서를 필터링할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {vm.approvalStats.map((stat) => (
            <Button
              key={stat}
              variant={stat === vm.activeStatusFilter ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => vm.setActiveStatusFilter(stat)}
            >
              {stat}
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {vm.applicationsByStatus[stat].length}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
