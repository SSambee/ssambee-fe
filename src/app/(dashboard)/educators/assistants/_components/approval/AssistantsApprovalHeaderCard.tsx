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
    <Card className="rounded-[24px] border-[#eaecf2] bg-white shadow-none">
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
              className="h-10 cursor-pointer rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              onClick={vm.handleCreateApprovalCode}
              disabled={vm.isCodeCreating}
            >
              <KeyRound className="h-4 w-4" />
              {vm.isCodeCreating ? "생성 중..." : "인증 코드 생성"}
            </Button>
            <Button
              variant="outline"
              className="h-10 cursor-pointer rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              onClick={() => void vm.handleCopyInviteLink()}
            >
              <Copy className="h-4 w-4" />
              가입 링크 복사
            </Button>
          </div>
        </div>

        <AssistantsTabs active="approval" />

        {vm.actionNotice ? (
          <div className="rounded-[12px] border border-[#eaecf2] bg-[#fcfcfd] px-4 py-3 text-[16px] text-[#6b6f80]">
            {vm.actionNotice}
          </div>
        ) : null}

        <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#eaecf2] bg-[#fcfcfd] px-3 py-2 text-[16px] text-[#6b6f80]">
          <KeyRound className="h-3 w-3" />
          인증 코드: {vm.approvalCode}
        </div>
      </CardContent>
    </Card>
  );
}
