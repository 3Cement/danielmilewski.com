"use client";

import { useEffect } from "react";

interface LocaleSyncProps {
  locale: "en" | "pl";
}

export function LocaleSync({ locale }: LocaleSyncProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [locale]);

  return null;
}
