import {
  AssistantFeaturePanel,
  SECTION_DESC_CLASS,
  SECTION_EYEBROW_CLASS,
  SECTION_TITLE_CLASS,
  SHARED_SECTION_BG,
} from "@/app/_components/landing/sections/LandingDashboardPreviews";

export function LandingAssistantSection() {
  return (
    <section
      className="py-20 lg:py-[120px]"
      style={{ background: SHARED_SECTION_BG }}
    >
      <div className="mx-auto grid w-full max-w-[1640px] gap-14 px-6 lg:grid-cols-[877px_549px] lg:items-center">
        <AssistantFeaturePanel />

        <div>
          <span className={SECTION_EYEBROW_CLASS}>조교 관리</span>
          <h2 className={SECTION_TITLE_CLASS}>
            조교 현황을 확인하고 필요한
            <span className="block sm:whitespace-nowrap">
              업무를 빠르게 처리하세요
            </span>
          </h2>
          <p className={SECTION_DESC_CLASS}>
            근무 상태, 계약 정보, 담당 내역까지
            <br />
            조교 관련 모든 정보를 한 화면에서 관리할 수 있어요.
          </p>
        </div>
      </div>
    </section>
  );
}
