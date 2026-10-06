"use client";

import { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
  label: string;
  copiedLabel: string;
  className?: string;
}

export function CopyEmailButton({ email, label, copiedLabel, className }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? copiedLabel : label}
    </button>
  );
}
