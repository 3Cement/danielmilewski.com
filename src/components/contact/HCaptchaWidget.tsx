"use client";

import { useEffect, useId, useRef } from "react";

const HCAPTCHA_SCRIPT_ID = "hcaptcha-script";
const HCAPTCHA_SCRIPT_SRC = "https://js.hcaptcha.com/1/api.js?render=explicit";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface HCaptchaWidgetProps {
  siteKey: string;
  resetKey: string;
  onTokenChange?: (token: string) => void;
}

export function HCaptchaWidget({
  siteKey,
  resetKey,
  onTokenChange,
}: HCaptchaWidgetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = `hcaptcha-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const renderWidget = () => {
      if (!window.hcaptcha || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.hcaptcha.render(`#${containerId}`, {
        sitekey: siteKey,
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
      HCAPTCHA_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (window.hcaptcha) {
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
    script.id = HCAPTCHA_SCRIPT_ID;
    script.src = HCAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", renderWidget);
    };
  }, [containerId, onTokenChange, siteKey]);

  useEffect(() => {
    if (!window.hcaptcha || !widgetIdRef.current) {
      return;
    }

    window.hcaptcha.reset(widgetIdRef.current);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onTokenChange?.("");
  }, [onTokenChange, resetKey]);

  useEffect(() => {
    return () => {
      if (!window.hcaptcha || !widgetIdRef.current) {
        return;
      }

      window.hcaptcha.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="hidden" name="h-captcha-response" />
      <div id={containerId} />
    </div>
  );
}
