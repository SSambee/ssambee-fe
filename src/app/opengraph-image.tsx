import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background:
          "linear-gradient(135deg, #f4f6fe 0%, #e1e7fe 42%, #ced9fd 100%)",
        color: "#2b2e3a",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        SSam Bee
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "980px",
          }}
        >
          수업 운영부터 학생 관리까지 한 번에 운영
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#5e6275",
            letterSpacing: "-0.01em",
          }}
        >
          학생 관리, 조교 관리, 수업 운영을 하나의 대시보드에서
        </div>
      </div>
    </div>,
    size
  );
}
