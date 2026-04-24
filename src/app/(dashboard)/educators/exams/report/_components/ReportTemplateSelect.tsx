"use client";

import { cn } from "@/lib/utils";

import { useReportPage } from "../_hooks/useReportPage";

export function ReportTemplateSelect() {
  const { selectedTemplate, selectTemplate } = useReportPage();

  return (
    <section className="space-y-3.5 rounded-[24px] border border-[#eaecf2] bg-white p-5 shadow-none sm:p-6">
      <h3 className="text-[14px] font-semibold tracking-[-0.14px] text-[#4a4d5c]">
        템플릿 선택
      </h3>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => selectTemplate("premium")}
          className={cn(
            "cursor-pointer group relative w-full overflow-hidden rounded-[14px] border p-4 text-left transition-all",
            selectedTemplate === "premium"
              ? "border-[#3863f6] bg-[#f4f7ff] ring-1 ring-[#3863f6]"
              : "border-[#dfe3ec] bg-[#fcfcfd] hover:border-[#c6d2ff] hover:bg-[#f6f8ff]"
          )}
        >
          {selectedTemplate === "premium" && (
            <div className="absolute right-0 top-0 rounded-bl-[10px] bg-[#3863f6] px-2 py-1 text-[10px] font-semibold text-white">
              선택됨
            </div>
          )}
          <div className="mb-1 flex items-center justify-between">
            <p
              className={cn(
                "text-[14px] font-semibold",
                selectedTemplate === "premium"
                  ? "text-[#2f57e8]"
                  : "text-[#4a4d5c]"
              )}
            >
              프리미엄 리포트
            </p>
            {selectedTemplate !== "premium" && (
              <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-semibold text-[#3863f6]">
                권장
              </span>
            )}
          </div>
          <p className="text-[12px] font-medium leading-relaxed text-[#8b90a3]">
            상세 분석, 성적 추이, 개인별 피드백이 포함된
            <br />
            고품질 리포트입니다.
          </p>
        </button>

        <button
          type="button"
          onClick={() => selectTemplate("simple")}
          className={cn(
            "cursor-pointer group relative w-full overflow-hidden rounded-[14px] border p-4 text-left transition-all",
            selectedTemplate === "simple"
              ? "border-[#6b6f80] bg-[#f7f8fb] ring-1 ring-[#6b6f80]"
              : "border-[#dfe3ec] bg-[#fcfcfd] hover:border-[#ced3e1] hover:bg-[#f8f9fc]"
          )}
        >
          {selectedTemplate === "simple" && (
            <div className="absolute right-0 top-0 rounded-bl-[10px] bg-[#6b6f80] px-2 py-1 text-[10px] font-semibold text-white">
              선택됨
            </div>
          )}
          <p
            className={cn(
              "mb-1 text-[14px] font-semibold",
              selectedTemplate === "simple"
                ? "text-[#4a4d5c]"
                : "text-[#6b6f80]"
            )}
          >
            심플 리포트
          </p>
          <p className="text-[12px] font-medium leading-relaxed text-[#8b90a3]">
            점수와 석차만 포함된
            <br />
            간단한 요약 리포트입니다.
          </p>
        </button>
      </div>
    </section>
  );
}
