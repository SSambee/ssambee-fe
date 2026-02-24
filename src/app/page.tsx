import type { Metadata } from "next";

import { LandingPageView } from "@/app/_components/landing/LandingPageView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "SSam B";
const PAGE_TITLE = "수업 운영부터 학생 관리까지 한 번에 운영";
const PAGE_DESCRIPTION =
  "SSam B에서 학생 관리, 조교 관리, 수업 운영 대시보드를 한 번에 확인하고 운영하세요.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | ${PAGE_TITLE}`,
    description: PAGE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        alt: "SSam B 랜딩 대시보드 배경",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${PAGE_TITLE}`,
    description: PAGE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/ssam-b.svg`,
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "ko-KR",
};

export default function HomePage() {
  return (
    <>
      <LandingPageView />
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webSiteJsonLd)}
      </script>
    </>
  );
}
