"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/common/input/InputForm";
import { useModal } from "@/app/providers/ModalProvider";
import { formatPhoneNumber } from "@/utils/phone";
import {
  phoneChangeSchema,
  verificationCodeSchema,
  type PhoneChangeFormData,
  type VerificationCodeFormData,
} from "@/validation/profile.validation";

type PhoneChangeModalProps = {
  currentPhone: string;
};

export function PhoneChangeModal({ currentPhone }: PhoneChangeModalProps) {
  const { isOpen, closeModal } = useModal();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // 인증번호 발송
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    setValue: setPhoneValue,
    reset: resetPhone,
    trigger: triggerPhone,
  } = useForm<PhoneChangeFormData>({
    resolver: zodResolver(phoneChangeSchema),
    mode: "onChange",
  });

  // 인증번호 확인
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors, isValid: isCodeValid },
    setValue: setCodeValue,
    reset: resetCode,
  } = useForm<VerificationCodeFormData>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onChange",
  });

  const handleClose = () => {
    resetPhone();
    resetCode();
    setIsCodeSent(false);
    setIsVerified(false);
    closeModal();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue("phoneNumber", formatted, { shouldValidate: true });
    triggerPhone("phoneNumber");
  };

  const handleSendCode = handlePhoneSubmit((data) => {
    // TODO: API 연동 - 인증번호 발송
    console.log("인증번호 발송:", data.phoneNumber);
    setIsCodeSent(true);
  });

  const handleVerify = handleCodeSubmit((data) => {
    // TODO: API 연동 - 인증번호 확인
    console.log("인증번호 확인:", data.code);
    setIsVerified(true);
  });

  const handleFinalSubmit = handlePhoneSubmit((data) => {
    // TODO: API 연동 - 전화번호 변경
    console.log("전화번호 변경:", data.phoneNumber);
    handleClose();
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[620px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]">
        <DialogHeader className="gap-2 border-b border-[#e9ebf0] px-6 pb-5 pt-6 sm:px-8">
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#040405]">
            전화번호 변경
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          <div className="rounded-[12px] border border-[#e9ebf0] bg-[#f7f8fa] px-4 py-3">
            <p className="text-[14px] font-medium tracking-[-0.02em] text-[#6b6f80]">
              현재 전화번호: {currentPhone}
            </p>
          </div>

          <form onSubmit={handleSendCode}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputForm
                  label="새 전화번호"
                  type="tel"
                  {...registerPhone("phoneNumber", {
                    onChange: handlePhoneChange,
                  })}
                  disabled={isCodeSent}
                  placeholder=" "
                  error={phoneErrors.phoneNumber?.message}
                  showReset={!isCodeSent}
                  onReset={() => {
                    setPhoneValue("phoneNumber", "");
                  }}
                  className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium tracking-[-0.02em] text-[#2b2e3a]"
                />
              </div>
              <Button
                type="submit"
                disabled={!!phoneErrors.phoneNumber || isCodeSent}
                className="mt-0 h-14 min-w-[120px] rounded-[12px] bg-[#3863f6] px-4 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
              >
                {isCodeSent ? "발송됨" : "인증번호 발송"}
              </Button>
            </div>
          </form>

          {isCodeSent && (
            <form onSubmit={handleVerify}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputForm
                    label="인증번호"
                    type="text"
                    {...registerCode("code")}
                    disabled={isVerified}
                    placeholder=" "
                    error={codeErrors.code?.message}
                    showReset={!isVerified}
                    onReset={() => {
                      setCodeValue("code", "");
                    }}
                    maxLength={6}
                    className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium tracking-[-0.02em] text-[#2b2e3a]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!isCodeValid || isVerified}
                  className="mt-0 h-14 min-w-[120px] rounded-[12px] bg-[#3863f6] px-4 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
                >
                  {isVerified ? "인증완료" : "인증하기"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 flex gap-2 border-t border-[#e9ebf0] pt-5">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] text-[14px] font-semibold tracking-[-0.02em] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#e8edfe]"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              className="h-12 flex-1 rounded-[12px] bg-[#3863f6] text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
              onClick={handleFinalSubmit}
              disabled={!isVerified}
            >
              변경하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
