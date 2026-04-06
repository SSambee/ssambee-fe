import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "react-day-picker/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "@/styles/globals.css";
import Providers from "@/app/providers/Providers";
import { pretendard } from "@/styles/fonts";

const DEFAULT_SITE_URL = "http://localhost:3000";
const SITE_NAME = "SSam B";
const DEFAULT_TITLE = "SSam B | 수업 운영부터 학생 관리까지";
const DEFAULT_DESCRIPTION =
  "수업 운영, 학생 관리, 조교 관리, 일정 확인을 하나의 대시보드에서 운영하는 학원 관리 플랫폼";

const metadataBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
})();

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const metadata: Metadata = {
  metadataBase,
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
        url: "/opengraph-image",
        alt: "SSam B 랜딩 배경",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
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
      <body className={`${pretendard.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      {isProd && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "vmrhru1kzt");
            `}
        </Script>
      )}
    </html>
  );
}
