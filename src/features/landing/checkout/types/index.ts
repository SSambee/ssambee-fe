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
