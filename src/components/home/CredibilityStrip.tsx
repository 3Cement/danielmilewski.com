const capabilities = [
  "Python",
  "AI / LLM Apps",
  "Backend Systems",
  "Automation",
  "REST APIs",
  "FastAPI",
  "PostgreSQL",
  "Product Delivery",
];

export function CredibilityStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)] py-6 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="text-sm font-medium text-[var(--color-text-muted)]"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
