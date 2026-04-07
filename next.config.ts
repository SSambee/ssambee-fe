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
      {
        protocol: "https",
        hostname: "static.toss.im",
        pathname: "/{illusts,lotties}/**",
      },
    ],
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
