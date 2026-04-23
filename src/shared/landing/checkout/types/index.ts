export type ReceiptType = "CASH_RECEIPT" | "BUSINESS_RECEIPT";

export type CashReceiptRequest = {
  type: "CASH_RECEIPT";
  phoneNumber: string;
};

export type BusinessReceiptRequest = {
  type: "BUSINESS_RECEIPT";
  businessRegistrationNumber: string;
  businessName: string;
  representativeName: string;
  taxInvoiceEmail: string;
  businessType: string;
  businessCategory: string;
  businessAddress: string;
};

export type ReceiptRequest = CashReceiptRequest | BusinessReceiptRequest;

export type BankPaymentRequest = {
  productId: string;
  quantity: number;
  depositorName: string;
  depositorBankName: string;
  receiptRequest?: ReceiptRequest;
};

export type BankPaymentResponse = {
  paymentId: string;
  status: string;
  message?: string;
};
