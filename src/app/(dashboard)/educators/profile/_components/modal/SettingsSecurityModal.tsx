"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, UserX } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/common/input/InputForm";
import { useModal } from "@/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import {
  passwordResetSchema,
  verificationCodeSchema,
  type PasswordResetFormData,
  type VerificationCodeFormData,
} from "@/validation/profile.validation";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/AuthIcons";

type ViewMode = "menu" | "password";

type SettingsSecurityModalProps = {
  email: string;
};

export function SettingsSecurityModal({ email }: SettingsSecurityModalProps) {
  const { isOpen, closeModal, openModal } = useModal();
  const [viewMode, setViewMode] = useState<ViewMode>("menu");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
    clearErrors,
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
  });

  const newPasswordValue = useWatch({ control, name: "newPassword" });
  const confirmPasswordValue = useWatch({ control, name: "confirmPassword" });

  const handleClose = () => {
    setViewMode("menu");
    setIsCodeSent(false);
    setIsVerified(false);
    resetCode();
    reset();
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    closeModal();
  };

  const handlePasswordChange = () => {
    setViewMode("password");
  };

  const handleBack = () => {
    setViewMode("menu");
    setIsCodeSent(false);
    setIsVerified(false);
    resetCode();
    reset();
    setShowNewPwd(false);
    setShowConfirmPwd(false);
  };

  const handleSendCode = () => {
    // TODO: API 연동 - 인증메일 발송
    setIsCodeSent(true);
  };

  const handleVerifyCode = handleCodeSubmit(() => {
    // TODO: API 연동 - 인증코드 검증
    setIsVerified(true);
  });

  const onSubmit = () => {
    // TODO: API 연동 - 비밀번호 변경
    handleClose();
  };

  const handleWithdrawal = () => {
    openModal(
      <CheckModal
        title="서비스 탈퇴"
        description="정말 탈퇴하시겠습니까? 모든 정보가 사라집니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={() => {
          // TODO: API 연동
          console.log("서비스 탈퇴");
        }}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[620px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]">
        <DialogHeader className="gap-2 border-b border-[#e9ebf0] px-6 pb-5 pt-6 sm:px-8">
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#040405]">
            {viewMode === "menu" ? "설정 및 보안" : "비밀번호 변경"}
          </DialogTitle>
        </DialogHeader>

        {viewMode === "menu" ? (
          <div className="space-y-4 px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
            <Button
              variant="outline"
              className="h-14 w-full justify-start rounded-[12px] border border-[#d6d9e0] bg-white px-5 text-[16px] font-semibold tracking-[-0.02em] text-[#4a4d5c] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#fcfcfd]"
              onClick={handlePasswordChange}
            >
              <Lock className="mr-3 h-5 w-5" />
              비밀번호 변경하기
            </Button>
            <Button
              variant="outline"
              className="h-14 w-full justify-start rounded-[12px] border border-[#fee2e2] bg-[#fff7f7] px-5 text-[16px] font-semibold tracking-[-0.02em] text-[#dc2626] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#ffefef] hover:text-[#b91c1c]"
              onClick={handleWithdrawal}
            >
              <UserX className="mr-3 h-5 w-5" />
              서비스 탈퇴하기
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
          >
            <div className="space-y-2">
              <InputForm
                id="email"
                label="이메일"
                value={email}
                disabled
                className="h-14 rounded-[12px] border-[#d6d9e0] bg-[#f7f8fa] px-4 text-[16px] font-medium tracking-[-0.02em] text-[#8b90a3]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-14 flex-1 rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] text-[14px] font-semibold tracking-[-0.02em] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#e8edfe]"
                onClick={handleSendCode}
                disabled={isCodeSent}
              >
                {isCodeSent ? "발송됨" : "인증메일 발송"}
              </Button>
            </div>

            {isCodeSent && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputForm
                    label="인증코드"
                    type="text"
                    {...registerCode("code")}
                    disabled={isVerified}
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
                  type="button"
                  className="h-14 min-w-[120px] rounded-[12px] bg-[#3863f6] px-5 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
                  disabled={!isCodeValid || isVerified}
                  onClick={() => {
                    void handleVerifyCode();
                  }}
                >
                  {isVerified ? "인증완료" : "인증하기"}
                </Button>
              </div>
            )}

            <div className="relative">
              <InputForm
                label="새 비밀번호"
                type={showNewPwd ? "text" : "password"}
                {...register("newPassword")}
                disabled={!isVerified}
                error={errors.newPassword?.message}
                showReset={!!newPasswordValue && isVerified}
                onReset={() => {
                  setValue("newPassword", "", { shouldValidate: true });
                  clearErrors("newPassword");
                }}
                className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 pr-12 text-[16px] font-medium tracking-[-0.02em] text-[#2b2e3a]"
              />
              {newPasswordValue && isVerified && (
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-[29px] -translate-y-1/2 rounded-md p-1 text-[#8b90a3] hover:bg-[#f4f6fa]"
                >
                  {showNewPwd ? (
                    <EyeOpenIcon size={20} />
                  ) : (
                    <EyeClosedIcon size={20} />
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <InputForm
                label="새 비밀번호 확인"
                type={showConfirmPwd ? "text" : "password"}
                {...register("confirmPassword")}
                disabled={!isVerified}
                error={errors.confirmPassword?.message}
                showReset={!!confirmPasswordValue && isVerified}
                onReset={() => {
                  setValue("confirmPassword", "", { shouldValidate: true });
                  clearErrors("confirmPassword");
                }}
                className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 pr-12 text-[16px] font-medium tracking-[-0.02em] text-[#2b2e3a]"
              />
              {confirmPasswordValue && isVerified && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-[29px] -translate-y-1/2 rounded-md p-1 text-[#8b90a3] hover:bg-[#f4f6fa]"
                >
                  {showConfirmPwd ? (
                    <EyeOpenIcon size={20} />
                  ) : (
                    <EyeClosedIcon size={20} />
                  )}
                </button>
              )}
            </div>

            <div className="mt-6 flex gap-2 border-t border-[#e9ebf0] pt-5">
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-[12px] border border-[#ced9fd] bg-[#f4f6fe] text-[14px] font-semibold tracking-[-0.02em] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#e8edfe]"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
              <Button
                type="submit"
                className="h-12 flex-1 rounded-[12px] bg-[#3863f6] text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
                disabled={!isVerified || !isValid}
              >
                변경하기
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
