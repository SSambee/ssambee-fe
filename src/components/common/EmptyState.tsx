"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  message?: string;
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
};

export default function EmptyState({
  message = "데이터를 찾을 수 없습니다.",
  showBackButton = true,
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 py-8">
      <p>{message}</p>
      {showBackButton && (
        <Button onClick={() => router.back()} className="mt-4 cursor-pointer">
          돌아가기
        </Button>
      )}
    </div>
  );
}
