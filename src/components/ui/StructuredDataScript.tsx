import Script from "next/script";

interface StructuredDataScriptProps {
  id: string;
  json: string;
}

export function StructuredDataScript({ id, json }: StructuredDataScriptProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
