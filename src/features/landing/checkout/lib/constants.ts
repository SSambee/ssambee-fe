import { PaymentMethod, ReceiptType, CustomerType, BankForm } from "../types";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "카드 결제" },
  { value: "bank", label: "무통장 입금" },
];

export const RECEIPT_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: "none", label: "미신청" },
  { value: "cash", label: "현금영수증" },
  { value: "tax", label: "세금계산서" },
];

export const CUSTOMER_TYPE_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: "personal", label: "개인" },
  { value: "business", label: "사업자" },
];

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
