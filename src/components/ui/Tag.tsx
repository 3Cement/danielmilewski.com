import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  variant?: "default" | "accent" | "muted";
  className?: string;
}

export function Tag({ label, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variant === "default" &&
          "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] ring-[var(--color-border)]",
        variant === "accent" &&
          "bg-[var(--color-accent)]/10 text-[var(--color-accent)] ring-[var(--color-accent)]/20",
        variant === "muted" &&
          "bg-[var(--color-surface-subtle)] text-[var(--color-text-faint)] ring-[var(--color-border)]",
        className,
      )}
    >
      {label}
    </span>
  );
}
