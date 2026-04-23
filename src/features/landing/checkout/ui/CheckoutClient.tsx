"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";

import { PaymentMethod } from "@/features/landing/checkout/types";
import { PAYMENT_METHODS } from "@/features/landing/checkout/lib/constants";
import { pricingQueries } from "@/shared/landing/pricing/api/query";
import { useCheckoutStore } from "@/shared/common/store/useCheckoutStore";
import {
  PassSingleProduct,
  CreditPackProduct,
} from "@/shared/landing/pricing/types";

import { PlanSummaryCard } from "./PlanSummaryCard";
// import { TossPaymentsWidget } from "./TossPaymentsWidget";
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
  // const { user } = useAuthContext();
  // const userId = user?.id ?? "";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const selectedPlan = useCheckoutStore((state) => state.selectedPlan);
  const selectedToken = useCheckoutStore((state) => state.selectedToken);

  const { data } = useSuspenseQuery(pricingQueries.products());

  const currentPlan =
    selectedPlan ??
    (initialPlanId
      ? (data.passSingleProducts.find(
          (p: PassSingleProduct) => p.id === initialPlanId
        ) ?? data.passSingleProducts[0])
      : data.passSingleProducts[0]);

  const currentToken =
    selectedToken ??
    (initialTokenId
      ? (data.creditPackProducts.find(
          (t: CreditPackProduct) => t.id === initialTokenId
        ) ?? null)
      : null);

  const amount = currentToken?.price ?? currentPlan.price;
  const productId = currentToken?.id ?? currentPlan.id;

  const handleBankSuccess = ({
    hadActiveEntitlement,
  }: {
    hadActiveEntitlement: boolean;
  }) => {
    if (hadActiveEntitlement) {
      router.push("/educators");
      return;
    }
    router.push("/entitlement-pending");
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
          <PlanSummaryCard plan={currentPlan} tokenInfo={currentToken} />
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
              <>
                {/* 개발 완료 후 아래 주석 해제
                <TossPaymentsWidget
                  amount={amount}
                  userId={userId}
                  productId={productId}
                />
                */}
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-brand-50">
                    <CreditCard className="w-10 h-10 text-brand-600" />
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-gray-900">
                    카드 결제 서비스 준비 중
                  </h2>

                  <p className="text-[15px] leading-relaxed text-gray-600">
                    현재 토스 결제 기능을 준비 중입니다.
                    <br />
                    무통장 입금 기능을 이용해주세요.
                  </p>
                </div>
              </>
            ) : (
              <BankFormSection
                amount={amount}
                productId={productId}
                productDisplayName={currentToken?.name ?? currentPlan.name}
                onSuccess={handleBankSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
