interface StructuredDataScriptProps {
  id: string;
  json: string;
}

/**
 * Plain <script> so the JSON-LD lands in the server HTML. next/script with
 * beforeInteractive only emits a JS push, invisible to non-JS crawlers.
 */
export function StructuredDataScript({ id, json }: StructuredDataScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
