import { Plan, TokenAdd } from "@/features/landing/pricing/lib/types";

type PlanSummaryCardProps = {
  plan: Plan;
  tokenInfo: TokenAdd | null;
};

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-brand-700 mt-0.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function PlanSummaryCard({ plan, tokenInfo }: PlanSummaryCardProps) {
  const isToken = !!tokenInfo;
  const amount = isToken ? tokenInfo!.price : plan.price;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl">
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
        {isToken ? "선택한 추가 토큰" : "선택한 요금제"}
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
          {isToken ? (
            <span className="text-lg">💬</span>
          ) : (
            <svg
              className="w-5 h-5 text-brand-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900">
            {isToken
              ? `카카오톡 ${tokenInfo!.count.toLocaleString("ko-KR")}건 추가`
              : plan.name}
          </p>
          <p className="text-xs text-gray-500">
            {isToken ? "추가 발송 토큰 1회 충전" : plan.description}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-500">
            {isToken
              ? `카카오톡 ${tokenInfo!.count.toLocaleString("ko-KR")}건`
              : `${plan.name} (월간)`}
          </span>
          <span className="font-medium text-gray-800">
            {amount.toLocaleString("ko-KR")}원{!isToken && "/월"}
          </span>
        </div>
        <div className="flex justify-between pt-6 text-base font-bold border-t border-gray-100">
          <span className="text-gray-900">결제금액</span>
          <span className="text-brand-700">
            {amount.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      {!isToken && (
        <div className="pt-5 mt-5 border-t border-gray-100">
          <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            포함 기능
          </p>
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isToken && (
        <div className="pt-5 mt-5 border-t border-gray-100">
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckIcon />
              카카오톡 {tokenInfo!.count.toLocaleString("ko-KR")}건 즉시 충전
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckIcon />
              {tokenInfo!.options}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
