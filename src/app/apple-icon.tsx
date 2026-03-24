import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const SYMBOL = "</>";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1117",
          borderRadius: 36,
          border: "2px solid #30363d",
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            color: "#4493f8",
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {SYMBOL}
        </span>
      </div>
    ),
    { ...size },
  );
}
