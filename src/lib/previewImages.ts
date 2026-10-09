// Keep in sync with PREVIEW_WIDTHS in scripts/generate-content-data.mjs,
// which writes these variants next to each project's preview screenshot.
export const PREVIEW_WIDTHS = [640, 1280] as const;

/** "/images/x/home-card.webp" -> "/images/x/home-card-640.webp" */
export function previewVariant(src: string, width: number): string {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

export function previewSrcSet(src: string): string {
  return PREVIEW_WIDTHS.map((width) => `${previewVariant(src, width)} ${width}w`).join(", ");
}
