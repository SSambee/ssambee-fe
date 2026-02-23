"use client";

import { useState, useMemo } from "react";
import { Bell, MessageSquare, User, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 공통 수신자 타입
export type NotificationRecipient = {
  id: string;
  name: string;
  phone?: string;
  parentPhone?: string;
  // 추가 정보 (성적표 발송 시 사용)
  examName?: string;
  score?: number;
  className?: string;
};

type TargetType = "all" | "student" | "parent";

type KakaoNotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: NotificationRecipient[];
  // 모달 타입에 따른 제목 변경
  title?: string;
  subtitle?: string;
  // 기본 메시지
  defaultMessage?: string;
  // 발송 핸들러
  onSend?: (
    recipients: NotificationRecipient[],
    message: string,
    targetType: TargetType
  ) => void | Promise<void>;
  mode?: "send" | "prepare";
};

export function KakaoNotificationModal({
  open,
  onOpenChange,
  recipients,
  title = "알림톡 전송",
  subtitle = "수업 알림 발송",
  defaultMessage = "",
  onSend,
  mode = "send",
}: KakaoNotificationModalProps) {
  // TODO: defaultMessage 변경 시 message 상태 동기화(useEffect) 필요
  const [message, setMessage] = useState(defaultMessage);
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [isSending, setIsSending] = useState(false);

  // 발송 대상에 따른 수신자 수 계산
  const targetInfo = useMemo(() => {
    const studentCount = recipients.filter((r) => r.phone).length;
    const parentCount = recipients.filter((r) => r.parentPhone).length;

    switch (targetType) {
      case "student":
        return { count: studentCount, label: "학생" };
      case "parent":
        return { count: parentCount, label: "학부모" };
      default:
        return { count: studentCount + parentCount, label: "전체" };
    }
  }, [recipients, targetType]);

  const handleSend = async () => {
    if (onSend) {
      setIsSending(true);
      try {
        await onSend(recipients, message, targetType);
        handleClose();
      } catch (error) {
        console.error("Failed to send notification:", error);
        // Keep modal open on failure
      } finally {
        setIsSending(false);
      }
    } else {
      // 기본 동작
      const targetLabel =
        targetType === "all"
          ? "전체"
          : targetType === "student"
            ? "학생"
            : "학부모";
      const suffix =
        mode === "prepare"
          ? "발송 준비가 완료되었습니다."
          : "발송이 완료되었습니다.";
      alert(`${targetLabel}에게 카카오톡 ${suffix}`);
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setMessage(defaultMessage);
    setTargetType("all");
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[860px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]">
        <DialogHeader className="gap-2 border-b border-[#e9ebf0] px-6 pb-5 pt-6 sm:px-8 text-left">
          <div className="flex items-center gap-2 text-sm font-medium text-[#8b90a3]">
            <Bell className="h-4 w-4 text-[#8b90a3]" />
            {subtitle}
          </div>
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#040405]">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          {/* 발송 채널 & 발송 대상 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 발송 채널 */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-semibold text-[#6b6f80]">
                발송 채널
              </h3>
              <div className="rounded-[12px] border border-[#d6d9e0] bg-[#fcfcfd] p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="channel"
                    value="kakao"
                    defaultChecked
                    className="h-4 w-4 accent-[#3863f6]"
                  />
                  <MessageSquare className="h-4 w-4 text-[#f5b301]" />
                  <span className="text-[15px] font-medium text-[#4a4d5c]">
                    카카오톡
                  </span>
                </label>
              </div>
              <p className="text-[13px] leading-5 text-[#8b90a3]">
                {mode === "prepare"
                  ? "현재는 카카오톡 발송 준비 기능만 지원됩니다. 준비 시 PDF와 미리보기 이미지가 S3에 업로드됩니다."
                  : "현재는 카카오톡 발송 기능만 지원됩니다."}
              </p>
            </div>

            {/* 발송 대상 */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-semibold text-[#6b6f80]">
                발송 대상
              </h3>
              <Select
                value={targetType}
                onValueChange={(value: TargetType) => setTargetType(value)}
              >
                <SelectTrigger className="h-12 rounded-[12px] border-[#d6d9e0] bg-white text-[15px] font-medium text-[#4a4d5c]">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent className="rounded-[12px] border-[#d6d9e0]">
                  <SelectItem value="all" className="text-[14px] font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#6b6f80]" />
                      전체 (학생 + 학부모)
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="student"
                    className="text-[14px] font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#6b6f80]" />
                      학생만
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="parent"
                    className="text-[14px] font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#6b6f80]" />
                      학부모만
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[13px] leading-5 text-[#8b90a3]">
                총 예상 수신: {targetInfo.count}명 ({targetInfo.label})
              </p>
            </div>
          </div>

          {/* 대상 정보 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-semibold text-[#6b6f80]">
              발송 대상 정보
            </h3>
            <div className="max-h-[220px] overflow-y-auto rounded-[12px] border border-[#d6d9e0] bg-white">
              {recipients.map((recipient, index) => (
                <div
                  key={recipient.id}
                  className={`p-4 ${
                    index !== recipients.length - 1
                      ? "border-b border-[#e9ebf0]"
                      : ""
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-[#4a4d5c]">
                      {recipient.name}
                    </p>
                    {recipient.examName && (
                      <p className="text-sm text-[#8b90a3]">
                        시험: {recipient.examName}{" "}
                        {recipient.score !== undefined &&
                          `(${recipient.score}점)`}
                      </p>
                    )}
                    {recipient.className && (
                      <p className="text-sm text-[#8b90a3]">
                        수업: {recipient.className}
                      </p>
                    )}
                    {/* 발송 대상에 따라 연락처 표시 */}
                    {(targetType === "all" || targetType === "student") &&
                      recipient.phone && (
                        <p className="text-sm text-[#8b90a3]">
                          학생 연락처: {recipient.phone}
                        </p>
                      )}
                    {(targetType === "all" || targetType === "parent") &&
                      recipient.parentPhone && (
                        <p className="text-sm text-[#8b90a3]">
                          학부모 연락처: {recipient.parentPhone}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 메시지 내용 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-semibold text-[#6b6f80]">
              메시지 내용
            </h3>
            <Textarea
              placeholder="전송할 메시지를 입력하세요"
              className="min-h-[120px] resize-none rounded-[12px] border-[#d6d9e0] bg-[#fcfcfd] p-4 text-[14px] leading-6 text-[#4a4d5c] placeholder:text-[#8b90a3] focus:border-[#3863f6] focus:ring-[#3863f6]/20"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-1 flex w-full flex-row gap-2.5 border-t border-[#e9ebf0] px-6 pb-6 pt-5 sm:justify-end sm:px-8 sm:pb-8">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
            className="h-[46px] flex-1 rounded-[10px] border-0 bg-[#e1e7fe] px-7 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d5defe] sm:flex-none"
          >
            취소
          </Button>
          <Button
            onClick={handleSend}
            className="h-[46px] flex-1 gap-2 rounded-[10px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] sm:flex-none"
            disabled={targetInfo.count === 0 || isSending}
          >
            {isSending ? (
              mode === "prepare" ? (
                "준비 중..."
              ) : (
                "전송 중..."
              )
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                {mode === "prepare"
                  ? `${targetInfo.label} 발송 준비 (${targetInfo.count}명)`
                  : `${targetInfo.label} 발송 (${targetInfo.count}명)`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
