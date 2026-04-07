"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import Image from "next/image";
import axios, { isAxiosError } from "axios";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const paymentKey = searchParams.get("paymentKey");
  const orderName = searchParams.get("orderName") || "쌤비 이용권";

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderId || !amount || !paymentKey) return;

      try {
        await axios.post("/api/confirm/widget", {
          orderId,
          amount,
          paymentKey,
        });
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const { message, code } = error.response?.data || {
            message: "결제 승인 중 오류가 발생했습니다.",
            code: "UNKNOWN_ERROR",
          };
          router.push(
            `/checkout/payment/fail?code=${code}&message=${encodeURIComponent(message)}`
          );
        } else {
          console.error("예상치 못한 에러 발생:", error);
          router.push(
            `/checkout/payment/fail?code=RUNTIME_ERROR&message=${encodeURIComponent("시스템 오류가 발생했습니다.")}`
          );
        }
      }
    };

    confirmPayment();
  }, [router, orderId, amount, paymentKey]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-10 shadow-lg flex flex-col items-center">
        <Image
          width={100}
          height={100}
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="결제 완료 아이콘"
          priority
        />

        <h2 className="mt-6 mb-10 text-2xl font-bold text-gray-900">
          결제를 완료했어요
        </h2>

        <div className="w-full space-y-4 border-t border-b border-gray-100 py-6">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500 font-medium">구매 내역</div>
            <div className="text-gray-900 font-semibold text-right max-w-[250px] truncate">
              {orderName}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500 font-medium">결제금액</div>
            <div className="text-xl font-extrabold text-brand-600" id="amount">
              {`${Number(amount || 0).toLocaleString()}원`}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-2">
            <div className="text-gray-400">주문번호</div>
            <div className="text-gray-600 font-mono" id="orderId">
              {orderId}
            </div>
          </div>
        </div>

        <div className="mt-12 w-full flex justify-center">
          <button
            onClick={() => router.replace("/")}
            className="w-full cursor-pointer rounded-xl bg-brand-600 py-4 text-center text-base font-bold text-white transition-colors hover:bg-brand-700 active:scale-[0.99] border-none"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </main>
  );
}

export default function WidgetSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="text-center text-gray-500">
            결제 상태를 확인 중입니다...
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
