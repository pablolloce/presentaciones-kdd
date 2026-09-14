#!/usr/bin/env node
/**
 * Capture a single 1280x720 PNG of the cover slide (or full doc top fold)
 * for use as gallery thumbnail. Does NOT modify the source HTML.
 *
 * Usage:
 *   node capture-thumb.mjs <source.html> <output.png> [--theme light|dark]
 */
import { chromium } from "playwright";
import { resolve } from "path";
import { existsSync } from "fs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a) => !a.startsWith("--"));
const srcPath = resolve(positional[0] || "");
const outPath = resolve(positional[1] || "");
const theme = (flag("--theme") || "light").toLowerCase();

if (!srcPath || !outPath || !existsSync(srcPath)) {
  console.error("Usage: node capture-thumb.mjs <source.html> <output.png> [--theme light|dark]");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${srcPath}`, { waitUntil: "networkidle" });
await page.evaluate((t) => {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("nfq-deck-theme", t);
    localStorage.setItem("nfq-doc-theme", t);
    localStorage.setItem("nfq-gallery-theme", t);
  } catch {}
}, theme);
await page.waitForTimeout(900);
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1280, height: 720 } });
await browser.close();
console.log(`Captured ${outPath}`);
