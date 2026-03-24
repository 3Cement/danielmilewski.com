import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

const pl = loadJson("src/messages/pl.json");
const en = loadJson("src/messages/en.json");

const requiredAbout = [
  "cvHeading",
  "cvEnglish",
  "cvPolish",
  "availabilityNote",
  "companyHeading",
  "companyBody",
  "companyRegistryLink",
];

const requiredLegal = ["privacyTitle", "privacyIntro", "privacyContact"];

for (const [name, data] of [
  ["pl", pl],
  ["en", en],
]) {
  for (const key of requiredAbout) {
    if (data.about?.[key] === undefined) {
      console.error(`Missing about.${key} in ${name}.json`);
      process.exit(1);
    }
  }
  for (const key of requiredLegal) {
    if (data.legal?.[key] === undefined) {
      console.error(`Missing legal.${key} in ${name}.json`);
      process.exit(1);
    }
  }
}

for (const f of ["public/cv/cv-en.pdf", "public/cv/cv-pl.pdf"]) {
  if (!existsSync(join(root, f))) {
    console.error(`Missing file: ${f}`);
    process.exit(1);
  }
}

/**
 * Dot-paths to leaf values (objects recurse; arrays count as one leaf).
 * about.techStack uses locale-specific category labels as keys — treat as one leaf for en/pl parity.
 */
function messageLeafPaths(obj, prefix = "") {
  const paths = [];
  if (obj === null || typeof obj !== "object") {
    if (prefix) paths.push(prefix);
    return paths;
  }
  if (Array.isArray(obj)) {
    if (prefix) paths.push(prefix);
    return paths;
  }
  for (const k of Object.keys(obj).sort()) {
    const p = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (p === "about.techStack" && v !== null && typeof v === "object" && !Array.isArray(v)) {
      paths.push(p);
      continue;
    }
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      paths.push(...messageLeafPaths(v, p));
    } else {
      paths.push(p);
    }
  }
  return paths;
}

const enPaths = new Set(messageLeafPaths(en));
const plPaths = new Set(messageLeafPaths(pl));
for (const path of enPaths) {
  if (!plPaths.has(path)) {
    console.error(`Key present in en.json but missing in pl.json: ${path}`);
    process.exit(1);
  }
}
for (const path of plPaths) {
  if (!enPaths.has(path)) {
    console.error(`Key present in pl.json but missing in en.json: ${path}`);
    process.exit(1);
  }
}

console.log("verify-messages: OK");
