"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  registerFormSchema,
  registerRequestSchema,
} from "@/validation/auth.validation";
import { RegisterFormData, RegisterUser, Role } from "@/types/auth.type";
import { useAuthStore, useSchoolStore } from "@/stores/registered.store";
import { REGISTER_FORM_DEFAULTS } from "@/constants/auth.defaults";
import { verifyPhoneAPI } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { phoneNumberFormatter } from "@/utils/phone";
import { InputForm } from "@/components/common/input/InputForm";
import {
  CheckedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  UncheckedIcon,
} from "@/components/icons/AuthIcons";

type RegisterFormProps = {
  requireAuthCode?: boolean; // 인증 코드 필요 여부 - 조교
  requireSchoolInfo?: boolean; // 학원 정보 필요 여부 - 학생
  roleType: "EDUCATORS" | "LEARNERS"; // 사용자 타입 (라우팅용: educators, learners)
  userType: Role;
};

export default function RegisterForm({
  requireAuthCode = false,
  requireSchoolInfo = false,
  roleType,
  userType,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const { signup, loading } = useAuth();

  const {
    isPhoneVerified,
    isCodeVerified,
    signupCode,
    setPhoneVerified,
    resetAuth,
  } = useAuthStore();

  const { school, schoolYear, isSchoolInfoValid, resetSchoolInfo } =
    useSchoolStore();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    getValues,
    setValue,
    control,
    getFieldState,
    formState,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: REGISTER_FORM_DEFAULTS,
  });

  const { errors, isValid } = formState;

  // 실시간 값 감시 - 리셋 버튼 표시 여부
  const nameValue = useWatch({ control, name: "name" });
  const emailValue = useWatch({ control, name: "email" });
  const phoneNumberValue = useWatch({ control, name: "phoneNumber" });
  const passwordValue = useWatch({ control, name: "password" });
  const passwordConfirmValue = useWatch({ control, name: "passwordConfirm" });

  const { error: phoneError } = getFieldState("phoneNumber", formState);
  const isPhoneInputValid = phoneNumberValue && !phoneError;

  const isAgreePrivacy = useWatch({
    control,
    name: "agreePrivacy",
    defaultValue: false,
  });

  // 뒤로가기 시 상태 초기화
  useEffect(() => {
    resetAuth();
    resetSchoolInfo();
  }, [resetAuth, resetSchoolInfo]);

  // 전화번호 인증 버튼
  const handleVerifyPhone = async () => {
    const isValidPhoneNumber = await trigger("phoneNumber");
    if (!isValidPhoneNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const phoneNumber = getValues("phoneNumber");

    try {
      setPhoneLoading(true);
      const res = await verifyPhoneAPI(phoneNumber);

      if (res.success) {
        setPhoneVerified(true);
        alert("전화번호 인증 완료!");
      } else {
        setPhoneVerified(false);
        setValue("phoneNumber", "");
        alert("전화번호 인증에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      setPhoneVerified(false);
      setValue("phoneNumber", "");
      alert("인증 중 오류가 발생했습니다.");
    } finally {
      setPhoneLoading(false);
    }
  };

  // 회원가입 제출
  const onSubmit = async (data: RegisterFormData) => {
    if (!isPhoneVerified) {
      setError("phoneNumber", {
        type: "manual",
        message: "연락처 인증을 완료해주세요",
      });
      return;
    }

    // 인증 코드 검증 - 외부 폼
    if (requireAuthCode && !isCodeVerified) {
      alert("인증 코드 검사를 완료해주세요.");
      return;
    }

    // 학교 정보 검증 - 외부 폼
    if (requireSchoolInfo && !isSchoolInfoValid) {
      alert("학교 정보를 모두 입력해주세요.");
      return;
    }

    // 전화 번호 하이픈 포맷 적용(한 번 더)
    const formattedPhone = phoneNumberFormatter(data.phoneNumber);

    // passwordConfirm 제거
    const baseData = registerRequestSchema.parse({
      ...data,
      phoneNumber: formattedPhone,
    });

    // 특수 항목 포함
    const submitData: RegisterUser = {
      ...baseData,
      ...(signupCode ? { signupCode } : {}),
      ...(requireSchoolInfo ? { school, schoolYear } : {}),
      userType,
    };

    await signup(submitData);
  };

  const isSubmitDisabled =
    !isValid ||
    loading ||
    !isPhoneVerified ||
    (requireAuthCode && !isCodeVerified) ||
    (requireSchoolInfo && !isSchoolInfoValid);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          id="name"
          type="text"
          label="이름"
          error={errors.name?.message}
          {...register("name")}
          showReset={!!nameValue}
          onReset={() => {
            setValue("name", "");
            clearErrors("name");
          }}
        />

        <div className="flex items-start gap-[10px]">
          <InputForm
            id="phoneNumber"
            label="전화번호"
            type="tel"
            disabled={isPhoneVerified || phoneLoading}
            error={errors.phoneNumber?.message}
            {...register("phoneNumber", {
              onChange: (e) => {
                const formatted = phoneNumberFormatter(e.target.value);
                setValue("phoneNumber", formatted);
              },
            })}
            showReset={!!phoneNumberValue && !isPhoneVerified}
            onReset={() => {
              setValue("phoneNumber", "");
              clearErrors("phoneNumber");
            }}
          />

          <button
            type="button"
            onClick={handleVerifyPhone}
            disabled={!isPhoneInputValid || isPhoneVerified || phoneLoading}
            className={`px-10 h-[58px] rounded-lg font-medium whitespace-nowrap transition-colors ${
              phoneLoading
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : isPhoneVerified
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isPhoneInputValid
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md"
                    : "bg-blue-100 text-blue-300 cursor-not-allowed"
            }`}
          >
            {phoneLoading
              ? "인증 중..."
              : isPhoneVerified
                ? "인증 완료"
                : "인증 요청"}
          </button>
        </div>

        <InputForm
          id="email"
          label="이메일"
          type="email"
          error={errors.email?.message}
          {...register("email")}
          showReset={!!emailValue}
          onReset={() => {
            setValue("email", "");
            clearErrors("email");
          }}
        />

        <div className="grid grid-cols-2 gap-[10px]">
          <div>
            <div className="relative">
              <InputForm
                id="password"
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                error={errors.password?.message}
                {...register("password")}
                showReset={!!passwordValue}
                onReset={() => {
                  setValue("password", "");
                  clearErrors("password");
                }}
              />

              {passwordValue && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-13 top-[30px] -translate-y-1/2 cursor-pointer"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                  }
                >
                  {showPassword ? (
                    <EyeOpenIcon size={22} />
                  ) : (
                    <EyeClosedIcon size={22} />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <InputForm
              id="passwordConfirm"
              label="비밀번호 확인"
              type={showPasswordConfirm ? "text" : "password"}
              error={errors.passwordConfirm?.message}
              {...register("passwordConfirm")}
              showReset={!!passwordConfirmValue}
              onReset={() => {
                setValue("passwordConfirm", "");
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
        </div>

        <div>
          <div className="flex items-center">
            <input
              id="agreePrivacy"
              type="checkbox"
              {...register("agreePrivacy")}
              className="hidden"
            />
            <label
              htmlFor="agreePrivacy"
              className="flex items-center gap-2 text-4 text-neutral-300 cursor-pointer"
            >
              {isAgreePrivacy ? (
                <CheckedIcon size={24} />
              ) : (
                <UncheckedIcon size={24} />
              )}
              <div className="flex items-center text-4">
                <span className="text-blue-700 font-semibold">
                  개인정보 처리 방침
                </span>
                <span className="text-neutral-300 mx-1.5"> 및 </span>
                <span className="text-blue-700 font-semibold">
                  서비스 이용약관
                </span>
                <span className="text-neutral-300 ml-0.5">에 동의합니다.</span>
              </div>
            </label>
          </div>

          {errors.agreePrivacy && (
            <p
              id="agreePrivacy-error"
              className="mt-1 text-[12px] text-red-600"
            >
              {errors.agreePrivacy.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || isSubmitDisabled}
          className={`w-full py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm mt-[38px] ${
            loading || isSubmitDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
          }`}
        >
          {loading ? "처리 중..." : "회원가입"}
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 text-center text-4 text-neutral-400 mt-[38px]">
        <p>이미 계정이 있으신가요?</p>
        <Link
          href={
            roleType === "EDUCATORS" ? "/educators/login" : "/learners/login"
          }
          className="text-blue-700 hover:text-blue-500 font-semibold transition-colors duration-200"
        >
          로그인하기
        </Link>
      </div>
    </div>
  );
}
