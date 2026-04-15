import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/metadata";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1.5 }}>{SITE_NAME}</div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#8b949e" }}>Software Engineer</div>
        <div style={{ marginTop: 32, fontSize: 22, color: "#4493f8" }}>Backend · APIs · Automation</div>
      </div>
    ),
    { ...size },
  );
}
