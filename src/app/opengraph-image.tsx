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
          background: "#2233d4",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c9cefa" }}>{SITE_NAME}</div>
        <div style={{ marginTop: 20, fontSize: 88, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3, textTransform: "uppercase" }}>Senior Python Developer</div>
        <div style={{ marginTop: 36, fontSize: 26, color: "#ff6b2c", fontWeight: 700 }}>Backend · APIs · Data pipelines · Gdańsk / Remote EU</div>
      </div>
    ),
    { ...size },
  );
}
