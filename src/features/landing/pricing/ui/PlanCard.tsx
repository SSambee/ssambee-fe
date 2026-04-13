import { Plan } from "@/features/landing/pricing/types";

export function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}) {
  return (
    <div className="group relative rounded-2xl p-8 flex flex-col transition-all duration-300 bg-white border border-gray-200 hover:border-brand-500 hover:shadow-2xl hover:shadow-gray-100 hover:translate-y-[-10px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1 transition-colors duration-300 text-gray-900 group-hover:text-brand-700">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-gray-900">
            {plan.price.toLocaleString("ko-KR")}
          </span>
          <span className="text-base mb-1.5 text-gray-500">원</span>
          <span className="text-sm mb-1.5 text-gray-400">/ 월</span>
        </div>
      </div>

      <ul className="flex-1 mb-8 space-y-3">
        {plan.highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0 transition-colors duration-300 text-gray-400 group-hover:text-brand-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-600">{highlight}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] bg-brand-700 text-white hover:bg-[#2952e0] active:scale-[0.98]"
      >
        시작하기
      </button>
    </div>
  );
}
