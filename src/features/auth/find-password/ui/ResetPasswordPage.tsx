"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InputForm } from "@/components/common/input/InputForm";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/AuthIcons";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { postResetPassword } from "@/shared/common/api/passwordReset";

import ResetCompleteModal from "./ResetCompleteModal";

const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식을 입력해주세요."),
    otp: z
      .string()
      .length(6, "인증번호는 6자리입니다.")
      .regex(/^\d{6}$/, "인증번호는 숫자 6자리만 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다"
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { showAlert } = useDialogAlert();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const otpValue = watch("otp");
  const passwordValue = watch("password");
  const passwordConfirmValue = watch("passwordConfirm");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      const result = await postResetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });
      if (!result.success) {
        await showAlert({ description: result.message });
        return;
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-[480px]">
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          새로운 비밀번호를 설정해주세요
        </h1>
        <p className="text-sm text-neutral-400 mb-7">
          메일로 전송된 인증번호 6자리를 정확히 입력하고,
          <br />새 비밀번호를 설정해주세요.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputForm
            id="email"
            type="email"
            label="이메일"
            placeholder="이메일"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
            showReset={!!emailValue}
            onReset={() => {
              setValue("email", "", {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("email");
            }}
          />

          <InputForm
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            label="인증번호(OTP)"
            placeholder="숫자 6자리"
            autoComplete="one-time-code"
            error={errors.otp?.message}
            {...register("otp")}
            showReset={!!otpValue}
            onReset={() => {
              setValue("otp", "", {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("otp");
            }}
          />

          <div className="relative">
            <InputForm
              id="password"
              type={showPassword ? "text" : "password"}
              label="비밀번호"
              placeholder="비밀번호"
              error={errors.password?.message}
              {...register("password")}
              showReset={!!passwordValue}
              onReset={() => {
                setValue("password", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("password");
              }}
            />
            {passwordValue && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? (
                  <EyeOpenIcon size={22} />
                ) : (
                  <EyeClosedIcon size={22} />
                )}
              </button>
            )}
          </div>

          <div className="relative">
            <InputForm
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              label="비밀번호 확인"
              placeholder="비밀번호 확인"
              error={errors.passwordConfirm?.message}
              {...register("passwordConfirm")}
              showReset={!!passwordConfirmValue}
              onReset={() => {
                setValue("passwordConfirm", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("passwordConfirm");
              }}
            />
            {passwordConfirmValue && (
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
                aria-label={
                  showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 표시"
                }
              >
                {showPasswordConfirm ? (
                  <EyeOpenIcon size={22} />
                ) : (
                  <EyeClosedIcon size={22} />
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm text-sm ${
              !isValid || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
            }`}
          >
            {loading ? "설정 중..." : "확인"}
          </button>
        </form>
      </div>

      {showModal && <ResetCompleteModal />}
    </div>
  );
}
