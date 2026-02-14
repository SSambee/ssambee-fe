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
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">조교 가입 신청 목록</h3>
          </div>
          <Select
            value={vm.sortOrder}
            onValueChange={(value: "latest" | "oldest") =>
              vm.setSortOrder(value)
            }
          >
            <SelectTrigger className="w-[120px]">
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
            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
              신청 내역을 불러오는 중입니다.
            </div>
          ) : vm.sortedApplications.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
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
                  className="flex flex-wrap items-center gap-4 rounded-lg border bg-background p-4"
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
                    <p className="text-xs text-muted-foreground">
                      {application.phone} · {application.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      신청일: {application.appliedAt}
                    </p>
                  </div>

                  <div className="min-w-[160px] rounded-md border px-3 py-2 text-xs">
                    <p className="text-muted-foreground">담당 강사</p>
                    <p className="font-medium">{application.mentor}</p>
                  </div>

                  <div className="min-w-[160px] rounded-md border px-3 py-2 text-xs">
                    <p className="text-muted-foreground">지원 역할</p>
                    <p className="font-medium">{application.role}</p>
                  </div>

                  <div className="ml-auto flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="rounded-full"
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
                      className="rounded-full"
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
