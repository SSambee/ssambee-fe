import { ReactNode } from "react";

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-99 bg-[#f8f9ff] overflow-y-auto">
      {children}
    </div>
  );
}
