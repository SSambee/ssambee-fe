"use client";

import { forwardRef, ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";
import { ResetIcon } from "@/components/icons/AuthIcons";

type InputFormProps = ComponentPropsWithRef<"input"> & {
  label: string;
  error?: string;
  onReset?: () => void;
  showReset?: boolean;
};

export const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
  ({ label, error, className, id, onReset, showReset, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          /* placeholder에 빈 문자열 줘야 :placeholder-shown 작동 */
          placeholder=" "
          className={cn(
            "peer w-full h-[58px] px-4 pt-2 pb-2 text-base border rounded-lg outline-none transition-all duration-200",
            "focus:ring-2 focus:border-transparent",
            error
              ? "border-red-600 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-500",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {/* 플로팅 라벨 */}
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

        {showReset && onReset && !props.disabled && (
          <button
            type="button"
            onClick={onReset}
            className="absolute right-4 top-[29px] -translate-y-1/2 z-20 p-1 hover:bg-gray-100 rounded-full transition-colors"
            tabIndex={-1} // 탭 이동 시 버튼 제외
            aria-label="Reset input"
          >
            <ResetIcon size={22} />
          </button>
        )}

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
