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
    <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div>
          <h3 className="text-base font-semibold text-[#040405]">신청 현황</h3>
          <p className="text-[16px] text-[#8b90a3]">
            승인 단계별로 신청서를 필터링할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {vm.approvalStats.map((stat) => {
            const isActive = stat === vm.activeStatusFilter;

            return (
              <Button
                key={stat}
                variant={isActive ? "default" : "secondary"}
                className={
                  isActive
                    ? "h-10 rounded-full border-[#3863f6] bg-[#3863f6] px-4 text-[16px] font-semibold text-white hover:bg-[#2f57e8] hover:text-white"
                    : "h-10 rounded-full border-[#d6d9e0] bg-white px-4 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                }
                onClick={() => vm.setActiveStatusFilter(stat)}
              >
                {stat}
                <span
                  className={
                    isActive
                      ? "ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[16px]"
                      : "ml-2 rounded-full bg-[#f4f7ff] px-2 py-0.5 text-[16px] text-[#6b6f80]"
                  }
                >
                  {vm.applicationsByStatus[stat].length}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
