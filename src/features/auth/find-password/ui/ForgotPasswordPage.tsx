"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InputForm } from "@/components/common/input/InputForm";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { postFindPassword } from "@/shared/common/api/passwordReset";

import EmailSentModal from "./EmailSentModal";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { showAlert } = useDialogAlert();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const result = await postFindPassword(_data.email);
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
          비밀번호를 잊으셨나요?
        </h1>
        <p className="text-sm text-neutral-400 mb-7">
          비밀번호를 재설정하려는 계정(이메일)을 입력해주세요.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputForm
            id="email"
            type="email"
            label="이메일"
            placeholder="이메일"
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

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm text-sm ${
              !isValid || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
            }`}
          >
            {loading ? "전송 중..." : "이메일 전송"}
          </button>
        </form>
      </div>

      {showModal && <EmailSentModal />}
    </div>
  );
}
