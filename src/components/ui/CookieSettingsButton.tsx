"use client";

import { analyticsConsentOpenEvent } from "@/lib/analyticsConsent";

interface CookieSettingsButtonProps {
  label: string;
}

export function CookieSettingsButton({ label }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(analyticsConsentOpenEvent))}
      className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
    >
      {label}
    </button>
  );
}
