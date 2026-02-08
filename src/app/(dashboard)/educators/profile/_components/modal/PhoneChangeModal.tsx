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
import { useModal } from "@/providers/ModalProvider";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">전화번호 변경</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">
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
                />
              </div>
              <Button
                type="submit"
                disabled={!!phoneErrors.phoneNumber || isCodeSent}
                className="mt-0 h-[58px] cursor-pointer"
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
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!isCodeValid || isVerified}
                  className="mt-0 h-[58px] cursor-pointer"
                >
                  {isVerified ? "인증완료" : "인증하기"}
                </Button>
              </div>
            </form>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              className="flex-1 cursor-pointer"
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
