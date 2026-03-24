"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Heading } from "@/lib/headings";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const t = useTranslations("blog");
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="text-xs font-semibold text-[var(--color-text-faint)] uppercase tracking-widest mb-3">
        {t("tocHeading")}
      </p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`block text-sm leading-relaxed transition-colors ${
            heading.level === 3 ? "pl-3" : ""
          } ${
            activeId === heading.id
              ? "text-[var(--color-accent)] font-medium"
              : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
          }`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
