import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const SYMBOL = "</>";

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
          background: "#0d1117",
          borderRadius: 6,
          border: "1px solid #30363d",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            color: "#4493f8",
            letterSpacing: -0.5,
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
