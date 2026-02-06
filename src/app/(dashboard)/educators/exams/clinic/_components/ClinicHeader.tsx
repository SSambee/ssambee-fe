"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import {
  KakaoNotificationModal,
  NotificationRecipient,
} from "@/components/common/modals/KakaoNotificationModal";
import type { ClinicStudent } from "@/types/clinics";

type ClinicHeaderProps = {
  students: ClinicStudent[];
  selectedIds: string[];
  onSendNotification: () => void;
  isSending?: boolean;
};

export function ClinicHeader({
  students,
  selectedIds,
  onSendNotification,
  isSending = false,
}: ClinicHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ClinicStudent를 NotificationRecipient로 변환
  const selectedRecipients: NotificationRecipient[] = students
    .filter((s) => selectedIds.includes(s.id))
    .map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      parentPhone: s.parentPhone,
      examName: s.examName,
      score: s.score,
      className: s.class,
    }));

  const handleOpenModal = () => {
    if (selectedIds.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Title
          title="클리닉 대상자 관리"
          description="기준 점수 미달 학생들의 재시험 예약 및 현황을 관리합니다."
        />
        <Button
          className="gap-2"
          onClick={handleOpenModal}
          disabled={selectedIds.length === 0 || isSending}
        >
          <Bell className="h-4 w-4" />
          알림 발송
        </Button>
      </div>

      <KakaoNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipients={selectedRecipients}
        title="클리닉 알림 발송"
        subtitle="클리닉 대상자 알림"
        onSend={() => onSendNotification()}
      />
    </>
  );
}
