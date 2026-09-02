#!/usr/bin/env node
// Bump the crusher-ui-kit CDN pin across the whole static tools line (hub + 30 tools).
//
// The five pinned files carry sha384 SRI integrity hashes. Bumping the version string
// without regenerating the hashes silently breaks every page (the browser blocks any
// file whose bytes changed) - that is exactly what caused the July "0.2.0 regression".
// This script does both in one pass: fetches the five files at the target version from
// jsDelivr, computes fresh hashes, rewrites every page, and updates TARGET_VERSION in
// check-static.mjs so the contract check enforces the new pin.
//
// Usage: node scripts/bump-kit.mjs <version>   (e.g. node scripts/bump-kit.mjs 1.2.1)
// Then:  npm run check:static

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const utilityToolsRoot = resolve(repoRoot, '..', 'utility-tools');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: node scripts/bump-kit.mjs <version>  (e.g. 1.2.1)');
  process.exit(1);
}

const PINNED_FILES = [
  'crusher-ui.min.css',
  'themes/minimal.css',
  'static/tool-shell.css',
  'static/tool-shell.js',
  'crusher-ui.standalone.esm.js'
];

// ---- Fetch + hash the five files at the target version ----------------------

const hashes = new Map();
for (const file of PINNED_FILES) {
  const url = `https://cdn.jsdelivr.net/npm/crusher-ui-kit@${version}/dist/${file}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[bump-kit] ${res.status} fetching ${url} - does ${version} exist on npm?`);
    process.exit(1);
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  const digest = createHash('sha384').update(bytes).digest('base64');
  hashes.set(file, `sha384-${digest}`);
  console.log(`[bump-kit] ${file} @ ${version}: ${hashes.get(file)} (${bytes.length} bytes)`);
}

// ---- Rewrite every page ------------------------------------------------------

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewrite(html) {
  let changed = false;
  for (const file of PINNED_FILES) {
    // Matches both the canonical hashed pin and a bare pin with no SRI attributes,
    // normalizing either to version + fresh hash + crossorigin.
    const re = new RegExp(
      `crusher-ui-kit@\\d+\\.\\d+\\.\\d+/dist/${escapeRe(file)}"(?: integrity="sha384-[A-Za-z0-9+/=]+")?(?: crossorigin="anonymous")?`,
      'g'
    );
    const next = html.replace(re, `crusher-ui-kit@${version}/dist/${file}" integrity="${hashes.get(file)}" crossorigin="anonymous"`);
    if (next !== html) changed = true;
    html = next;
  }
  return { html, changed };
}

// Every tool's index.html, plus variant landing pages one level deeper
// (e.g. compress-image-to-kb/50kb/index.html) - those carry the same pins.
const pages = [join(repoRoot, 'index.html')];
for (const entry of await readdir(utilityToolsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const toolDir = join(utilityToolsRoot, entry.name);
  pages.push(join(toolDir, 'index.html'));
  for (const sub of await readdir(toolDir, { withFileTypes: true })) {
    if (!sub.isDirectory() || sub.name.startsWith('.') || sub.name === 'scripts') continue;
    try {
      await readFile(join(toolDir, sub.name, 'index.html'));
      pages.push(join(toolDir, sub.name, 'index.html'));
    } catch (e) { /* subdir without a page - not a variant */ }
  }
}

let rewritten = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const file of PINNED_FILES) {
    if (!html.includes(`/dist/${file}"`)) {
      console.error(`[bump-kit] ${page} is missing a pin for ${file} - refusing to continue`);
      process.exit(1);
    }
  }
  const result = rewrite(html);
  if (result.changed) {
    await writeFile(page, result.html);
    rewritten += 1;
  }
}
console.log(`[bump-kit] rewrote ${rewritten} of ${pages.length} pages to crusher-ui-kit@${version}`);

// ---- Keep the contract check in lock-step ------------------------------------

for (const script of ['check-static.mjs', 'smoke.mjs']) {
  const scriptPath = join(__dirname, script);
  const src = await readFile(scriptPath, 'utf8');
  const next = src.replace(/const TARGET_VERSION = '[^']+';/, `const TARGET_VERSION = '${version}';`);
  if (next !== src) {
    await writeFile(scriptPath, next);
    console.log(`[bump-kit] ${script} TARGET_VERSION -> ${version}`);
  }
}

console.log('[bump-kit] done. Run: npm run check:static');
