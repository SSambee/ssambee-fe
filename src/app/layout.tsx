import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import { pretendard } from "@/styles/fonts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "SSam B";
const DEFAULT_TITLE = "SSam B | 수업 운영부터 학생 관리까지";
const DEFAULT_DESCRIPTION =
  "수업 운영, 학생 관리, 조교 관리, 일정 확인을 하나의 대시보드에서 운영하는 학원 관리 플랫폼";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ["학원 관리", "학생 관리", "수업 운영", "조교 관리", "SSam B"],
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/landing-hero-bg.svg",
        alt: "SSam B 랜딩 배경",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/landing-hero-bg.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}
