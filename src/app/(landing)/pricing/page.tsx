import { FeatureGrid } from "@/features/landing/pricing/ui/FeatureGrid";
import { TrustBadges } from "@/features/landing/pricing/ui/TrustBadges";
import { TokenAddSection } from "@/features/landing/pricing/ui/TokenAddSection";
import { PlanCardList } from "@/features/landing/pricing/ui/PlanCardList";

// 빌드 시 정적 프리렌더에서 /billing/products를 호출하면 CI 등(API URL 미설정)에서 실패함
export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <>
      <section className="px-4 pb-12 pt-40 text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
          강의에만 집중하세요.
          <br />
          <span className="text-brand-700">나머지는 저희가 합니다.</span>
        </h1>
        <p className="mx-auto mb-10 text-base text-gray-500 md:text-lg">
          수강생 관리부터 수업 운영, 성적 분석까지 필요한 모든 것을 하나의
          플랫폼에서 해결하세요.
        </p>
      </section>

      <section className="max-w-5xl px-4 mx-auto mb-16">
        <FeatureGrid />
      </section>

      <section className="max-w-5xl px-4 pb-16 mx-auto">
        <div className="mb-10 pt-10 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
            지금 바로 시작하세요
          </h2>
          <p className="text-sm text-gray-500">
            합리적인 가격으로 강의 운영의 모든 것을 경험하세요.
          </p>
        </div>

        <PlanCardList />

        <TrustBadges />
      </section>

      <div className="border-t border-gray-200 pb-20">
        <div className="pt-16">
          <TokenAddSection />
        </div>
      </div>
    </>
  );
}
