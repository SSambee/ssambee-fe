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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectBtn from "@/components/common/button/SelectBtn";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { KAKAO_MESSAGE_LIMITS } from "@/constants/kakao";

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
  openChangeAction: (open: boolean) => void;
  recipients: NotificationRecipient[];
  // 모달 타입에 따른 제목 변경
  title?: string;
  subtitle?: string;
  // 기본 메시지
  defaultMessage?: string;
  // 발송 핸들러
  sendAction?: (
    recipients: NotificationRecipient[],
    message: string,
    targetType: TargetType
  ) => void | Promise<void>;
  mode?: "send" | "prepare";
  designVariant?: "default" | "student";
};

export function KakaoNotificationModal({
  open,
  openChangeAction,
  recipients,
  title = "알림톡 전송",
  subtitle = "수업 알림 발송",
  defaultMessage = "",
  sendAction,
  mode = "send",
  designVariant = "default",
}: KakaoNotificationModalProps) {
  // TODO: defaultMessage 변경 시 message 상태 동기화(useEffect) 필요
  const [sendChannel, setSendChannel] = useState("kakao");
  const [message, setMessage] = useState(defaultMessage);
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [isSending, setIsSending] = useState(false);
  const { showAlert } = useDialogAlert();

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
    if (sendAction) {
      setIsSending(true);
      try {
        await sendAction(recipients, message, targetType);
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
      await showAlert({ description: `${targetLabel}에게 카카오톡 ${suffix}` });
      handleClose();
    }
  };

  const handleClose = () => {
    openChangeAction(false);
    setSendChannel("kakao");
    setMessage(defaultMessage);
    setTargetType("all");
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSending) return;
    openChangeAction(nextOpen);
  };

  if (designVariant === "student") {
    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-[32px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[24px] font-bold text-label-normal">
              {title}
            </DialogTitle>
            <p className="text-[18px] font-medium text-label-alternative">
              {subtitle}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4 rounded-[20px] border bg-surface-normal-light-alternative px-[24px] py-[16px]">
              <div className="flex items-center justify-between">
                <h3 className="py-[11px] text-[18px] font-semibold text-label-neutral">
                  발송 설정
                </h3>
                <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  총 예상 수신: {targetInfo.count}명
                </p>
              </div>

              <div className="grid w-full grid-cols-2 items-start gap-4 pb-2">
                <div className="space-y-2">
                  <Label className="ml-1 text-muted-foreground">
                    발송 채널
                  </Label>
                  <RadioGroup
                    value={sendChannel}
                    onValueChange={setSendChannel}
                  >
                    <div className="flex h-[58px] w-full items-center space-x-3 rounded-[12px] border border-neutral-200 bg-white px-4 shadow-sm">
                      <RadioGroupItem
                        value="kakao"
                        id="kakao"
                        className="text-blue-600"
                      />
                      <Label
                        htmlFor="kakao"
                        className="flex-1 cursor-pointer text-base font-normal"
                      >
                        카카오톡
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1 text-muted-foreground">
                    발송 대상
                  </Label>
                  <SelectBtn
                    className="h-[58px] w-full rounded-[12px] border border-neutral-200 bg-white px-4 text-base"
                    value={targetType}
                    placeholder="발송 대상 선택"
                    optionSize="lg"
                    options={[
                      { label: "전체", value: "all" },
                      { label: "학생만", value: "student" },
                      { label: "학부모만", value: "parent" },
                    ]}
                    onChange={(value) => setTargetType(value as TargetType)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[20px] border bg-surface-normal-light-alternative px-[24px] py-[16px]">
              <h3 className="py-[11px] text-[18px] font-semibold text-label-neutral">
                대상 학생 정보
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({recipients.length}명)
                </span>
              </h3>

              <div className="custom-scrollbar min-h-[100px] max-h-[400px] space-y-2 overflow-y-auto pr-2">
                {recipients.length === 0 ? (
                  <div className="flex h-[100px] items-center justify-center rounded-[12px] border border-dashed border-neutral-200 bg-white">
                    <p className="text-sm text-muted-foreground">
                      선택된 학생이 없습니다.
                    </p>
                  </div>
                ) : (
                  recipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center gap-4 rounded-[12px] border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300"
                    >
                      <StudentProfileAvatar
                        seedKey={recipient.id}
                        sizePreset="Medium"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-label-normal">
                          {recipient.name}
                        </p>
                        <div className="mt-0.5 flex flex-col sm:flex-row sm:gap-3">
                          <p className="text-[12px] text-label-alternative">
                            학생 | {recipient.phone ?? "-"}
                          </p>
                          <p className="text-[12px] text-label-alternative">
                            부모 | {recipient.parentPhone ?? "-"}
                          </p>
                        </div>
                      </div>
                      <span className="hidden items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 sm:inline-flex">
                        {sendChannel === "kakao" ? "카카오톡" : "SMS"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-[20px] border bg-surface-normal-light-alternative px-[24px] py-[16px]">
              <h3 className="py-[11px] text-[18px] font-semibold text-label-neutral">
                메시지 내용
              </h3>
              <div className="space-y-2">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="전송할 메시지를 입력하세요"
                  className="min-h-[160px] w-full rounded-[12px] border border-neutral-200 bg-white p-4 text-base shadow-none focus-visible:ring-blue-500"
                  rows={6}
                />
              </div>
              <p className="ml-1 text-xs text-muted-foreground">
                * 전송 버튼 클릭 시 취소가 불가하므로 신중히 확인해주세요.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex w-full justify-end gap-2">
              <Button
                className="h-[48px] rounded-[12px] border border-neutral-200 bg-white px-[28px] py-[12px] text-label-normal shadow-none hover:bg-neutral-50"
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSending}
              >
                취소
              </Button>
              <Button
                className="h-[48px] rounded-[12px] bg-brand-700 px-[28px] py-[12px] text-white shadow-none hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
                variant="default"
                onClick={handleSend}
                disabled={targetInfo.count === 0 || isSending}
              >
                {isSending
                  ? mode === "prepare"
                    ? "준비 중..."
                    : "전송 중..."
                  : mode === "prepare"
                    ? `알림 발송 준비 (${targetInfo.count}명)`
                    : "알림 전송"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#6b6f80]">
                메시지 내용
              </h3>
              <span
                className={`text-[12px] font-medium tabular-nums ${
                  message.length > KAKAO_MESSAGE_LIMITS.DESCRIPTION
                    ? "text-[#e55b5b]"
                    : "text-[#8b90a3]"
                }`}
              >
                {message.length} / {KAKAO_MESSAGE_LIMITS.DESCRIPTION}
              </span>
            </div>
            <Textarea
              placeholder="전송할 메시지를 입력하세요"
              className="min-h-[120px] resize-none rounded-[12px] border-[#d6d9e0] bg-[#fcfcfd] p-4 text-[14px] leading-6 text-[#4a4d5c] placeholder:text-[#8b90a3] focus:border-[#3863f6] focus:ring-[#3863f6]/20"
              maxLength={KAKAO_MESSAGE_LIMITS.DESCRIPTION}
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
