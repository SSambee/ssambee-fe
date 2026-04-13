import { axiosClient } from "@/shared/common/api/axiosClient";
import { ApiResponse } from "@/shared/common/types/api";

import { BankPaymentRequest, BankPaymentResponse } from "../types";

export const createBankPayment = async (
  data: BankPaymentRequest
): Promise<ApiResponse<BankPaymentResponse>> => {
  const response = await axiosClient.post<ApiResponse<BankPaymentResponse>>(
    "/payments/bank-transfer",
    data
  );
  return response.data;
};
