import Image from "next/image";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dropdown_off from "@/assets/icons/dropdown_off.svg";
import dropdown_on from "@/assets/icons/dropdown_on.svg";

type SelectOption = {
  label: string;
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
}: CommonSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        id={id}
        className={`
          flex w-full py-4 px-4 items-center justify-between text-gray-500 font-normal rounded-lg border outline-none cursor-pointer
          [&>svg]:hidden text-base shadow-none!
          ${
            isError
              ? "border-red-600 focus:ring-1 focus:ring-red-600"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }

          /* 비활성화 스타일 */
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}

          /* 커스텀 클래스 */
          ${className ?? ""}
        `.trim()}
      >
        <SelectValue placeholder={placeholder} />
        <div className="ml-2 shrink-0">
          <Image
            src={isOpen ? dropdown_on : dropdown_off}
            alt={isOpen ? "close menu" : "open menu"}
            width={24}
            height={24}
            className="text-gray-400"
          />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-none!">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer py-3 px-4 text-base hover:bg-blue-50 focus:bg-blue-50 transition-colors"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
