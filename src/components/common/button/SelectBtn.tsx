"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectCloseIcon, SelectOpenIcon } from "@/components/icons/AuthIcons";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string | ReactNode;
  value: string;
};

type CommonSelectProps = {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  className?: string;
  isError?: boolean;
  disabled?: boolean;
  variant?: "default" | "figma";
  optionSize?: "sm" | "lg";
};

export default function SelectBtn({
  id,
  value,
  onChange,
  placeholder,
  options,
  className,
  disabled,
  isError,
  variant = "default",
  optionSize = "lg",
}: CommonSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeStyles = {
    sm: "py-1.5 text-sm",
    lg: "py-3 px-4 text-base",
  };

  const baseClasses =
    variant === "figma"
      ? "flex w-full h-14 items-center justify-between rounded-[12px] border bg-white px-4 text-[16px] font-medium text-[#8b90a3] shadow-none"
      : "flex w-full py-4 px-4 items-center justify-between text-gray-500 font-normal rounded-lg border outline-none cursor-pointer text-base shadow-none!";

  const stateClasses =
    variant === "figma"
      ? isError
        ? "border-red-600"
        : "border-[#d6d9e0]"
      : isError
        ? "border-red-600 focus:ring-1 focus:ring-red-600"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const disabledClasses =
    variant === "figma"
      ? "bg-gray-100 cursor-not-allowed opacity-70"
      : "bg-gray-100 cursor-not-allowed opacity-70";

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        id={id}
        disabled={disabled}
        className={cn(
          baseClasses,
          "[&>svg]:hidden outline-none rounded-[12px]",
          stateClasses,
          disabled ? disabledClasses : "",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
        <div className="ml-2 shrink-0">
          {isOpen ? (
            <SelectOpenIcon size={24} />
          ) : (
            <SelectCloseIcon size={24} />
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-none! rounded-[12px]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn(
              "cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors",
              sizeStyles[optionSize]
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
