export type PaymentMethod = "card" | "bank";
export type ReceiptType = "none" | "cash" | "tax";
export type CustomerType = "personal" | "business";

export type BankForm = {
  bank: string;
  depositorName: string;
  receiptType: ReceiptType;
  customerType: CustomerType;
  cashReceiptPhone: string;
  businessNumber: string;
  businessName: string;
  ceoName: string;
  businessEmail: string;
  businessType: string;
  businessCategory: string;
  businessAddress: string;
};

export const INITIAL_FORM: BankForm = {
  bank: "",
  depositorName: "",
  receiptType: "none",
  customerType: "personal",
  cashReceiptPhone: "",
  businessNumber: "",
  businessName: "",
  ceoName: "",
  businessEmail: "",
  businessType: "",
  businessCategory: "",
  businessAddress: "",
};

export const BANKS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "SC제일은행",
  "씨티은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
  "우체국",
  "새마을금고",
  "신협",
  "수협은행",
];
