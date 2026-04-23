import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function NoEntitlementPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <CreditCard className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          사용중인 요금제가 없습니다
        </h1>
        <p className="mb-8 text-gray-600">
          서비스를 이용하시려면 요금제를 선택해주세요.
          <br />
          요금제를 구독하시면 모든 기능을 이용하실 수 있습니다.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#4B72F7] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#3859D4] active:scale-[0.98] cursor-pointer"
          >
            요금제 선택하기
          </Link>
          <Link
            href="/"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-gray-300 bg-white py-4 text-[17px] font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
