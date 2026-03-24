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

console.log("verify-messages: OK");
