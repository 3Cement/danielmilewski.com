"use client";

import { useEffect, useState } from "react";
import {
  analyticsConsentChangeEvent,
  analyticsConsentOpenEvent,
  analyticsConsentStorageKey,
  parseAnalyticsConsentState,
  type AnalyticsConsentState,
} from "@/lib/analyticsConsent";

interface AnalyticsConsentBannerProps {
  title: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
}

function readConsentState(): AnalyticsConsentState {
  if (typeof window === "undefined") {
    return "unknown";
  }

  return parseAnalyticsConsentState(
    window.localStorage.getItem(analyticsConsentStorageKey),
  );
}

function dispatchConsentChange(state: AnalyticsConsentState) {
  window.dispatchEvent(
    new CustomEvent(analyticsConsentChangeEvent, { detail: { state } }),
  );
}

export function AnalyticsConsentBanner({
  title,
  body,
  acceptLabel,
  rejectLabel,
}: AnalyticsConsentBannerProps) {
  const [consentState, setConsentState] = useState<AnalyticsConsentState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const state = readConsentState();
    setConsentState(state);
    setIsOpen(state === "unknown");

    function handleOpenRequest() {
      setIsOpen(true);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== analyticsConsentStorageKey) {
        return;
      }

      const nextState = parseAnalyticsConsentState(event.newValue);
      setConsentState(nextState);
      setIsOpen(nextState === "unknown");
    }

    function handleConsentChange(event: Event) {
      const nextState = parseAnalyticsConsentState(
        (event as CustomEvent<{ state?: string }>).detail?.state,
      );
      setConsentState(nextState);
      setIsOpen(false);
    }

    window.addEventListener(analyticsConsentOpenEvent, handleOpenRequest);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(analyticsConsentChangeEvent, handleConsentChange);

    return () => {
      window.removeEventListener(analyticsConsentOpenEvent, handleOpenRequest);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(analyticsConsentChangeEvent, handleConsentChange);
    };
  }, []);

  function saveConsentState(nextState: Exclude<AnalyticsConsentState, "unknown">) {
    window.localStorage.setItem(analyticsConsentStorageKey, nextState);
    setConsentState(nextState);
    setIsOpen(false);
    dispatchConsentChange(nextState);
  }

  if (consentState == null || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-6 lg:inset-x-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-semibold text-[var(--color-text-base)]">{title}</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{body}</p>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-[220px]">
            <button
              type="button"
              onClick={() => saveConsentState("accepted")}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-muted)]"
            >
              {acceptLabel}
            </button>
            <button
              type="button"
              onClick={() => saveConsentState("rejected")}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-surface-muted)]"
            >
              {rejectLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
