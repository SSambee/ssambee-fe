"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { useModal } from "@/app/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import { isEducatorRole } from "@/features/landing/lib/educatorRole";

import { CheckoutClient } from "./CheckoutClient";

type CheckoutEducatorGateProps = {
  initialPlanId?: string;
  initialTokenId?: string;
};

export function CheckoutEducatorGate({
  initialPlanId,
  initialTokenId,
}: CheckoutEducatorGateProps) {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const { openModal } = useModal();
  const learnerModalOpened = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/educators/login");
      return;
    }

    if (!isEducatorRole(user.userType) && !learnerModalOpened.current) {
      learnerModalOpened.current = true;
      openModal(
        <CheckModal
          title="안내"
          description="강사만 접근 가능합니다."
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            router.replace("/pricing");
          }}
        />
      );
    }
  }, [isLoading, user, router, openModal]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-gray-500">
        불러오는 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-gray-500">
        이동 중...
      </div>
    );
  }

  if (!isEducatorRole(user.userType)) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-gray-500">
        안내 확인 후 이용해 주세요.
      </div>
    );
  }

  return (
    <CheckoutClient
      initialPlanId={initialPlanId}
      initialTokenId={initialTokenId}
    />
  );
}
