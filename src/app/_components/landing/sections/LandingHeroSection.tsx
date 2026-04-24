import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroDashboardPreview } from "@/app/_components/landing/sections/LandingDashboardPreviews";

const heroBackground = "/landing-hero-bg.svg";

export function LandingHeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#d7ddef]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[30px]"
      />

      <header className="relative z-10 bg-transparent">
        <div className="mx-auto flex h-[110px] w-full max-w-[1920px] items-center justify-between px-6 lg:px-[210px]">
          <Link href="/">
            <Image
              src="/brand/ssam-b.svg"
              alt="SSam B"
              width={160}
              height={52}
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="h-12 rounded-xl bg-[#3863f6] px-7 text-sm font-semibold text-white shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-[#2554f5]"
            >
              <Link href="/educators/login">로그인</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-xl border border-[#ced9fd] bg-[#f4f6fe] px-7 text-sm font-semibold text-[#3863f6] shadow-[0px_0px_14px_0px_rgba(138,138,138,0.08)] hover:bg-[#e1e7fe]"
            >
              <Link href="/learners/login">학생 로그인</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 h-[730px] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[1920px] flex-col items-center px-6 pt-[80px] lg:px-[210px]">
          <h1 className="text-center text-[40px] font-bold leading-[52px] tracking-[-0.4px] text-[#2b2e3a] sm:text-[48px] sm:leading-[62px] lg:text-[56px] lg:leading-[72px] lg:tracking-[-0.56px]">
            수업 운영부터 학생 관리까지
            <br />
            SSam B에서 한번에 운영하세요
          </h1>

          <div className="mt-auto w-full max-w-[960px]">
            <HeroDashboardPreview />
          </div>
        </div>
      </section>
    </div>
  );
}
