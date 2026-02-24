import {
  DashboardShowcase,
  SECTION_DESC_CENTER_CLASS,
  SECTION_EYEBROW_CLASS,
  SECTION_TITLE_CLASS,
  UNIFIED_DASHBOARD_HOVER_CLASS,
} from "@/app/_components/landing/sections/LandingDashboardPreviews";

export function LandingDashboardSection() {
  return (
    <section className="relative z-10 bg-white pb-0 pt-[88px] lg:pt-[118px]">
      <div className="mx-auto w-full max-w-[1360px] px-6 text-center">
        <span className={SECTION_EYEBROW_CLASS}>대시보드</span>
        <h2 className={SECTION_TITLE_CLASS}>
          필요한 모든 기능, 하나의 대시보드에서
        </h2>
        <p className={SECTION_DESC_CENTER_CLASS}>
          수업에 필요한 모든 데이터를 한눈에 확인하고 관리할 수 있어요.
        </p>

        <div
          className={`relative mx-auto mt-10 w-full max-w-[1110px] overflow-hidden rounded-[22px] shadow-[0px_16px_40px_0px_rgba(78,90,126,0.16)] lg:mt-[44px] ${UNIFIED_DASHBOARD_HOVER_CLASS}`}
        >
          <DashboardShowcase />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[112px] bg-gradient-to-b from-transparent via-[#f7f8fc]/58 to-[#f7f8fc]" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#eaf0fd]/65 blur-[4px]" />
    </section>
  );
}
