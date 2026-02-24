import { Suspense } from "react";

import ExperienceSectionClient from "@/app/_components/landing/sections/ExperienceSectionClient";
import { ExperienceSectionFallback } from "@/app/_components/landing/sections/ExperienceSectionFallback";
import { LandingAssistantSection } from "@/app/_components/landing/sections/LandingAssistantSection";
import { LandingDashboardSection } from "@/app/_components/landing/sections/LandingDashboardSection";
import { LandingFooterSection } from "@/app/_components/landing/sections/LandingFooterSection";
import { LandingHeroSection } from "@/app/_components/landing/sections/LandingHeroSection";
import { LandingStudentSection } from "@/app/_components/landing/sections/LandingStudentSection";

export function LandingPageView() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#2b2e3a] antialiased">
      <LandingHeroSection />

      <main>
        <LandingStudentSection />
        <LandingAssistantSection />
        <LandingDashboardSection />

        <Suspense fallback={<ExperienceSectionFallback />}>
          <ExperienceSectionClient />
        </Suspense>
      </main>

      <LandingFooterSection />
    </div>
  );
}
