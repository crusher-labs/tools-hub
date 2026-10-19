#!/usr/bin/env node
// Builds sitemap.xml from what is actually on disk: the hub plus every tool page
// (including the compress-image-to-kb size variants). The old sitemap listed a
// single URL - the hub itself - so none of the tools were ever submitted to Google.
//
// Re-run after adding or removing a page: node scripts/render-sitemap.mjs

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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

// lastmod is the date of the last commit that touched the page, so it moves only
// when that page does. Stamping the build date on every URL told Google all 42
// pages changed on every rebuild, and Google uses lastmod only "if it's
// consistently and verifiably" accurate. A page with uncommitted edits gets
// today's date, because it is about to change.
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
if (git('rev-parse', '--is-shallow-repository') === 'true') {
  throw new Error('render-sitemap needs full git history to date each page (CI: actions/checkout with fetch-depth: 0)');
}
const today = new Date().toISOString().slice(0, 10);
const lastmod = (rel) => {
  const file = `${rel}index.html`;
  if (git('status', '--porcelain', '--', file)) return today;
  const date = git('log', '-1', '--format=%cs', '--', file);
  if (!date) throw new Error(`no commit found for ${file}`);
  return date;
};

const body = pages.map((rel) => {
  const isHub = rel === '';
  return `  <url>
    <loc>${BASE}${rel}</loc>
    <lastmod>${lastmod(rel)}</lastmod>
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
