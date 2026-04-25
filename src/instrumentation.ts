import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");

    // Grafana Loki 로거 초기화 (Node.js 런타임에서만 — Edge에서는 winston 사용 불가)
    const { lokiReady } = await import("./lib/logger");
    await lokiReady;
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
