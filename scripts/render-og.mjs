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
  console.error('render-og needs Playwright: run `npm install` and `npx playwright install chromium` at the repo root');
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

// Cards must be repeatable and must not leak the machine they were made on: lay the
// page out at the designed desktop width (1440x756) and scale it into 1200x630, in
// UTC and en-US, with the date frozen, the random sources seeded, reduced motion, and
// CSS animations held at one moment. Two pages still animate with JavaScript timers
// (color-converter's loupe, youtube-thumbnail-downloader's countdown leader), so
// their cards can differ by a frame between renders; every other card is
// byte-identical on a re-run.
const FROZEN = new Date('2026-01-01T12:00:00Z');
// Math.random and crypto's random sources both come from one seeded generator, so a
// generated password, UUID or token is the same on every render.
const SEEDED_RANDOM = `(() => {
  let s = 0x2f6e2b1;
  const next = () => { s = (s * 1664525 + 1013904223) >>> 0; return s; };
  Math.random = () => next() / 4294967296;
  const fill = (arr) => { const u8 = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength); for (let i = 0; i < u8.length; i++) u8[i] = next() >>> 24; return arr; };
  try { crypto.getRandomValues = fill; } catch (e) {}
  try { crypto.randomUUID = () => { const b = fill(new Uint8Array(16)); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128; const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join(''); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20); }; } catch (e) {}
})();`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 756 },
  deviceScaleFactor: 1200 / 1440,
  timezoneId: 'UTC',
  locale: 'en-US',
  reducedMotion: 'reduce',
});
await context.addInitScript(SEEDED_RANDOM);
const page = await context.newPage();
await page.clock.setFixedTime(FROZEN);
let done = 0;
try {
  for (const file of pages) {
    const rel = posix(relative(ROOT, dirname(file)));
    if (only.size && !only.has(rel)) continue;
    // Pages pull fonts from the network, so one slow load is retried before giving up.
    for (let attempt = 1; ; attempt++) {
      try {
        await page.goto(pathToFileURL(file).href, { waitUntil: 'load', timeout: 60000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1500);
        // Hold every CSS animation at the same moment (2 s in): loops stop at one fixed
        // frame, and fade-ins sit at their finished state rather than mid-fade.
        await page.evaluate(() => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = 2000; } });
        await page.waitForTimeout(100);
        await page.screenshot({ path: join(dirname(file), 'og.jpg'), type: 'jpeg', quality: 85 });
        break;
      } catch (e) {
        if (attempt >= 2) throw new Error(`render-og: ${rel || '(hub)'} failed twice: ${e.message}`);
      }
    }
    done += 1;
  }
} finally {
  await browser.close();
}
console.log(`[render-og] ${done} share card(s) written`);
