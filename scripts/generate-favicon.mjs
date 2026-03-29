import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "src/app/favicon.ico");

function svgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="55%" stop-color="#111827" />
          <stop offset="100%" stop-color="#0b1220" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="url(#g)" stroke="#1f2937" />
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#111827" stroke="#334155" />
      <polyline
        points="11,11 15,16 11,21"
        fill="none"
        stroke="#38bdf8"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect x="17" y="19" width="5" height="2.4" rx="1.2" fill="#38bdf8" />
    </svg>
  `;
}

async function createPng(size) {
  return sharp(Buffer.from(svgMarkup()))
    .resize(size, size)
    .png()
    .toBuffer();
}

function createIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);
  let offset = header.length + entries.length;

  pngs.forEach(({ size, png }, index) => {
    const entryOffset = index * 16;
    entries.writeUInt8(size === 256 ? 0 : size, entryOffset);
    entries.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    entries.writeUInt8(0, entryOffset + 2);
    entries.writeUInt8(0, entryOffset + 3);
    entries.writeUInt16LE(1, entryOffset + 4);
    entries.writeUInt16LE(32, entryOffset + 6);
    entries.writeUInt32LE(png.length, entryOffset + 8);
    entries.writeUInt32LE(offset, entryOffset + 12);
    offset += png.length;
  });

  return Buffer.concat([header, entries, ...pngs.map(({ png }) => png)]);
}

const sizes = [16, 32];
const pngs = await Promise.all(
  sizes.map(async (size) => ({ size, png: await createPng(size) })),
);

fs.writeFileSync(outFile, createIco(pngs));
console.log(`Wrote ${outFile}`);
