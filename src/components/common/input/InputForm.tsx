"use client";

import { forwardRef, ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";
import { ResetIcon } from "@/components/icons/AuthIcons";

type InputFormProps = ComponentPropsWithRef<"input"> & {
  label: string;
  error?: string;
  onReset?: () => void;
  showReset?: boolean;
  floating?: boolean; // 플로팅 여부 결정 (기본값 true)
};

export const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
  (
    {
      label,
      error,
      className,
      id,
      onReset,
      showReset,
      floating = true,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn("relative w-full flex flex-col", !floating && "gap-1.5")}
      >
        <div className="relative">
          <input
            id={id}
            ref={ref}
            placeholder={floating ? " " : placeholder} // 플로팅일 때만 빈 문자열 유지
            className={cn(
              "peer w-full h-[58px] px-4 text-base border rounded-lg outline-none transition-all duration-200",
              "focus:ring-2 focus:border-transparent",
              floating ? "pt-2 pb-2" : "py-4", // 플로팅 아닐 땐 상하 패딩 균등하게
              error
                ? "border-red-600 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />

          {/* 플로팅 라벨 모드 */}
          {floating && (
            <label
              htmlFor={id}
              className={cn(
                // 기본 위치 (인풋 내부 중간)
                "absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-200 pointer-events-none origin-left",

                // 포커스되거나 값이 있을 때 위로 이동
                "peer-focus:top-0 peer-focus:text-xs rounded-sm peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-1 peer-focus:translate-y-[-50%] peer-focus:left-3",
                "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:left-3",

                // 에러 시 포커스 컬러 변경
                error && "peer-focus:text-red-600"
              )}
            >
              {label}
            </label>
          )}

          {/* 리셋 버튼 위치 조정 (라벨 유무에 상관없이 인풋 중앙 우측) */}
          {showReset && onReset && !props.disabled && (
            <button
              type="button"
              onClick={onReset}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
              tabIndex={-1}
              aria-label="Reset input"
            >
              <ResetIcon size={22} />
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-[12px] text-red-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputForm.displayName = "InputForm";
