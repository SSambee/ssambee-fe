"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import { authCodeSchema } from "@/validation/auth.validation";
import { useAuthCodeStore } from "@/stores/registered.store";
import { AuthCodeFormData } from "@/types/auth.type";
import { AUTH_CODE_FORM_DEFAULTS } from "@/constants/auth.defaults";
import { verifyAuthCodeAPI } from "@/services/auth.service";
import { InputForm } from "@/components/common/input/InputForm";
import { useDialogAlert } from "@/hooks/useDialogAlert";

export default function AuthenticationCodeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { isCodeVerified, setAuthCode, setCodeVerified } = useAuthCodeStore();
  const { showAlert } = useDialogAlert();

  const {
    register,
    getValues,
    trigger,
    reset,
    control,
    getFieldState,
    formState,
    setValue,
    clearErrors,
  } = useForm<AuthCodeFormData>({
    resolver: zodResolver(authCodeSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: AUTH_CODE_FORM_DEFAULTS,
  });

  const { errors } = formState;

  const signupCodeValue = useWatch({ control, name: "signupCode" });
  const codeField = getFieldState("signupCode", formState);
  const isCodeInputValid = signupCodeValue?.trim() && !codeField.error;

  const handleVerifyCode = async () => {
    const isValidCode = await trigger("signupCode");
    if (!isValidCode) {
      await showAlert({ description: "인증번호를 입력해주세요." });
      return;
    }

    const signupCode = getValues("signupCode").trim();

    try {
      setIsLoading(true);
      const res = await verifyAuthCodeAPI(signupCode);

      if (res.success) {
        setAuthCode(signupCode);
        setCodeVerified(true);
        await showAlert({ description: "인증번호 인증 완료!" });
      } else {
        setCodeVerified(false);
        reset({ signupCode: "" });
        await showAlert({ description: "인증번호 매칭에 실패했습니다." });
      }
    } catch {
      setCodeVerified(false);
      reset({ signupCode: "" });
      await showAlert({ description: "인증 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-start gap-[10px]">
          <div className="flex-1">
            <InputForm
              id="signupCode"
              label="인증 코드 (6자리)"
              type="text"
              disabled={isLoading || isCodeVerified}
              error={errors.signupCode?.message}
              {...register("signupCode")}
              showReset={!!signupCodeValue}
              onReset={() => {
                setValue("signupCode", "");
                clearErrors("signupCode");
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={!isCodeInputValid || isLoading || isCodeVerified}
            className={`px-10 h-[58px] rounded-lg font-medium whitespace-nowrap transition-colors ${
              isLoading
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : isCodeVerified
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isCodeInputValid
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md"
                    : "bg-blue-100 text-blue-300 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? "인증 중..."
              : isCodeVerified
                ? "인증 완료"
                : "인증 요청"}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          * 소속 학원 및 담당 강사 정보가 코드를 통해 자동으로 연결됩니다.
        </p>
      </div>
    </div>
  );
}
