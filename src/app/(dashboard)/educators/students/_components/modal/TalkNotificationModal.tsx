"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectBtn from "@/components/common/button/SelectBtn";
import { useModal } from "@/providers/ModalProvider";
import { useStudentSelectionStore } from "@/stores/studentsList.store";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { sendKakaoMemo } from "@/services/kakao.service";
import { KAKAO_MESSAGE_LIMITS } from "@/constants/kakao";
import { useDialogAlert } from "@/hooks/useDialogAlert";

type SendTarget = "all" | "student" | "parent";

export function TalkNotificationModal() {
  const { isOpen, closeModal } = useModal();
  const { showAlert } = useDialogAlert();
  const [sendChannel, setSendChannel] = useState("kakao");
  const [sendTarget, setSendTarget] = useState<SendTarget>("all");
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { selectedStudents, removeStudent, resetSelection } =
    useStudentSelectionStore();

  const getRecipientStats = () => {
    const studentCount = selectedStudents.filter((s) => s.phoneNumber).length;
    const parentCount = selectedStudents.filter((s) => s.parentPhone).length;
    const expectedRecipients =
      sendTarget === "all"
        ? studentCount + parentCount
        : sendTarget === "student"
          ? studentCount
          : parentCount;
    const deliverableStudents = selectedStudents.filter((student) => {
      if (sendTarget === "student") return Boolean(student.phoneNumber);
      if (sendTarget === "parent") return Boolean(student.parentPhone);
      return Boolean(student.phoneNumber || student.parentPhone);
    });

    return { expectedRecipients, deliverableStudents };
  };

  const handleSubmit = async () => {
    const { expectedRecipients, deliverableStudents } = getRecipientStats();
    const nameList = deliverableStudents.map((s) => s.name).join(", ");
    const targetLabel =
      sendTarget === "all"
        ? "학생+학부모"
        : sendTarget === "student"
          ? "학생"
          : "학부모";

    if (expectedRecipients === 0) {
      await showAlert({
        title: "전송 불가",
        description: "선택한 발송 대상의 연락처가 없습니다.",
      });
      return;
    }

    setIsSending(true);
    try {
      await sendKakaoMemo({
        title: `[알림] ${expectedRecipients}명 대상 (${targetLabel})`,
        description: `${messageContent}\n\n수신 대상: ${nameList}`,
        webUrl: window.location.origin,
        buttonTitle: "홈페이지로 가기",
      });
      resetForm();
      resetSelection();
      closeModal();
    } catch (error) {
      console.error("Talk notification send failed:", error);
      await showAlert({
        title: "전송 실패",
        description: "카카오 알림 전송 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSendChannel("kakao");
    setSendTarget("all");
    setMessageContent("");
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-[32px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-label-normal flex items-center gap-2">
            알림톡 전송
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            선택한 학생에게 알림톡을 전송합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <div className="flex justify-between items-center">
              <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
                발송 설정
              </h3>
              <p className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                총 예상 수신: {getRecipientStats().expectedRecipients}명
              </p>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 items-start pb-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground ml-1">발송 채널</Label>
                <RadioGroup value={sendChannel} onValueChange={setSendChannel}>
                  <div className="flex items-center space-x-3 bg-white border border-neutral-200 rounded-[12px] px-4 h-[58px] w-full shadow-sm">
                    <RadioGroupItem
                      value="kakao"
                      id="kakao"
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor="kakao"
                      className="text-base font-normal cursor-pointer flex-1"
                    >
                      카카오톡
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground ml-1">발송 대상</Label>
                <div className="space-y-2">
                  <SelectBtn
                    className="w-full text-base px-4 h-[58px] bg-white border border-neutral-200 rounded-[12px]"
                    value={sendTarget}
                    placeholder="발송 대상 선택"
                    optionSize="lg"
                    options={[
                      { label: "전체", value: "all" },
                      { label: "학생만", value: "student" },
                      { label: "학부모만", value: "parent" },
                    ]}
                    onChange={(value) => setSendTarget(value as SendTarget)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              대상 학생 정보
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedStudents.length}명)
              </span>
            </h3>
            <div className="min-h-[100px] max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {selectedStudents.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] bg-white border border-dashed border-neutral-200 rounded-[12px]">
                  <p className="text-sm text-muted-foreground">
                    선택된 학생이 없습니다.
                  </p>
                </div>
              ) : (
                selectedStudents.map((student) => (
                  <div
                    key={student.enrollmentId}
                    className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-[12px] hover:border-blue-300 transition-colors shadow-sm"
                  >
                    <StudentProfileAvatar
                      seedKey={student.enrollmentId}
                      sizePreset="Medium"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-label-normal truncate">
                        {student.name}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:gap-3 mt-0.5">
                        <p className="text-[12px] text-label-alternative">
                          학생 | {student.phoneNumber}
                        </p>
                        <p className="text-[12px] text-label-alternative">
                          부모 | {student.parentPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 border border-blue-100">
                        {sendChannel === "kakao" ? "카카오톡" : "SMS"}
                      </span>
                      <button
                        type="button"
                        aria-label={`학생 ${student.name} 삭제`}
                        className="cursor-pointer p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-colors"
                        onClick={() => removeStudent(student.enrollmentId)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
                메시지 내용
              </h3>
              <span
                className={`text-[12px] font-medium tabular-nums ${
                  messageContent.length > KAKAO_MESSAGE_LIMITS.DESCRIPTION
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {messageContent.length} / {KAKAO_MESSAGE_LIMITS.DESCRIPTION}
              </span>
            </div>
            <div className="space-y-2">
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="전송할 메시지를 입력하세요"
                className="text-base p-4 min-h-[160px] w-full rounded-[12px] bg-white border border-neutral-200 shadow-none focus-visible:ring-blue-500"
                maxLength={KAKAO_MESSAGE_LIMITS.DESCRIPTION}
                rows={6}
              />
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              * 전송 버튼 클릭 시 취소가 불가하므로 신중히 확인해주세요.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mt-4">
          <div className="flex gap-2 w-full justify-end">
            <Button
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-white border border-neutral-200 hover:bg-neutral-50 text-label-normal shadow-none"
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-brand-700 hover:bg-brand-800 text-white shadow-none disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
              variant="default"
              onClick={handleSubmit}
              disabled={
                !messageContent ||
                selectedStudents.length === 0 ||
                getRecipientStats().expectedRecipients === 0 ||
                isSending
              }
            >
              {isSending ? "전송 중..." : "알림 전송"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
