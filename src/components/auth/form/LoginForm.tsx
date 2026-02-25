"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

import { loginSchema } from "@/validation/auth.validation";
import { LoginFormData, Role } from "@/types/auth.type";
import { LOGIN_FORM_DEFAULTS } from "@/constants/auth.defaults";
import { useAuth } from "@/hooks/useAuth";
import { InputForm } from "@/components/common/input/InputForm";
import {
  CheckedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  // GoogleIcon,
  UncheckedIcon,
} from "@/components/icons/AuthIcons";

type LoginFormProps = {
  selectedRole: Role;
};

const FOOTER_CONFIG = {
  STUDENT: {
    question: "아직 계정이 없으신가요?",
    action: "회원가입하기",
    href: "/learners/register",
  },
  PARENT: {
    question: "아직 계정이 없으신가요?",
    action: "회원가입하기",
    href: "/learners/register",
  },
  DEFAULT: {
    question: "관리자 권한이 필요하신가요?",
    action: "등록 문의하기",
    href: "#",
  },
};

export default function LoginForm({ selectedRole }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { signin, loading } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: LOGIN_FORM_DEFAULTS,
  });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  const isRememberMe = useWatch({
    control,
    name: "rememberMe",
    defaultValue: false,
  });

  // 로그인 버튼 - role 데이터 포함
  const onSubmit = async (data: LoginFormData) => {
    await signin({ ...data, userType: selectedRole });
  };

  // 구글 로그인
  const handleGoogleLogin = () => {
    console.log("구글 로그인 요청");
    // TODO: 구글 OAuth
  };

  const footerContent =
    FOOTER_CONFIG[selectedRole as keyof typeof FOOTER_CONFIG] ||
    FOOTER_CONFIG.DEFAULT;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="mb-4">
          <InputForm
            id="email"
            type="email"
            label="이메일"
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
        </div>

        <div className="mb-4">
          <div className="relative">
            <InputForm
              id="password"
              type={showPassword ? "text" : "password"}
              label="비밀번호"
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
        </div>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="sr-only peer"
            />
            <label
              htmlFor="rememberMe"
              className="flex items-center gap-2 text-4 text-neutral-300 cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 rounded-sm"
            >
              {isRememberMe ? (
                <CheckedIcon size={24} />
              ) : (
                <UncheckedIcon size={24} />
              )}
              <span className="text-4 text-neutral-300">로그인 상태 유지</span>
            </label>
          </div>
          {/* <Link
            href="#"
            className="text-4 font-semibold text-blue-700 hover:text-blue-500 transition-colors duration-200"
          >
            비밀번호 찾기
          </Link> */}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm ${
            !isValid || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
          }`}
          aria-label="로그인"
          aria-disabled={!isValid || loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* <div className="relative mt-11 mb-9">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-4">
          <span className="bg-white text-gray-500">간편 로그인하기</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 text-4 font-semibold bg-white border border-neutral-200 text-neutral-400 py-4 px-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200 shadow-sm"
        aria-label="구글 로그인"
      >
        <GoogleIcon size={20} />
        Google로 로그인하기
      </button> */}

      <div className="flex items-center justify-center gap-2 text-center text-4 text-neutral-400 mt-14">
        <p>{footerContent.question}</p>
        <Link
          href={footerContent.href}
          className="text-blue-700 hover:text-blue-500 font-semibold transition-colors duration-200"
        >
          {footerContent.action}
        </Link>
      </div>
    </>
  );
}
