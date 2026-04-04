"use client";

import {
  forwardRef,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

const HCAPTCHA_SCRIPT_ID = "hcaptcha-script";
const HCAPTCHA_ONLOAD_CALLBACK = "__onloadHCaptcha";
const HCAPTCHA_SCRIPT_SRC =
  `https://js.hcaptcha.com/1/api.js?onload=${HCAPTCHA_ONLOAD_CALLBACK}&render=explicit`;

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
          size?: "normal" | "compact" | "invisible";
          theme?: "light" | "dark";
        },
      ) => string;
      execute: (widgetId?: string, options?: { async?: boolean }) => void | Promise<unknown>;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    __onloadHCaptcha?: () => void;
  }
}

export interface HCaptchaWidgetHandle {
  execute: () => void;
  reset: () => void;
}

interface HCaptchaWidgetProps {
  siteKey: string;
  resetKey: string;
  onTokenChange?: (token: string) => void;
}

export const HCaptchaWidget = forwardRef<
  HCaptchaWidgetHandle,
  HCaptchaWidgetProps
>(function HCaptchaWidget({
  siteKey,
  resetKey,
  onTokenChange,
}: HCaptchaWidgetProps, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const containerId = `hcaptcha-${useId().replace(/:/g, "")}`;
  const clearToken = useEffectEvent(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onTokenChange?.("");
  });

  useImperativeHandle(
    ref,
    () => ({
      execute() {
        if (!window.hcaptcha || !widgetIdRef.current) {
          return;
        }

        window.hcaptcha.execute(widgetIdRef.current);
      },
      reset() {
        if (!window.hcaptcha || !widgetIdRef.current) {
          return;
        }

        window.hcaptcha.reset(widgetIdRef.current);
        clearToken();
      },
    }),
    [],
  );

  useEffect(() => {
    const renderWidget = () => {
      if (!window.hcaptcha || !containerRef.current || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token) => {
          if (inputRef.current) {
            inputRef.current.value = token;
          }
          onTokenChange?.(token);
        },
        "expired-callback": clearToken,
        "error-callback": clearToken,
      });
    };

    const existingScript = document.getElementById(
      HCAPTCHA_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    window[HCAPTCHA_ONLOAD_CALLBACK] = renderWidget;

    if (window.hcaptcha) {
      renderWidget();
      return () => {
        delete window[HCAPTCHA_ONLOAD_CALLBACK];
      };
    }

    if (existingScript) {
      return () => {
        delete window[HCAPTCHA_ONLOAD_CALLBACK];
      };
    }

    const script = document.createElement("script");
    script.id = HCAPTCHA_SCRIPT_ID;
    script.src = HCAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      delete window[HCAPTCHA_ONLOAD_CALLBACK];
    };
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (!window.hcaptcha || !widgetIdRef.current) {
      return;
    }

    window.hcaptcha.reset(widgetIdRef.current);
    clearToken();
  }, [resetKey]);

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
      <div id={containerId} ref={containerRef} />
    </div>
  );
});
