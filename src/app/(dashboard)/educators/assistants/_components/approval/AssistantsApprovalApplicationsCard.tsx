"use client";

import { CheckCircle2, UserPlus } from "lucide-react";

import type { AssistantsApprovalPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsApprovalPage";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssistantsApprovalApplicationsCardProps = {
  vm: AssistantsApprovalPageViewModel;
};

export default function AssistantsApprovalApplicationsCard({
  vm,
}: AssistantsApprovalApplicationsCardProps) {
  return (
    <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#8b90a3]" />
            <h3 className="text-base font-semibold text-[#040405]">
              조교 가입 신청 목록
            </h3>
          </div>
          <Select
            value={vm.sortOrder}
            onValueChange={(value: "latest" | "oldest") =>
              vm.setSortOrder(value)
            }
          >
            <SelectTrigger className="h-10 w-[120px] rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] text-[#6b6f80]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된 순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {vm.isApplicationsLoading ? (
            <div className="rounded-[20px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] px-4 py-8 text-center text-[16px] text-[#8b90a3]">
              신청 내역을 불러오는 중입니다.
            </div>
          ) : vm.sortedApplications.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-[#d6d9e0] bg-[#fcfcfd] px-4 py-8 text-center text-[16px] text-[#8b90a3]">
              선택한 상태의 신청 내역이 없습니다.
            </div>
          ) : (
            vm.sortedApplications.map((application) => {
              const isPending = application.status === "승인 대기";
              const isProcessing =
                vm.processingApplicationId === application.id;

              return (
                <div
                  key={application.id}
                  className="flex flex-wrap items-center gap-4 rounded-[20px] border border-[#eaecf2] bg-white p-4"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {application.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-[200px] flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{application.name}</span>
                      <StatusLabel
                        color={vm.statusColorMap[application.status]}
                      >
                        {application.status}
                      </StatusLabel>
                    </div>
                    <p className="text-[16px] text-[#8b90a3]">
                      {application.phone} · {application.email}
                    </p>
                    <p className="text-[16px] text-[#8b90a3]">
                      신청일: {application.appliedAt}
                    </p>
                  </div>

                  <div className="min-w-[160px] rounded-[12px] border border-[#eaecf2] bg-[#fcfcfd] px-3 py-2 text-[16px]">
                    <p className="text-[#8b90a3]">담당 강사</p>
                    <p className="font-medium text-[#4a4d5c]">
                      {application.mentor}
                    </p>
                  </div>

                  <div className="min-w-[160px] rounded-[12px] border border-[#eaecf2] bg-[#fcfcfd] px-3 py-2 text-[16px]">
                    <p className="text-[#8b90a3]">지원 역할</p>
                    <p className="font-medium text-[#4a4d5c]">
                      {application.role}
                    </p>
                  </div>

                  <div className="ml-auto flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="h-10 cursor-pointer rounded-[12px] bg-[#3863f6] px-4 text-white hover:bg-[#2f57e8]"
                      onClick={() =>
                        void vm.handleSignAction(application, "approve")
                      }
                      disabled={!isPending || isProcessing}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isProcessing ? "처리 중..." : "승인"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 cursor-pointer rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                      onClick={() =>
                        void vm.handleSignAction(application, "reject")
                      }
                      disabled={!isPending || isProcessing}
                    >
                      반려
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
