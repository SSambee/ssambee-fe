import { SHARED_SECTION_BG } from "@/app/_components/landing/sections/LandingDashboardPreviews";

export function ExperienceSectionFallback() {
  return (
    <section
      className="relative z-10 -mt-2 py-20 lg:-mt-3 lg:py-[96px]"
      style={{ background: SHARED_SECTION_BG }}
      aria-busy
      aria-label="후기 섹션 로딩"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6">
        <div className="mx-auto h-[58px] w-[520px] max-w-full animate-pulse rounded-xl bg-[#dce6fa]" />
        <div className="mx-auto mt-4 h-[30px] w-[620px] max-w-full animate-pulse rounded-xl bg-[#e4ebfc]" />
        <div className="mt-10 h-[220px] w-full animate-pulse rounded-2xl bg-[#d7e2fb]/70" />
      </div>
    </section>
  );
}
