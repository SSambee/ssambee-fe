"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#e9ebf0] bg-[#fcfcfd] p-8 text-center shadow-[0px_12px_36px_0px_rgba(31,44,72,0.08)]">
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.24px] text-[#2b2e3a]">
          페이지를 불러오는 중 문제가 발생했습니다
        </h1>
        <p className="mt-3 text-[15px] leading-6 tracking-[-0.15px] text-[#8b90a3]">
          잠시 후 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 h-11 rounded-xl bg-[#3863f6] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
