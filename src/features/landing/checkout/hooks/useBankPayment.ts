import { useMutation } from "@tanstack/react-query";

import { useDialogAlert } from "@/hooks/useDialogAlert";
import { createBankPayment } from "@/shared/checkout/api";
import { BankPaymentRequest } from "@/shared/checkout/types";

export const useBankPayment = () => {
  const { showAlert } = useDialogAlert();

  return useMutation({
    mutationFn: (data: BankPaymentRequest) => createBankPayment(data),

    onSuccess: () => {
      return showAlert({
        title: "신청 완료",
        description:
          "무통장 입금 신청이 완료되었습니다.\n입금 확인 후 안내 메일을 보내드립니다.",
      });
    },

    onError: (error: Error) => {
      showAlert({
        title: "신청 실패",
        description: error.message || "무통장 입금 신청에 오류가 발생했습니다.",
      });
    },
  });
};
