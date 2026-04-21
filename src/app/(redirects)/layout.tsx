import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

const defaultSocialImage = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    images: [
      {
        url: defaultSocialImage,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Software Engineer`,
      },
    ],
  },
  twitter: {
    images: [defaultSocialImage],
  },
};

export default function RedirectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
