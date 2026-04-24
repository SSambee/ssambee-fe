// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://756475fd6e312c4f536e9ad59a29d17a@o4509365761867776.ingest.us.sentry.io/4510817028276224",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // [분산 추적 에지(미들웨어 등)에서 백엔드로 요청 보낼 때도 ID
  tracePropagationTargets: ["localhost", /^https:\/\/api\.ssambee\.com/],
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: process.env.SENTRY_SEND_PII === "false",
});
