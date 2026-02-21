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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            {subtitle}
          </div>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 발송 채널 & 발송 대상 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 발송 채널 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">발송 채널</h3>
              <div className="rounded-lg border p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="channel"
                    value="kakao"
                    defaultChecked
                    className="h-4 w-4"
                  />
                  <MessageSquare className="h-4 w-4" />
                  <span>카카오톡</span>
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                {mode === "prepare"
                  ? "현재는 카카오톡 발송 준비 기능만 지원됩니다."
                  : "현재는 카카오톡 발송 기능만 지원됩니다."}
              </p>
            </div>

            {/* 발송 대상 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">발송 대상</h3>
              <Select
                value={targetType}
                onValueChange={(value: TargetType) => setTargetType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      전체 (학생 + 학부모)
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      학생만
                    </div>
                  </SelectItem>
                  <SelectItem value="parent">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      학부모만
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                총 예상 수신: {targetInfo.count}명 ({targetInfo.label})
              </p>
            </div>
          </div>

          {/* 대상 정보 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">발송 대상 정보</h3>
            <div className="max-h-[200px] overflow-y-auto rounded-lg border">
              {recipients.map((recipient, index) => (
                <div
                  key={recipient.id}
                  className={`p-4 ${
                    index !== recipients.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{recipient.name}</p>
                    {recipient.examName && (
                      <p className="text-sm text-muted-foreground">
                        시험: {recipient.examName}{" "}
                        {recipient.score !== undefined &&
                          `(${recipient.score}점)`}
                      </p>
                    )}
                    {recipient.className && (
                      <p className="text-sm text-muted-foreground">
                        수업: {recipient.className}
                      </p>
                    )}
                    {/* 발송 대상에 따라 연락처 표시 */}
                    {(targetType === "all" || targetType === "student") &&
                      recipient.phone && (
                        <p className="text-sm text-muted-foreground">
                          학생 연락처: {recipient.phone}
                        </p>
                      )}
                    {(targetType === "all" || targetType === "parent") &&
                      recipient.parentPhone && (
                        <p className="text-sm text-muted-foreground">
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
            <h3 className="text-sm font-medium">메시지 내용</h3>
            <Textarea
              placeholder="전송할 메시지를 입력하세요"
              className="min-h-[120px] resize-none"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSending}>
            취소
          </Button>
          <Button
            onClick={handleSend}
            className="gap-2"
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
