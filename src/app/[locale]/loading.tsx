export default function LocaleLoading() {
  return (
    <div className="min-h-[40vh] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-9 w-56 max-w-full rounded-md bg-[var(--color-surface-muted)] motion-safe:animate-pulse" />
        <div className="h-4 w-full max-w-xl rounded-md bg-[var(--color-surface-muted)] motion-safe:animate-pulse" />
        <div className="h-4 w-full max-w-lg rounded-md bg-[var(--color-surface-muted)] motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
