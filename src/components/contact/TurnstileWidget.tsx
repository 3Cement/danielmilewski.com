"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "auto" | "light" | "dark";
          language?: string;
          appearance?: "always" | "execute" | "interaction-only";
          execution?: "render" | "execute";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      execute: (container: HTMLElement | string) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export interface TurnstileWidgetHandle {
  execute: () => void;
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  locale: string;
  resetKey: string;
  onTokenChange?: (token: string) => void;
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  TurnstileWidgetProps
>(function TurnstileWidget(
  {
    siteKey,
    locale,
    resetKey,
    onTokenChange,
  }: TurnstileWidgetProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = `turnstile-${useId().replace(/:/g, "")}`;

  useImperativeHandle(ref, () => ({
    execute() {
      if (!window.turnstile || !containerRef.current) {
        return;
      }

      window.turnstile.execute(`#${containerId}`);
    },
    reset() {
      if (!window.turnstile || !widgetIdRef.current) {
        return;
      }

      window.turnstile.reset(widgetIdRef.current);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onTokenChange?.("");
    },
  }), [containerId, onTokenChange]);

  useEffect(() => {
    const renderWidget = () => {
      if (!window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
        sitekey: siteKey,
        theme: "auto",
        language: locale,
        appearance: "interaction-only",
        execution: "execute",
        callback: (token) => {
          if (inputRef.current) {
            inputRef.current.value = token;
          }
          onTokenChange?.(token);
        },
        "expired-callback": () => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          onTokenChange?.("");
        },
        "error-callback": () => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          onTokenChange?.("");
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
  }, [containerId, locale, onTokenChange, siteKey]);

  useEffect(() => {
    if (!window.turnstile || !widgetIdRef.current) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onTokenChange?.("");
  }, [onTokenChange, resetKey]);

  useEffect(() => {
    return () => {
      if (!window.turnstile || !widgetIdRef.current) {
        return;
      }

      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="hidden" name="cf-turnstile-response" />
      <div id={containerId} ref={containerRef} />
    </div>
  );
});
