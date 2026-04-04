import { z } from "zod";

import { KR_PHONE_REGEX } from "@/constants/regex";

import { BANKS } from "./types";

export const bankFormBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .min(2, "이름은 최소 2자 이상이어야 합니다"),
  phone: z
    .string()
    .trim()
    .min(1, "전화번호를 입력해주세요")
    .regex(KR_PHONE_REGEX, "전화번호 형식이 올바르지 않습니다"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  bank: z
    .string()
    .trim()
    .min(1, "입금 은행을 선택해주세요")
    .refine((val) => BANKS.includes(val), "올바른 은행을 선택해주세요"),
  depositorName: z
    .string()
    .trim()
    .min(1, "입금자명을 입력해주세요")
    .min(2, "입금자명은 최소 2자 이상이어야 합니다"),
  receiptType: z.enum(["none", "cash", "tax"]),
  customerType: z.enum(["personal", "business"]),
  cashReceiptPhone: z.string().trim(),
  businessNumber: z.string().trim(),
  businessName: z.string().trim(),
  ceoName: z.string().trim(),
  businessEmail: z.string().trim(),
  businessType: z.string().trim(),
  businessCategory: z.string().trim(),
  businessAddress: z.string().trim(),
});

export const bankFormSchema = bankFormBaseSchema.superRefine((data, ctx) => {
  if (data.receiptType === "cash") {
    if (data.customerType === "personal") {
      if (!data.cashReceiptPhone) {
        ctx.addIssue({
          code: "custom",
          message: "현금영수증 발급 휴대폰 번호를 입력해주세요",
          path: ["cashReceiptPhone"],
        });
      } else if (!KR_PHONE_REGEX.test(data.cashReceiptPhone)) {
        ctx.addIssue({
          code: "custom",
          message: "전화번호 형식이 올바르지 않습니다",
          path: ["cashReceiptPhone"],
        });
      }
    } else if (data.customerType === "business") {
      if (!data.businessNumber) {
        ctx.addIssue({
          code: "custom",
          message: "사업자등록번호를 입력해주세요",
          path: ["businessNumber"],
        });
      }
    }
  }

  if (data.receiptType === "tax") {
    if (!data.businessNumber) {
      ctx.addIssue({
        code: "custom",
        message: "사업자등록번호를 입력해주세요",
        path: ["businessNumber"],
      });
    }
    if (!data.businessName) {
      ctx.addIssue({
        code: "custom",
        message: "사업체명을 입력해주세요",
        path: ["businessName"],
      });
    }
    if (!data.ceoName) {
      ctx.addIssue({
        code: "custom",
        message: "대표자명을 입력해주세요",
        path: ["ceoName"],
      });
    }
    if (!data.businessEmail) {
      ctx.addIssue({
        code: "custom",
        message: "계산서 수신 이메일을 입력해주세요",
        path: ["businessEmail"],
      });
    } else if (!z.string().email().safeParse(data.businessEmail).success) {
      ctx.addIssue({
        code: "custom",
        message: "올바른 이메일 형식이 아닙니다",
        path: ["businessEmail"],
      });
    }
    if (!data.businessType) {
      ctx.addIssue({
        code: "custom",
        message: "업태를 입력해주세요",
        path: ["businessType"],
      });
    }
    if (!data.businessCategory) {
      ctx.addIssue({
        code: "custom",
        message: "종목을 입력해주세요",
        path: ["businessCategory"],
      });
    }
    if (!data.businessAddress) {
      ctx.addIssue({
        code: "custom",
        message: "사업장 주소를 입력해주세요",
        path: ["businessAddress"],
      });
    }
  }
});
