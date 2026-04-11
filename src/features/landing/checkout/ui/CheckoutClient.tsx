"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { PLANS, TOKENS } from "@/features/landing/pricing/lib/types";
import { PaymentMethod } from "@/features/landing/checkout/lib/types";
import { PAYMENT_METHODS } from "@/features/landing/checkout/lib/constants";

import { PlanSummaryCard } from "./PlanSummaryCard";
import { TossPaymentsWidget } from "./TossPaymentsWidget";
import { BankFormSection } from "./BankFormSection";

type CheckoutClientProps = {
  initialPlanId?: string;
  initialTokenId?: string;
};

export function CheckoutClient({
  initialPlanId,
  initialTokenId,
}: CheckoutClientProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const userId = user?.id ?? "";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const currentPlan = initialPlanId
    ? (PLANS.find((p) => p.id === initialPlanId) ?? PLANS[0])
    : PLANS[0];

  const currentToken = initialTokenId
    ? (TOKENS.find((t) => t.id === initialTokenId) ?? TOKENS[0])
    : null;

  const tokenInfo = currentToken;

  const amount =
    initialTokenId && currentToken ? currentToken.price : currentPlan.price;

  const handleBankSubmit = () => {
    alert(
      "무통장 입금 신청이 완료되었습니다. 입금 확인 후 안내 메일을 보내드립니다."
    );
  };

  return (
    <main className="max-w-5xl px-4 py-8 mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold text-gray-900">
            결제 방법 선택
          </h1>
          <button
            onClick={() => router.push("/pricing")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            요금제로 돌아가기
          </button>
        </div>
        <p className="text-sm text-gray-500">편리한 결제 방법을 선택하세요.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-20">
          <PlanSummaryCard plan={currentPlan} tokenInfo={tokenInfo} />
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setPaymentMethod(m.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                  paymentMethod === m.value
                    ? "bg-brand-700 border-brand-700 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-700/40"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            {paymentMethod === "card" ? (
              <TossPaymentsWidget amount={amount} userId={userId} />
            ) : (
              <BankFormSection amount={amount} onSubmit={handleBankSubmit} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
