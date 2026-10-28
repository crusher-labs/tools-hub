#!/usr/bin/env node
// Renders each page's share card: the top 1200x630 of the page itself, saved as
// og.jpg beside its index.html. A world page's opening screen is its object (the
// green-bar printout, the safe dial), which is what a shared link should show.
//
// Needs Playwright: `npm install`, then `npx playwright install chromium`.
// Run by hand when a page's look changes, then `npm run build` to wire the tags.
//
// Run: node scripts/render-og.mjs [slug ...]   (no slugs = every page)

import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative } from 'node:path';

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  console.error('render-og needs Playwright: run `npm install` and `npx playwright install chromium` in repos/tools-hub');
  process.exit(1);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['scripts', 'node_modules', '.git', '.github']);
const only = new Set(process.argv.slice(2).map((s) => s.replace(/^\/|\/$/g, '')));
const posix = (p) => p.split('\\').join('/');

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (entry === 'index.html') pages.push(p);
  }
};
walk(ROOT);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let done = 0;
try {
  for (const file of pages) {
    const rel = posix(relative(ROOT, dirname(file)));
    if (only.size && !only.has(rel)) continue;
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(dirname(file), 'og.jpg'), type: 'jpeg', quality: 85 });
    done += 1;
  }
} finally {
  await browser.close();
}
console.log(`[render-og] ${done} share card(s) written`);
