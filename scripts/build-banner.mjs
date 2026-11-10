/**
 * build-banner.mjs
 * Generates assets/banner.png — 1600×400, navy #050816 background with an
 * indigo #6366F1 radial glow and the text lockup centered.
 *
 * Usage:
 *   node scripts/build-banner.mjs
 *
 * Requires: sharp  (npm install sharp)
 */

import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "..", "assets", "banner.png");

const W = 1600;
const H = 400;

// SVG that sharp will rasterise — no external fonts needed; uses system-safe stacks
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <!-- deep navy background -->
    <rect id="bg" width="${W}" height="${H}" fill="#050816"/>

    <!-- indigo radial glow, centred -->
    <radialGradient id="glow" cx="50%" cy="50%" r="40%">
      <stop offset="0%"   stop-color="#6366F1" stop-opacity="0.18"/>
      <stop offset="60%"  stop-color="#6366F1" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#050816" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#050816"/>

  <!-- Glow overlay -->
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Thin top accent line -->
  <rect x="600" y="88" width="400" height="2" rx="1" fill="#6366F1" opacity="0.6"/>

  <!-- Name — large, light -->
  <text
    x="${W / 2}" y="210"
    font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    font-size="72"
    font-weight="700"
    letter-spacing="2"
    fill="#E8E8F0"
    text-anchor="middle"
    dominant-baseline="middle">Prathamesh Chiddarwar</text>

  <!-- Subtitle — indigo, smaller -->
  <text
    x="${W / 2}" y="285"
    font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    font-size="28"
    font-weight="400"
    letter-spacing="6"
    fill="#6366F1"
    text-anchor="middle"
    dominant-baseline="middle">FULL-STACK · CYBERSECURITY</text>

  <!-- Thin bottom accent line -->
  <rect x="680" y="318" width="240" height="1" rx="0.5" fill="#6366F1" opacity="0.35"/>
</svg>
`.trim();

async function build() {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUTPUT);

  const { size } = fs.statSync(OUTPUT);
  console.log(`Banner written → ${OUTPUT}  (${(size / 1024).toFixed(1)} KB)`);

  if (size > 300 * 1024) {
    console.warn("⚠  Banner exceeds 300 KB target — consider reducing SVG complexity.");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
