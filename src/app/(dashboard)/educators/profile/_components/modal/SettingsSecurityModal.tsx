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
    console.log("인증메일 발송:", email);
    setIsCodeSent(true);
  };

  const handleVerifyCode = handleCodeSubmit((data) => {
    // TODO: API 연동 - 인증코드 검증
    console.log("인증코드 검증:", data.code);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {viewMode === "menu" ? "설정 및 보안" : "비밀번호 변경"}
          </DialogTitle>
        </DialogHeader>

        {viewMode === "menu" ? (
          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-base cursor-pointer"
              onClick={handlePasswordChange}
            >
              <Lock className="mr-3 h-5 w-5" />
              비밀번호 변경하기
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-base text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              onClick={handleWithdrawal}
            >
              <UserX className="mr-3 h-5 w-5" />
              서비스 탈퇴하기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <InputForm id="email" label="이메일" value={email} disabled />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-[58px] flex-1 cursor-pointer"
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
                  />
                </div>
                <Button
                  type="button"
                  className="h-[58px] cursor-pointer"
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
              />
              {newPasswordValue && isVerified && (
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
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
              />
              {confirmPasswordValue && isVerified && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPwd ? (
                    <EyeOpenIcon size={20} />
                  ) : (
                    <EyeClosedIcon size={20} />
                  )}
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer"
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
