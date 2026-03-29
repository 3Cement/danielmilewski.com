import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #111827 55%, #0b1220 100%)",
          borderRadius: 36,
          border: "3px solid #1f2937",
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "#111827",
            border: "3px solid #334155",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: "#38bdf8",
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {">_"}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
