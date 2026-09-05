#!/usr/bin/env node
// Builds sitemap.xml from what is actually on disk: the hub plus every tool page
// (including the compress-image-to-kb size variants). The old sitemap listed a
// single URL - the hub itself - so none of the tools were ever submitted to Google.
//
// Re-run after adding or removing a page: node scripts/render-sitemap.mjs

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://tools.muhammadhassaanjaved.com/';
const SKIP = new Set(['.git', '.github', 'node_modules', 'scripts']);
const posix = (p) => p.split('\\').join('/');

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (name !== 'index.html') continue;
    pages.push(posix(relative(ROOT, p)).replace(/index\.html$/, ''));
  }
};
walk(ROOT);
pages.sort((a, b) => a.length - b.length || a.localeCompare(b));

const today = new Date().toISOString().slice(0, 10);
const body = pages.map((rel) => {
  const isHub = rel === '';
  return `  <url>
    <loc>${BASE}${rel}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${isHub ? '1.0' : '0.8'}</priority>
  </url>`;
}).join('\n');

writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`);

// Every catalog entry must have a real page behind it, or we would be submitting 404s.
const tools = JSON.parse(readFileSync(join(ROOT, 'tools.json'), 'utf8'));
const have = new Set(pages.map((p) => BASE + p));
const orphans = tools.map((t) => t.url).filter((u) => !have.has(u));
if (orphans.length) throw new Error('tools.json lists URLs with no page on disk:\n' + orphans.join('\n'));

console.log(`[render-sitemap] ${pages.length} URLs written (hub + ${pages.length - 1} pages); every catalog entry resolves`);
