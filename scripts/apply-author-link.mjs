#!/usr/bin/env node
// Adds a "Built by Muhammad Hassaan Javed" link to every tool page's footer,
// between AUTHOR-LINK-START/END markers (strip-then-reinsert, safe to rerun).
//
// Why: the tools are meant to make their author discoverable, but until now not one
// of the 41 pages linked anywhere except back to the hub. This is the outbound
// half of that goal, and it gives the personal site a real server-rendered inbound
// link from every tool - the exact thing the site's own <crusher-button> cannot
// provide, since its anchor lives in shadow DOM.
//
// The footer is bespoke per world but structurally identical everywhere:
//   <div class="foot"><span>...</span><a href="<hub>">All tools</a></div>
// so the link inherits each world's own footer styling rather than importing a
// foreign one.
//
// Run: node scripts/apply-author-link.mjs   (or npm run build)

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUTHOR_URL = 'https://muhammadhassaanjaved.com/';
const START = '<!-- AUTHOR-LINK-START -->';
const END = '<!-- AUTHOR-LINK-END -->';
const BLOCK = new RegExp(`[ \\t]*${START}[\\s\\S]*?${END}`, 'g');
const SKIP = new Set(['scripts', 'node_modules', '.git', '.github']);
const posix = (p) => p.split('\\').join('/');

const LINK = `${START}<a href="${AUTHOR_URL}" rel="author">Built by Muhammad Hassaan Javed</a>${END}`;
const FOOT_CLOSE = '</a></div>';

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
  const rel = posix(relative(ROOT, file)).replace(/index\.html$/, '') || '(hub)';
  let html = readFileSync(file, 'utf8').replace(BLOCK, '');

  // The hub has its own footer with a personal-site link already; only tool pages.
  const footStart = html.indexOf('<div class="foot">');
  if (footStart < 0) { skipped.push(rel); writeFileSync(file, html); continue; }
  const footEnd = html.indexOf(FOOT_CLOSE, footStart);
  if (footEnd < 0) { skipped.push(rel + ' (no closing anchor in .foot)'); writeFileSync(file, html); continue; }

  const at = footEnd + FOOT_CLOSE.length - '</div>'.length;
  html = html.slice(0, at) + LINK + html.slice(at);
  writeFileSync(file, html);
  done += 1;
}

console.log(`[apply-author-link] footer link added to ${done} page(s)` + (skipped.length ? `; skipped ${skipped.length} (${skipped.join(', ')})` : ''));
