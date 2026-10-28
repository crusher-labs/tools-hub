#!/usr/bin/env node
// Points each page's share tags at its og.jpg (rendered by scripts/render-og.mjs):
// og:image with its size and alt text, and twitter:image, between OG-IMAGE-START/END
// markers inside the SEO-META block (strip-then-reinsert, safe to rerun). Also
// switches twitter:card to summary_large_image so the card shows the image.
//
// Run: node scripts/apply-og.mjs   (or npm run build)

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://tools.muhammadhassaanjaved.com/';
const START = '<!-- OG-IMAGE-START -->';
const END = '<!-- OG-IMAGE-END -->';
const BLOCK = new RegExp(`[ \\t]*${START}[\\s\\S]*?${END}\\n?`, 'g');
const SEO_END = '<!-- SEO-META-END -->';
const SKIP = new Set(['scripts', 'node_modules', '.git', '.github']);
const posix = (p) => p.split('\\').join('/');
const attr = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/"/g, '&quot;');

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

let done = 0;
const missing = [];
for (const file of pages) {
  const rel = posix(relative(ROOT, dirname(file)));
  let html = readFileSync(file, 'utf8').replace(BLOCK, '');
  const at = html.indexOf(SEO_END);
  if (!existsSync(join(dirname(file), 'og.jpg')) || at < 0) { missing.push(rel || '(hub)'); writeFileSync(file, html); continue; }
  const img = `${BASE}${rel ? rel + '/' : ''}og.jpg`;
  // og:image:alt describes what is in the image, not the page: the card is the top of
  // the page, so name what it shows by the page's own heading.
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const alt = rel ? `Screenshot of the ${h1} tool page` : 'Screenshot of the Web Utility Tools directory page';
  const indent = (html.slice(0, at).match(/\n([ \t]*)$/) || [, ''])[1];
  const block = `${START}<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${attr(alt)}"><meta name="twitter:image" content="${img}"><meta name="twitter:image:alt" content="${attr(alt)}">${END}\n${indent}`;
  html = html.slice(0, at) + block + html.slice(at);
  html = html.replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">');
  writeFileSync(file, html);
  done += 1;
}

console.log(`[apply-og] share image wired on ${done} page(s)` + (missing.length ? `; no og.jpg for ${missing.length} (${missing.join(', ')})` : ''));
