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
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let shallow;
try { shallow = git('rev-parse', '--is-shallow-repository'); } catch {
  throw new Error('render-sitemap must run inside a git checkout of tools-hub: it dates each page by its commits');
}
if (shallow === 'true') {
  throw new Error('render-sitemap needs full git history to date each page (CI: actions/checkout with fetch-depth: 0)');
}
// Local date, not UTC: git's %as is the author date in the author's own zone,
// so a page rendered and committed the same local day must get the same date.
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
// A tool's page is its index.html plus the scripts and styles beside it (qrcode.js,
// lame.min.js); its notes (AGENTS.md, README.md) are not the page. The hub is
// index.html alone, because the root also holds sitemap.xml, which this writes.
// Author date (%as), not committer date: a rebase, amend or cherry-pick keeps it.
const ASSET = /\.(html|js|css|svg|png|jpe?g|webp|gif|ico|woff2?|ttf|txt)$/i;
const pageFiles = (rel) => (rel === '' ? ['index.html'] : readdirSync(join(ROOT, rel))
  .filter((f) => ASSET.test(f) && statSync(join(ROOT, rel, f)).isFile())
  .map((f) => rel + f));
const lastmod = (rel) => {
  const files = pageFiles(rel);
  if (git('status', '--porcelain', '--', ...files)) return today;
  const date = git('log', '-1', '--format=%as', '--', ...files);
  if (!date) throw new Error(`no commit found for ${rel}index.html`);
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
