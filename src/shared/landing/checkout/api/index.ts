import { axiosClient } from "@/shared/common/api/axiosClient";
import { ApiResponse } from "@/shared/common/types/api";

import { BankPaymentRequest, BankPaymentResponse } from "../types";

export const createBankPayment = async (
  data: BankPaymentRequest
): Promise<ApiResponse<BankPaymentResponse>> => {
  const response = await axiosClient.post<ApiResponse<BankPaymentResponse>>(
    "billing/payments/bank-transfer",
    data
  );
  return response.data;
};

/** 응답 `data`는 프론트에서 미사용 — 필요해지면 그때 타입만 좁히면 됨 */
export const cancelBankPayment = async (
  paymentId: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosClient.post<ApiResponse<unknown>>(
    `billing/payments/${paymentId}/cancel`
  );
  return response.data;
};
