"use client";

import Image from "next/image";

import instructorIcon from "@/assets/icons/instructor.svg";
import assistantIcon from "@/assets/icons/assistant.svg";
import studentIcon from "@/assets/icons/student.svg";
import parentIcon from "@/assets/icons/parent.svg";
import { Role, RoleOption } from "@/types/auth.type";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const ROLE_INFO_MAP = {
  INSTRUCTOR: {
    icon: instructorIcon,
    title: "강사예요",
    description: "수업 및 일정을 관리하고 운영해요",
  },
  ASSISTANT: {
    icon: assistantIcon,
    title: "조교예요",
    description: "수업에 필요한 업무 및 소통을 도와요",
  },
  STUDENT: {
    icon: studentIcon,
    title: "학생이에요",
    description: "내 수업과 시험 정보를 확인해요",
  },
  PARENT: {
    icon: parentIcon,
    title: "학부모예요",
    description: "자녀의 학습 현황을 확인해요",
  },
} as const;

const getRoleStyles = (isSelected: boolean) => ({
  card: cn(
    "flex-1 shrink-0 flex p-6 items-center gap-[10px] cursor-pointer transition-colors duration-200 border-1",
    "hover:shadow-md active:scale-[0.98]",
    isSelected
      ? "bg-brand-25 border-brand-600 shadow-md"
      : "bg-surface-normal-light border-neutral-200 hover:border-neutral-200 hover:bg-neutral-50"
  ),
  title: cn(
    "text-[18px] font-semibold leading-none",
    isSelected ? "text-brand-800" : "text-neutral-500"
  ),
  description: cn(
    "text-sm mt-1 break-keep",
    isSelected ? "text-neutral-400" : "text-neutral-300"
  ),
});

type RoleSelectorBtnProps<T extends Role> = {
  options: RoleOption<T>[];
  value: T;
  onChange: (role: T) => void;
};

export default function RoleSelectorBtn<T extends Role>({
  options,
  value,
  onChange,
}: RoleSelectorBtnProps<T>) {
  return (
    <div aria-label="역할 선택" className="w-full flex gap-3 mb-12">
      {options.map((option) => {
        const isSelected = value === option.value;
        const info = ROLE_INFO_MAP[option.value as keyof typeof ROLE_INFO_MAP];
        const styles = getRoleStyles(isSelected);

        return (
          <Card
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={styles.card}
          >
            <CardContent className="flex items-start gap-4 p-0 w-full">
              {/* 왼쪽: 아이콘 영역 */}

              <Image
                src={info.icon}
                alt={option.label}
                width={24}
                height={24}
                className={cn(
                  "flex justify-center items-start shrink-0",
                  isSelected ? "text-brand-800" : "text-neutral-500"
                )}
              />

              {/* 오른쪽: 텍스트 정보 영역 */}
              <div className="flex flex-col">
                <span className={styles.title}>{info.title}</span>
                <p className={styles.description}>{info.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
