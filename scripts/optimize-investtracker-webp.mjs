/**
 * Regenerate .webp from .png under public/images/investtracker (add PNG sources first).
 * Run: npm run optimize:images
 */
import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public/images/investtracker");

const files = await readdir(dir);
const pngs = files.filter((f) => f.endsWith(".png"));

for (const name of pngs) {
  const input = join(dir, name);
  const output = join(dir, name.replace(/\.png$/i, ".webp"));
  await sharp(input).webp({ quality: 82, effort: 6 }).toFile(output);
  console.log("wrote", output.replace(root + "/", ""));
}

console.log("optimize-investtracker-webp: OK", pngs.length, "files");
