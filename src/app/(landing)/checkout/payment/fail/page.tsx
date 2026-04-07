"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("code") || "UNKNOWN_ERROR";
  const errorMessage =
    searchParams.get("message") || "결제 중 알 수 없는 오류가 발생했습니다.";

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[600px] rounded-2xl bg-white p-10 shadow-lg flex flex-col items-center">
        <Image
          width={100}
          height={100}
          src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
          alt="결제 실패 애니메이션"
          unoptimized
          className="block"
        />

        <h2 className="mt-6 mb-10 text-2xl font-bold text-gray-900 text-center">
          결제를 실패했어요
        </h2>

        <div className="w-full space-y-4 border-t border-b border-gray-100 py-6">
          <div className="flex justify-between items-start text-sm">
            <div className="text-gray-500 font-medium min-w-[100px] text-left">
              에러 메시지
            </div>
            <div className="text-gray-900 font-semibold text-right max-w-[350px] break-keep">
              {errorMessage}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500 font-medium text-left">에러 코드</div>
            <div className="text-sm font-mono font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
              {errorCode}
            </div>
          </div>
        </div>

        <div className="mt-12 w-full flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.replace("/checkout")}
            className="flex-1 cursor-pointer rounded-xl bg-brand-600 py-4 text-center text-base font-bold text-white transition-colors hover:bg-brand-700 active:scale-[0.99] border-none"
          >
            결제 페이지로 이동
          </button>

          <button
            onClick={() => router.replace("/")}
            className="flex-1 cursor-pointer rounded-xl bg-gray-100 py-4 text-center text-base font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-[0.99] border-none"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </main>
  );
}

// 7. success 페이지와 동일한 Suspense 구조 (fallback 포함)
export default function FailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="text-center text-gray-500 font-medium">
            에러 정보를 불러오는 중...
          </div>
        </main>
      }
    >
      <FailContent />
    </Suspense>
  );
}
