#!/usr/bin/env node
// Adds a "Related tools" row to every tool page's footer, between
// RELATED-TOOLS-START/END markers (strip-then-reinsert, safe to rerun).
//
// Why: 35 of the 37 tool pages linked to no other tool, so most tools had exactly
// one inbound link (the hub card). Sibling links let each indexed tool point at the
// others and tell Google which pages belong together.
//
// Picks: the tool's hand-chosen "related" slugs in tools.json (what someone using it
// would plausibly want next). A tool without that field falls back to the next three
// tools in its category, wrapping round, filled from the catalog when the category is
// small. The main compress-image-to-kb page also links its size pages, which no
// indexed page linked before. Size pages reuse their parent tool's picks.
//
// The row is a second <div class="foot"> right after the first, so it inherits each
// world's own footer styling rather than importing a foreign one.
//
// Run: node scripts/apply-related-links.mjs   (or npm run build)

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const START = '<!-- RELATED-TOOLS-START -->';
const END = '<!-- RELATED-TOOLS-END -->';
const BLOCK = new RegExp(`${START}[\\s\\S]*?${END}`, 'g');
const SKIP = new Set(['scripts', 'node_modules', '.git', '.github']);
const PICKS = 3;
const posix = (p) => p.split('\\').join('/');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const tools = JSON.parse(readFileSync(join(ROOT, 'tools.json'), 'utf8'));
const slugOf = (t) => new URL(t.url).pathname.replace(/^\/|\/$/g, '');
const bySlug = new Map(tools.map((t) => [slugOf(t), t]));

const related = (slug) => {
  const me = bySlug.get(slug);
  if (Array.isArray(me.related)) {
    return me.related.map((s) => {
      const t = bySlug.get(s);
      if (!t || t === me) throw new Error(`tools.json: "${slug}" lists related "${s}", which is not another tool in the catalog`);
      return t;
    });
  }
  const family = tools.filter((t) => t.category === me.category);
  const i = family.indexOf(me);
  const picks = [];
  for (let k = 1; k < family.length && picks.length < PICKS; k++) picks.push(family[(i + k) % family.length]);
  for (let k = 1; picks.length < PICKS && k < tools.length; k++) {
    const t = tools[(tools.indexOf(me) + k) % tools.length];
    if (t !== me && !picks.includes(t)) picks.push(t);
  }
  return picks;
};

const SIZES = ['20kb', '50kb', '100kb', '200kb'];
const rowFor = (slug, isSizeParent) => {
  const links = related(slug).map((t) => `<a href="${t.url}">${esc(t.name)}</a>`);
  if (isSizeParent) {
    for (const s of SIZES) links.push(`<a href="https://tools.muhammadhassaanjaved.com/${slug}/${s}/">Compress to ${s.replace('kb', ' KB')}</a>`);
  }
  return `${START}<div class="foot related-tools"><span>Related tools</span>${links.join('')}</div>${END}`;
};

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
const skipped = [];
for (const file of pages) {
  const rel = posix(relative(ROOT, file)).replace(/\/?index\.html$/, '');
  let html = readFileSync(file, 'utf8').replace(BLOCK, '');
  const slug = rel.split('/')[0];
  if (!rel || !bySlug.has(slug)) { if (rel) skipped.push(rel); writeFileSync(file, html); continue; }

  const footStart = html.indexOf('<div class="foot">');
  const footEnd = footStart < 0 ? -1 : html.indexOf('</div>', footStart);
  if (footEnd < 0) { skipped.push(rel + ' (no .foot)'); writeFileSync(file, html); continue; }

  const at = footEnd + '</div>'.length;
  html = html.slice(0, at) + rowFor(slug, rel === 'compress-image-to-kb') + html.slice(at);
  writeFileSync(file, html);
  done += 1;
}

console.log(`[apply-related-links] related row added to ${done} page(s)` + (skipped.length ? `; skipped ${skipped.length} (${skipped.join(', ')})` : ''));
