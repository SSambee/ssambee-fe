import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const reactCompilerEnabled =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_REACT_COMPILER === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: reactCompilerEnabled,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "ssambee-dev-lms-documents.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ssambee-dev-lms-reports.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dszplxin70296.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d34widfoq1o1xc.cloudfront.net",
      },
    ],
  },
  // 프로덕션(실제 운영 도메인)일 떄는 프록시를 아예 끕니다.
  // 2024년 부터 크롬을 비롯한 브라우저들은 개인정보 보호를 위해 타사쿠키 자체를 브라우저 단에서 차단 합니다.
  // staging 환경에서는 이 부분이 걸리기에 Next 프록시를 오직 스테이징과 개발환경에서만 동작하도록 합니다.
  async rewrites() {
    // VERCEL_ENV는 프레임워크 환경 변수이므로 'production', 'preview', 'development'중 하나를 반환한다.
    // 오직 스테이징(Preview) 환경에서만 타사 쿠키 우회를 위해 Render 서버로 프록시를 켭니다.
    if (
      process.env.VERCEL_ENV === "preview" ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ) {
      // 오직 Vercel Preview(스테이징) 환경에서만 작동합니다.
      return [
        {
          source: "/api/mgmt/:path*",
          destination: "https://ssambee-be.onrender.com/api/mgmt/:path*",
        },
        {
          source: "/api/svc/:path*",
          destination: "https://ssambee-be.onrender.com/api/svc/:path*",
        },
        {
          source: "/api/public/:path*",
          destination: "https://ssambee-be.onrender.com/api/public/:path*",
        },
        // Better Auth 기본 API 프록시
        {
          source: "/api/auth/:path*",
          destination: "https://ssambee-be.onrender.com/api/auth/:path*",
        },
      ];
    }
    return [];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "meta-os",

  project: "ssambe",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
