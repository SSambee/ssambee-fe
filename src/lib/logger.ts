import winston from "winston";

const isServer = typeof window === "undefined";

// ── Format ────────────────────────────────────────────────────
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

// ── Logger 인스턴스 ────────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  defaultMeta: {
    service: "ssambee-frontend",
    env: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : consoleFormat,
    }),
  ],
});

// ── Loki Transport (서버 환경 + 환경변수 있을 때만) ──────────────
// dynamic import로 winston-loki를 로드하여 클라이언트 번들에 포함되지 않도록 함
async function initLokiTransport() {
  if (!isServer || !process.env.LOKI_HOST) return;

  try {
    const LokiTransport = (await import("winston-loki")).default;

    logger.add(
      new LokiTransport({
        host: process.env.LOKI_HOST,
        basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_PASSWORD}`,
        labels: {
          app: "ssambee-frontend",
          env:
            process.env.NEXT_PUBLIC_APP_ENV ||
            process.env.NODE_ENV ||
            "unknown",
        },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        // 🔥 Vercel 서버리스 필수: 즉시 전송 (배치 모으다가 함수 freeze로 로그 증발 방지)
        batching: false,
        onConnectionError: (err: Error) =>
          console.error("[Loki] 연결 오류:", err.message),
      })
    );

    logger.info("Loki transport 초기화 완료", {
      host: process.env.LOKI_HOST,
    });
  } catch (err) {
    console.error("[Loki] Transport 초기화 실패:", err);
  }
}

// 초기화 Promise — instrumentation.ts에서 await 가능
export const lokiReady = initLokiTransport();

export default logger;
