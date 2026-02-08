"use client";

import { useEffect, useState } from "react";
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
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "@/validation/profile.validation";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/AuthIcons";

type ViewMode = "menu" | "password";

export function SettingsSecurityModal() {
  const { isOpen, closeModal, openModal } = useModal();
  const [viewMode, setViewMode] = useState<ViewMode>("menu");

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    trigger,
    control,
    clearErrors,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onChange",
  });

  const currentPasswordValue = useWatch({ control, name: "currentPassword" });
  const newPasswordValue = useWatch({ control, name: "newPassword" });
  const confirmPasswordValue = useWatch({ control, name: "confirmPassword" });

  useEffect(() => {
    if (confirmPasswordValue) {
      trigger("confirmPassword");
    }
  }, [newPasswordValue, confirmPasswordValue, trigger]);

  const handleClose = () => {
    setViewMode("menu");
    reset();
    closeModal();
  };

  const handlePasswordChange = () => {
    setViewMode("password");
  };

  const handleBack = () => {
    setViewMode("menu");
    reset();
    setShowCurrentPwd(false);
    setShowNewPwd(false);
    setShowConfirmPwd(false);
  };

  const onSubmit = () => {
    // TODO: API 연동
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
            <div className="relative">
              <InputForm
                label="현재 비밀번호"
                type={showCurrentPwd ? "text" : "password"}
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
                showReset={!!currentPasswordValue}
                onReset={() => {
                  setValue("currentPassword", "", { shouldValidate: true });
                  clearErrors("currentPassword");
                }}
              />
              {currentPasswordValue && (
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
                >
                  {showCurrentPwd ? (
                    <EyeOpenIcon size={20} />
                  ) : (
                    <EyeClosedIcon size={20} />
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <InputForm
                label="변경할 비밀번호"
                type={showNewPwd ? "text" : "password"}
                {...register("newPassword")}
                error={errors.newPassword?.message}
                showReset={!!newPasswordValue}
                onReset={() => {
                  setValue("newPassword", "", { shouldValidate: true });
                  clearErrors("newPassword");
                }}
              />
              {newPasswordValue && (
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
                label="변경할 비밀번호 확인"
                type={showConfirmPwd ? "text" : "password"}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                showReset={!!confirmPasswordValue}
                onReset={() => {
                  setValue("confirmPassword", "", { shouldValidate: true });
                  clearErrors("confirmPassword");
                }}
              />
              {confirmPasswordValue && (
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
                disabled={!isValid}
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
