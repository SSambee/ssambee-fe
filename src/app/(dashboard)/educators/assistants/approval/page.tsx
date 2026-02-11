"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  KeyRound,
  UserPlus,
} from "lucide-react";

import AssistantsTabs from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import { useAssistantsApprovalPage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsApprovalPage";
import Title from "@/components/common/header/Title";
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
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AssistantsApprovalPage() {
  useSetBreadcrumb([{ label: "조교 승인" }]);

  const {
    approvalStats,
    statusColorMap,
    activeStatusFilter,
    setActiveStatusFilter,
    sortOrder,
    setSortOrder,
    actionNotice,
    approvalCode,
    isCodeCreating,
    isApplicationsLoading,
    processingApplicationId,
    applicationsByStatus,
    sortedApplications,
    handleCreateApprovalCode,
    handleCopyInviteLink,
    handleSignAction,
  } = useAssistantsApprovalPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
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
                onClick={handleCreateApprovalCode}
                disabled={isCodeCreating}
              >
                <KeyRound className="h-4 w-4" />
                {isCodeCreating ? "생성 중..." : "인증 코드 생성"}
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => void handleCopyInviteLink()}
              >
                <Copy className="h-4 w-4" />
                가입 링크 복사
              </Button>
            </div>
          </div>

          <AssistantsTabs active="approval" />

          {actionNotice ? (
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {actionNotice}
            </div>
          ) : null}

          <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <KeyRound className="h-3 w-3" />
            인증 코드: {approvalCode}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <h3 className="text-sm font-semibold">신청 현황</h3>
            <p className="text-xs text-muted-foreground">
              승인 단계별로 신청서를 필터링할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {approvalStats.map((stat) => (
              <Button
                key={stat}
                variant={stat === activeStatusFilter ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => setActiveStatusFilter(stat)}
              >
                {stat}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {applicationsByStatus[stat].length}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">조교 가입 신청 목록</h3>
            </div>
            <Select
              value={sortOrder}
              onValueChange={(value: "latest" | "oldest") =>
                setSortOrder(value)
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
            {isApplicationsLoading ? (
              <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                신청 내역을 불러오는 중입니다.
              </div>
            ) : sortedApplications.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                선택한 상태의 신청 내역이 없습니다.
              </div>
            ) : (
              sortedApplications.map((application) => (
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
                      <StatusLabel color={statusColorMap[application.status]}>
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
                    {(() => {
                      const isPending = application.status === "승인 대기";
                      const isProcessing =
                        processingApplicationId === application.id;

                      return (
                        <>
                          <Button
                            variant="secondary"
                            className="rounded-full"
                            onClick={() =>
                              void handleSignAction(application, "approve")
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
                              void handleSignAction(application, "reject")
                            }
                            disabled={!isPending || isProcessing}
                          >
                            반려
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50">
        <CardContent className="flex gap-3 pt-6">
          <AlertTriangle className="mt-1 h-5 w-5 text-red-500" />
          <div className="space-y-2 text-sm text-red-900">
            <h4 className="font-semibold">반려 처리 가이드</h4>
            <p>반려 사유를 입력하면 신청자에게 자동으로 안내됩니다.</p>
            <p>동일 사유가 반복될 경우 역할에 대한 공지를 검토하세요.</p>
            <p>필요 시 조교 팀 리더에게 escalate 할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
