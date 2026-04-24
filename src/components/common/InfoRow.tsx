"use client";

import { ReactNode } from "react";

type InfoRowProps = {
  label: string;
  children: ReactNode;
};

export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}
