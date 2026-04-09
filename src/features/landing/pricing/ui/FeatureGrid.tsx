import { FEATURE_HIGHLIGHTS } from "@/features/landing/pricing/lib/types";

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {FEATURE_HIGHLIGHTS.map((item) => (
        <div
          key={item.title}
          className="flex gap-3 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <span className="shrink-0 text-2xl">{item.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-0.5">
              {item.title}
            </p>
            <p className="text-xs leading-relaxed text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
