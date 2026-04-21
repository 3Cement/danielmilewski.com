import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

const defaultSocialImage = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  title: `Page not found — ${SITE_NAME}`,
  description: "The page you are looking for does not exist.",
  metadataBase: new URL(SITE_URL),
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `Page not found — ${SITE_NAME}`,
    description: "The page you are looking for does not exist.",
    images: [
      {
        url: defaultSocialImage,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultSocialImage],
  },
};

export default function GlobalNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#0d1117",
        color: "#e6edf3",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "32rem", textAlign: "center" }}>
        <p style={{ margin: 0, color: "#58a6ff", fontSize: "0.875rem", fontWeight: 600 }}>404</p>
        <h1 style={{ margin: "0.75rem 0 1rem", fontSize: "2rem", lineHeight: 1.1 }}>
          Page not found
        </h1>
        <p style={{ margin: 0, color: "#8b949e", lineHeight: 1.6 }}>
          The page you requested does not exist or has moved.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link
            href="/en"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.75rem",
              background: "#1f6feb",
              color: "#ffffff",
              fontWeight: 600,
              padding: "0.75rem 1.125rem",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
