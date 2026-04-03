"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "auto" | "light" | "dark";
          language?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  locale: string;
  resetKey: string;
}

export function TurnstileWidget({
  siteKey,
  locale,
  resetKey,
}: TurnstileWidgetProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !scriptReady ||
      !window.turnstile ||
      !containerRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      language: locale,
      callback: (token) => {
        if (inputRef.current) {
          inputRef.current.value = token;
        }
      },
      "expired-callback": () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
      "error-callback": () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    });
  }, [locale, scriptReady, siteKey]);

  useEffect(() => {
    if (!window.turnstile || !widgetIdRef.current) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetKey]);

  return (
    <div className="space-y-3">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <input ref={inputRef} type="hidden" name="cf-turnstile-response" />
      <div ref={containerRef} />
    </div>
  );
}
