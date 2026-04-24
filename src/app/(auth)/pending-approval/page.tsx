"use client";
import { Lock } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function PendingApprovalPage() {
  const { signout, loading } = useAuth();

  const handleSignOut = async () => {
    await signout("MGMT");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <Lock className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          가입 승인 대기 중
        </h1>
        <p className="mb-8 text-gray-600">
          담당 강사님의 승인이 완료된 후 모든 서비스를 이용하실 수 있습니다.
          <br />
          승인 처리가 완료될 때까지 조금만 기다려 주세요!
        </p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#4B72F7] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#3859D4] active:scale-[0.98] disabled:bg-[#4B72F7]/50 cursor-pointer"
        >
          {loading ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>
    </div>
  );
}
