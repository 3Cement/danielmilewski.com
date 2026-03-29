import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          border: "1px solid #1f2937",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            background: "#111827",
            border: "1px solid #334155",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: "#38bdf8",
              letterSpacing: -1,
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
