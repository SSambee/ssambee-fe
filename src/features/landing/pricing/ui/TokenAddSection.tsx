"use client";

import { TOKENS, TokenAdd } from "@/features/landing/pricing/lib/types";
import { useEducatorCheckoutNavigation } from "@/features/landing/pricing/hooks/useEducatorCheckoutNavigation";

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 mt-0.5 shrink-0 text-gray-400 transition-colors duration-300 group-hover:text-brand-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TokenCard({
  addon,
  onSelect,
}: {
  addon: TokenAdd;
  onSelect: (addon: TokenAdd) => void;
}) {
  return (
    <div className="group flex flex-col p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-500 hover:shadow-2xl hover:shadow-gray-100 hover:translate-y-[-10px] transition-all duration-300">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">💬</span>
          <h3 className="text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand-700">
            카카오톡 {addon.count.toLocaleString("ko-KR")}건
          </h3>
        </div>
        <p className="text-xs text-gray-500">추가 발송 토큰 1회 충전</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold text-gray-900">
            {addon.price.toLocaleString("ko-KR")}
          </span>
          <span className="mb-1 text-sm text-gray-500">원</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          건당 {addon.count > 0 ? Math.round(addon.price / addon.count) : 0}원
        </p>
      </div>

      <ul className="flex-1 mb-6 space-y-2">
        <li className="flex items-start gap-2 text-sm text-gray-600">
          <CheckIcon />
          카카오톡 {addon.count.toLocaleString("ko-KR")}건 즉시 충전
        </li>
        <li className="flex items-start gap-2 text-sm text-gray-600">
          <CheckIcon />
          {addon.options}
        </li>
      </ul>

      <button
        onClick={() => onSelect(addon)}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-brand-700 text-white hover:bg-[#2952e0] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        구매하기
      </button>
    </div>
  );
}

export function TokenAddSection() {
  const { goToCheckout } = useEducatorCheckoutNavigation();

  const handleSelect = (addon: TokenAdd) => {
    const params = new URLSearchParams({ tokenId: addon.id });
    goToCheckout(params);
  };

  return (
    <section className="max-w-5xl px-4 mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
          💬 카카오톡 추가 토큰
        </div>
        <h2 className="mb-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
          발송량이 더 필요하신가요?
        </h2>
        <p className="text-sm text-gray-500">
          기본 제공건 소진 후 추가 토큰을 충전하세요. 잔여 토큰은 다음 달로
          이월됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TOKENS.map((addon) => (
          <TokenCard key={addon.id} addon={addon} onSelect={handleSelect} />
        ))}
      </div>
    </section>
  );
}
