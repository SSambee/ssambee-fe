"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  KakaoNotificationModal,
  NotificationRecipient,
} from "@/components/common/modals/KakaoNotificationModal";
import { sendKakaoMemo } from "@/services/kakao.service";
import type { ClinicStudent } from "@/types/clinics";

type ClinicHeaderProps = {
  students: ClinicStudent[];
  selectedIds: string[];
  onSendNotification: () => void;
  isSending?: boolean;
};

type NotificationTargetType = "all" | "student" | "parent";

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

  const uniqueExamNames = Array.from(
    new Set(selectedRecipients.map((r) => r.examName).filter(Boolean))
  );
  const clinicDefaultMessage =
    uniqueExamNames.length > 0
      ? `[클리닉 안내]\n대상 시험: ${uniqueExamNames.join(", ")}\n클리닉 일정을 확인해 주세요.`
      : "[클리닉 안내]\n클리닉 대상자로 선정되었습니다. 일정 안내를 확인해 주세요.";

  const handleOpenModal = () => {
    if (selectedIds.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleSend = async (
    recipients: NotificationRecipient[],
    message: string,
    targetType: NotificationTargetType
  ) => {
    const targetLabel =
      targetType === "all"
        ? "학생+학부모"
        : targetType === "student"
          ? "학생"
          : "학부모";
    const deliverableRecipients = recipients.filter((recipient) => {
      if (targetType === "student") return Boolean(recipient.phone);
      if (targetType === "parent") return Boolean(recipient.parentPhone);
      return Boolean(recipient.phone || recipient.parentPhone);
    });

    if (deliverableRecipients.length === 0) {
      throw new Error("No available recipients for selected target type.");
    }

    const nameList = deliverableRecipients.map((r) => r.name).join(", ");

    try {
      await sendKakaoMemo({
        title: `[클리닉 알림] ${deliverableRecipients.length}명 대상 (${targetLabel})`,
        description: `발송 대상: ${targetLabel}\n${message}\n\n수신 대상: ${nameList}`,
        webUrl: window.location.origin,
        buttonTitle: "홈페이지로 가기",
      });

      // 기존 완료 처리 로직 실행
      onSendNotification();
    } catch (error) {
      console.error("Clinic notification send failed:", error);
      throw error;
    }
  };

  return (
    <>
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
              클리닉 대상자 관리
            </h1>
            <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
              기준 점수 미달 학생들의 재시험 예약 및 현황을 관리합니다.
            </p>
          </div>
          <div className="flex items-center">
            <Button
              className="h-11 gap-2 rounded-[12px] bg-[#3863f6] px-5 text-[14px] font-semibold text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
              onClick={handleOpenModal}
              disabled={selectedIds.length === 0 || isSending}
            >
              <Bell className="h-4 w-4" />
              알림 발송
            </Button>
          </div>
        </div>
      </section>

      <KakaoNotificationModal
        open={isModalOpen}
        openChangeAction={setIsModalOpen}
        recipients={selectedRecipients}
        designVariant="student"
        title="클리닉 알림 발송 준비"
        subtitle="클리닉 대상자 발송 정보 확인"
        defaultMessage={clinicDefaultMessage}
        sendAction={(recipients, message, targetType) =>
          handleSend(recipients, message, targetType)
        }
      />
    </>
  );
}
