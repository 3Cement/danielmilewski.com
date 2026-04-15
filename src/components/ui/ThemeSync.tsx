"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function resolveTheme(): "light" | "dark" {
  const storedTheme = window.localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, [pathname]);

  return null;
}
