"use client";

import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function AssistantsApprovalRejectGuideCard() {
  return (
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
  );
}
