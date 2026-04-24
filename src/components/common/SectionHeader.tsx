"use client";

import { ReactNode } from "react";

import Title from "@/components/common/header/Title";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Title title={title} description={description} />
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
