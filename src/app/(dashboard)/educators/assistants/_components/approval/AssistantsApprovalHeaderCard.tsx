"use client";

import { Copy, KeyRound } from "lucide-react";

import AssistantsTabs from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import type { AssistantsApprovalPageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsApprovalPage";
import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AssistantsApprovalHeaderCardProps = {
  vm: AssistantsApprovalPageViewModel;
};

export default function AssistantsApprovalHeaderCard({
  vm,
}: AssistantsApprovalHeaderCardProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Title
              title="조교 가입 승인"
              description="승인 대기 중인 조교들의 정보를 확인하고 처리하세요."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={vm.handleCreateApprovalCode}
              disabled={vm.isCodeCreating}
            >
              <KeyRound className="h-4 w-4" />
              {vm.isCodeCreating ? "생성 중..." : "인증 코드 생성"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => void vm.handleCopyInviteLink()}
            >
              <Copy className="h-4 w-4" />
              가입 링크 복사
            </Button>
          </div>
        </div>

        <AssistantsTabs active="approval" />

        {vm.actionNotice ? (
          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {vm.actionNotice}
          </div>
        ) : null}

        <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          <KeyRound className="h-3 w-3" />
          인증 코드: {vm.approvalCode}
        </div>
      </CardContent>
    </Card>
  );
}
