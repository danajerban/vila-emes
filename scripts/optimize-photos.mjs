#!/usr/bin/env node
// One-shot photo optimization for Vila Emes.
// Reads /Users/erbandanaj/Downloads/Emes/<folder>/, writes webp at 3 sizes
// to src/assets/photos/<category>/<basename>-<size>.webp.

import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, extname, resolve } from "node:path";
import sharp from "sharp";

const SOURCE = "/Users/erbandanaj/Downloads/Emes";
const DEST = resolve("src/assets/photos");

// Source folder → category mapping (R-05 from v2 plan)
const MAP = {
  "Main": "main",
  "101":  "deluxe-rooms",
  "102":  "deluxe-rooms",
  "103":  "deluxe-rooms",
  "1+1":  "apt-1bed-terrace",
  "2+1":  "apt-2bed",
  "301":  "standard-rooms",
  "302":  "standard-rooms",
  "303":  "standard-rooms",
  "304":  "standard-rooms",
  "305":  "standard-rooms",
  "306":  "standard-rooms",
};

const SIZES = [
  { suffix: "2400", longest: 2400 },
  { suffix: "1600", longest: 1600 },
  { suffix: "800",  longest: 800 },
];

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function processOne(srcFile, category, base) {
  for (const size of SIZES) {
    const outPath = join(DEST, category, `${base}-${size.suffix}.webp`);
    if (existsSync(outPath)) continue;
    await sharp(srcFile)
      .rotate()                       // honor EXIF orientation, then strip
      .resize({ width: size.longest, height: size.longest, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outPath);
  }
}

async function main() {
  let totalSrc = 0;
  let totalOut = 0;

  for (const [folder, category] of Object.entries(MAP)) {
    const srcDir = join(SOURCE, folder);
    if (!existsSync(srcDir)) {
      console.warn(`  [skip] ${folder} — not found`);
      continue;
    }
    await mkdir(join(DEST, category), { recursive: true });

    const files = (await readdir(srcDir)).filter((f) => {
      const ext = extname(f).toLowerCase();
      return VALID_EXT.has(ext);
    });

    if (files.length === 0) {
      console.log(`  [skip] ${folder} (${category}) — no images`);
      continue;
    }

    console.log(`  [${category}] ${folder}: ${files.length} files`);
    for (const f of files) {
      const srcFile = join(srcDir, f);
      const base = basename(f, extname(f))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      await processOne(srcFile, category, base);
      totalSrc++;
      totalOut += SIZES.length;
    }
  }

  console.log(`\n  done: ${totalSrc} sources → ${totalOut} webp variants`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
