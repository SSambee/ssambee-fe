import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import { cancelBankPayment } from "@/shared/landing/checkout/api";

import { pendingDepositEntitlementQueryKey } from "./usePendingDepositPayment";

type Options = {
  onSuccess?: () => void | Promise<void>;
};

export const useCancelBankPayment = (options?: Options) => {
  const { showAlert } = useDialogAlert();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => cancelBankPayment(paymentId),

    onSuccess: async () => {
      await showAlert({
        title: "결제 신청 취소 완료",
        description: "입금 확인 대기 중이던 결제 신청이 취소되었습니다.",
      });
      await queryClient.invalidateQueries({
        queryKey: pendingDepositEntitlementQueryKey,
      });
      await options?.onSuccess?.();
    },

    onError: async (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "결제 신청 취소 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      await showAlert({
        title: "결제 신청 취소 실패",
        description: message,
      });
    },
  });
};
