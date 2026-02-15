"use client";

import { useReportPage } from "../_hooks/useReportPage";

export function ReportTemplateSelect() {
  const { selectedTemplate, selectTemplate } = useReportPage();

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        템플릿 선택
      </h3>
      <div className="grid gap-3">
        {/* 프리미엄 리포트 */}
        <button
          onClick={() => selectTemplate("premium")}
          className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
            selectedTemplate === "premium"
              ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600"
              : "border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm"
          }`}
        >
          {selectedTemplate === "premium" && (
            <div className="absolute right-0 top-0 rounded-bl-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">
              선택됨
            </div>
          )}
          <div className="flex items-center justify-between mb-1">
            <p
              className={`font-bold ${selectedTemplate === "premium" ? "text-indigo-900" : "text-zinc-900"}`}
            >
              프리미엄 리포트
            </p>
            {selectedTemplate !== "premium" && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                권장
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            상세 분석, 성적 추이, 개인별 피드백이 포함된
            <br />
            고품질 리포트입니다.
          </p>
        </button>

        {/* 심플 리포트 */}
        <button
          onClick={() => selectTemplate("simple")}
          className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
            selectedTemplate === "simple"
              ? "border-zinc-800 bg-zinc-50 shadow-md ring-1 ring-zinc-800"
              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
          }`}
        >
          {selectedTemplate === "simple" && (
            <div className="absolute right-0 top-0 rounded-bl-lg bg-zinc-800 px-2 py-1 text-[10px] font-bold text-white">
              선택됨
            </div>
          )}
          <p
            className={`font-bold mb-1 ${selectedTemplate === "simple" ? "text-zinc-900" : "text-zinc-700"}`}
          >
            심플 리포트
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            점수와 석차만 포함된
            <br />
            간단한 요약 리포트입니다.
          </p>
        </button>
      </div>
    </div>
  );
}
