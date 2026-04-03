"use client";

import { useEffect, useRef } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
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
    };

    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (window.turnstile) {
      renderWidget();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
      return () => {
        existingScript.removeEventListener("load", renderWidget);
      };
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", renderWidget);
    };
  }, [locale, siteKey]);

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
      <input ref={inputRef} type="hidden" name="cf-turnstile-response" />
      <div ref={containerRef} />
    </div>
  );
}
