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

const linkStyle = {
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  textDecoration: "none",
  borderBottom: "2px solid #f47a42",
} as const;

export default function GlobalNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "2rem 1rem",
        background: "#303cb8",
        color: "#ffffff",
        fontFamily: '"Helvetica Neue", Arial, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", width: "100%" }}>
        <p
          aria-hidden="true"
          style={{ margin: 0, fontSize: "clamp(5rem, 18vw, 12rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          404
        </p>
        <h1 style={{ margin: "1rem 0", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1, textTransform: "uppercase" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.5, maxWidth: "48ch" }}>
          The page you requested does not exist or has moved.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/en"
            style={{
              display: "inline-flex",
              background: "#ffffff",
              color: "#303cb8",
              fontWeight: 700,
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.8rem 1.35rem",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
          <Link href="/en/projects" style={linkStyle}>Projects</Link>
          <Link href="/en/blog" style={linkStyle}>Writing</Link>
          <Link href="/en/contact" style={linkStyle}>Contact</Link>
        </div>
      </div>
    </div>
  );
}
