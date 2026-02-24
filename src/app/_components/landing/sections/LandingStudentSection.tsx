import {
  SECTION_DESC_CLASS,
  SECTION_EYEBROW_CLASS,
  SECTION_TITLE_CLASS,
  StudentFeaturePanel,
} from "@/app/_components/landing/sections/LandingDashboardPreviews";

export function LandingStudentSection() {
  return (
    <section className="relative z-20 -mt-[56px] bg-white pb-[96px] pt-[96px] lg:pb-[136px] lg:pt-[136px]">
      <div className="mx-auto grid w-full max-w-[1640px] gap-14 px-6 lg:grid-cols-[549px_minmax(0,877px)] lg:items-center">
        <div>
          <span className={SECTION_EYEBROW_CLASS}>학생 관리</span>
          <h2 className={SECTION_TITLE_CLASS}>
            한눈에 보는 학생 현황
            <span className="block sm:whitespace-nowrap">
              SSam B에서 편하게 관리하세요
            </span>
          </h2>
          <p className={SECTION_DESC_CLASS}>
            실시간 출결 체크와 자동 알림으로
            <br />
            학생 출석을 효율적으로 관리할 수 있어요.
          </p>
        </div>

        <StudentFeaturePanel />
      </div>
    </section>
  );
}
