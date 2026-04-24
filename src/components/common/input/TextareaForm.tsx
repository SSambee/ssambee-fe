"use client";

import { forwardRef, ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

type TextareaFormProps = ComponentPropsWithRef<"textarea"> & {
  label: string;
  error?: string;
};

export const TextareaForm = forwardRef<HTMLTextAreaElement, TextareaFormProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          id={id}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer w-full min-h-[120px] px-4 pt-6 pb-2 text-base border rounded-lg outline-none transition-all duration-200 resize-y",
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
            "absolute left-4 top-6 text-base text-gray-400 transition-all duration-200 pointer-events-none origin-left",
            "peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:left-3",
            "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:left-3",
            error && "peer-focus:text-red-600"
          )}
        >
          {label}
        </label>

        {error && (
          <p className="mt-1 text-[12px] text-red-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextareaForm.displayName = "TextareaForm";
