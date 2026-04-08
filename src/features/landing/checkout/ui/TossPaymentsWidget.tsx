import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY ?? "";

type TossPaymentsWidgetProps = {
  amount: number;
  userId: string;
};

export function TossPaymentsWidget({
  amount,
  userId,
}: TossPaymentsWidgetProps) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const customerKey = userId;

  useEffect(() => {
    async function fetchPaymentWidgets() {
      if (!clientKey) return;

      // SDK 초기화
      const tossPayments = await loadTossPayments(clientKey);

      // 위젯 인스턴스 생성
      const widgets = tossPayments.widgets({ customerKey });

      // 결제 금액 설정
      await widgets.setAmount({
        currency: "KRW",
        value: amount,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [amount, customerKey]);

  useEffect(() => {
    async function renderWidgets() {
      if (widgets == null) return;

      // 결제 수단 위젯 렌더링
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });

      // 이용약관 위젯 렌더링
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });
    }

    renderWidgets();
  }, [widgets]);

  const handlePaymentRequest = async () => {
    if (widgets == null) return;

    try {
      //결제 요청
      await widgets.requestPayment({
        orderId: `order_${Math.random().toString(36).slice(2, 11)}`,
        orderName: "쌤비 이용권 결제",
        successUrl: `${window.location.origin}/checkout/payment/success`,
        failUrl: `${window.location.origin}/checkout/payment/fail`,
      });
    } catch (error) {
      console.error("결제 요청 중 에러 발생:", error);
    }
  };
  return (
    <div className="space-y-4">
      <div
        id="payment-method"
        className="min-h-[220px] border border-gray-200 rounded-xl overflow-hidden"
      >
        {!widgets && (
          <div className="flex items-center justify-center h-[220px] bg-gray-50 text-sm text-gray-400">
            <p className="animate-pulse">결제 수단을 불러오는 중...</p>
          </div>
        )}
      </div>

      <div
        id="agreement"
        className="min-h-[80px] border border-gray-200 rounded-xl overflow-hidden"
      >
        {!widgets && (
          <div className="flex items-center justify-center h-[80px] px-4 bg-gray-50 text-sm text-gray-400">
            약관 로딩 중...
          </div>
        )}
      </div>

      <button
        onClick={handlePaymentRequest}
        disabled={!widgets}
        className="w-full py-4 bg-brand-700 hover:bg-[#2952e0] text-white rounded-xl font-bold text-base transition-all duration-200 cursor-pointer active:scale-[0.99] shadow-lg shadow-blue-100"
      >
        {amount.toLocaleString("ko-KR")}원 결제하기
      </button>

      <p className="text-xs text-center text-gray-400">
        결제 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
