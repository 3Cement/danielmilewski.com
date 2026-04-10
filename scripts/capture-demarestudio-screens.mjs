/**
 * Capture reference screenshots from demarestudio.com and generate WebP assets.
 * Run: node scripts/capture-demarestudio-screens.mjs
 *
 * Notes:
 * - DeMāre hero slides use CSS keyframes starting at opacity 0 — without overrides captures look "empty".
 * - .reveal sections start hidden until IntersectionObserver — we force them visible for static capture.
 * - Viewport-only shots avoid multi-thousand-pixel full-page images that render poorly in MDX prose.
 */
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(root, "public/images/demarestudio");

const VIEWPORT = { width: 1440, height: 1200 };

const pages = [
  { name: "home", url: "https://demarestudio.com/" },
  { name: "portfolio", url: "https://demarestudio.com/portfolio/" },
  { name: "services", url: "https://demarestudio.com/uslugi/" },
  { name: "about", url: "https://demarestudio.com/about/" },
  { name: "process", url: "https://demarestudio.com/process/" },
  { name: "contact", url: "https://demarestudio.com/contact/" },
];

const captureOverridesCss = `
  /* Hero: show first slide only, freeze animation */
  .hero__slide {
    animation: none !important;
  }
  .hero__slide:nth-of-type(1) {
    opacity: 1 !important;
  }
  .hero__slide:nth-of-type(n+2) {
    opacity: 0 !important;
  }
  /* Scroll-reveal: visible for screenshot */
  .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
`;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  locale: "pl-PL",
});

for (const item of pages) {
  const page = await context.newPage();
  await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.addStyleTag({ content: captureOverridesCss });

  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(500);

  await page
    .waitForFunction(
      () => {
        const imgs = Array.from(document.querySelectorAll("img[src]"));
        return imgs.some((img) => img.naturalWidth > 50 && img.naturalHeight > 50);
      },
      { timeout: 20_000 },
    )
    .catch(() => {});

  const pngPath = join(outputDir, `${item.name}.png`);
  const webpPath = join(outputDir, `${item.name}.webp`);

  await page.screenshot({ path: pngPath, fullPage: false, type: "png" });

  await sharp(pngPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(webpPath);

  if (item.name === "home") {
    const cardPngPath = join(outputDir, "home-card.png");
    const cardWebpPath = join(outputDir, "home-card.webp");
    const heroClipHeight = 800;
    await page.screenshot({
      path: cardPngPath,
      fullPage: false,
      type: "png",
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: heroClipHeight },
    });
    await sharp(cardPngPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(cardWebpPath);
    console.log("wrote", cardPngPath.replace(`${root}/`, ""));
    console.log("wrote", cardWebpPath.replace(`${root}/`, ""));
  }

  console.log("captured", item.url);
  console.log("wrote", pngPath.replace(`${root}/`, ""));
  console.log("wrote", webpPath.replace(`${root}/`, ""));

  await page.close();
}

await context.close();
await browser.close();

console.log("capture-demarestudio-screens: OK", pages.length, "pages");
