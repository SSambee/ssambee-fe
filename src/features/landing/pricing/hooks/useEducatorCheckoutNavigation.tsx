"use client";

import { useRouter } from "next/navigation";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { useModal } from "@/app/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import { isEducatorRole } from "@/features/landing/lib/educatorRole";

export function useEducatorCheckoutNavigation() {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();
  const { openModal } = useModal();

  const goToCheckout = (params: URLSearchParams) => {
    if (isLoading) return;

    if (!user) {
      openModal(
        <CheckModal
          title="안내"
          description="로그인이 필요합니다."
          confirmText="로그인"
          cancelText="닫기"
          onConfirm={() => {
            router.push("/educators/login");
          }}
        />
      );
      return;
    }

    if (!isEducatorRole(user.userType)) {
      openModal(
        <CheckModal
          title="안내"
          description="강사만 접근 가능합니다."
          confirmText="확인"
          hideCancel
          onConfirm={() => {}}
        />
      );
      return;
    }

    router.push(`/checkout?${params.toString()}`);
  };

  return { goToCheckout, isLoading };
}
