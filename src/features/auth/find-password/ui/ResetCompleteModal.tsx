"use client";

import { useRouter } from "next/navigation";

export default function ResetCompleteModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[400px] text-center">
        <h2 className="text-lg font-bold text-neutral-900 mb-3">
          비밀번호 재설정이 완료되었어요
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          로그인을 완료해주세요.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="block w-full py-4 px-4 rounded-lg font-medium text-sm bg-blue-700 text-white hover:bg-blue-500 transition-colors duration-200 cursor-pointer text-center mb-3"
        >
          로그인 하러가기
        </button>
      </div>
    </div>
  );
}
