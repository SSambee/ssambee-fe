import { PaymentMethod, ReceiptType, CustomerType } from "./types";

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
