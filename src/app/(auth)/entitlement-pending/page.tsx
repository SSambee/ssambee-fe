"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

import { useCancelBankPayment } from "@/features/landing/checkout/hooks/useCancelBankPayment";
import { usePendingDepositPayment } from "@/features/landing/checkout/hooks/usePendingDepositPayment";
import { formatPendingDepositRequestedAt } from "@/features/landing/checkout/lib/formatPendingDeposit";
import { useDialogAlert } from "@/hooks/useDialogAlert";

export default function EntitlementPendingPage() {
  const router = useRouter();
  const { showConfirm } = useDialogAlert();

  const {
    data: pending,
    isPending: isSessionPending,
    isError: isSessionError,
  } = usePendingDepositPayment();

  const {
    mutate,
    isPending,
    isSuccess: isCancelSuccess,
  } = useCancelBankPayment({
    onSuccess: () => {
      router.push("/pricing");
    },
  });

  const handleCancelPayment = async () => {
    if (isCancelSuccess) return;
    if (!pending) {
      return;
    }
    const confirmed = await showConfirm({
      title: "결제 취소",
      description: `결제 일시: ${formatPendingDepositRequestedAt(pending.requestedAt)}
결제 내용: ${pending.productName}
결제 취소를 진행하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
    });
    if (!confirmed) return;
    mutate(pending.paymentId);
  };

  const cancelDisabled =
    isCancelSuccess ||
    isSessionPending ||
    isSessionError ||
    (!pending && !isCancelSuccess) ||
    isPending;

  const cancelButtonLabel = isCancelSuccess
    ? "결제 취소 완료"
    : isPending
      ? "처리 중..."
      : isSessionPending
        ? "확인 중..."
        : "결제 신청 취소";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <Clock className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          입금 확인 중입니다
        </h1>
        <p className="mb-8 text-gray-600">
          확인이 완료되면 알림 이메일과 함께 서비스를 이용하실 수 있습니다.
          <br />
          조금만 기다려 주세요!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#4B72F7] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#3859D4] active:scale-[0.98] cursor-pointer"
          >
            홈으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={handleCancelPayment}
            disabled={cancelDisabled}
            title={
              isCancelSuccess
                ? "결제 신청이 취소되었습니다."
                : !pending && !isSessionPending
                  ? "입금 대기 결제 정보를 불러올 수 없을 때는 재시도 후 문의해주세요."
                  : undefined
            }
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] border py-4 text-[17px] font-bold transition-all cursor-pointer disabled:cursor-not-allowed ${
              isCancelSuccess
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
            }`}
          >
            {cancelButtonLabel}
          </button>
          {!isCancelSuccess && !isSessionPending && !pending && (
            <p className="text-xs text-gray-500">
              {isSessionError
                ? "회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
                : "취소할 입금 대기 결제 정보를 찾을 수 없습니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
