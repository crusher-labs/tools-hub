#!/usr/bin/env node
// Post-deploy smoke test: hits every live URL (hub + 30 utility tools)
// and verifies HTTP 200, expected title, SEO-META block, key meta tags,
// pinned framework version, and reachable sitemap.xml + robots.txt.
//
// Run after a deploy or as a cron: `npm run smoke`
// Exits 0 if everything passes, 1 if any check fails.

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const HUB_URL = 'https://tools.muhammadhassaanjaved.com/';
const TARGET_VERSION = '1.2.1';
const FORBIDDEN_VERSIONS = ['0.1.1', '0.1.2', '0.1.3', '0.1.4', '0.1.5'];
const BATCH = 6;

const tools = JSON.parse(await readFile(resolve(repoRoot, 'tools.json'), 'utf8'));

const endpoints = [
  { name: 'tools-hub', url: HUB_URL, expectedTitle: 'Web Utility Tools by CRUSHER' },
  ...tools.map(t => ({
    name: new URL(t.url).pathname.replace(/^\/|\/$/g, ''),
    url: t.url,
    expectedTitle: t.name,
  })),
];

async function statusOf(url) {
  try {
    const r = await fetch(url, { redirect: 'follow' });
    return r.status;
  } catch (e) {
    return `fetch-error: ${e.message}`;
  }
}

async function checkOne({ name, url, expectedTitle }) {
  const errors = [];
  let html;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (res.status !== 200) errors.push(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    return { name, url, ok: false, errors: [`fetch error: ${e.message}`] };
  }

  // The catalog name is a display label; the <title> may be a longer SEO title.
  // Accept either an exact match or a title sharing the name's first two words.
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const stem = expectedTitle.split(' ').slice(0, 2).join(' ');
  if (title !== expectedTitle && !title.startsWith(stem)) {
    errors.push(`title="${title}" expected "${expectedTitle}" (or an SEO title starting "${stem}")`);
  }

  if (!html.includes('<!-- SEO-META-START -->')) errors.push('missing SEO-META-START marker');
  if (!html.includes('<!-- SEO-META-END -->')) errors.push('missing SEO-META-END marker');
  if (!/<meta name="description"/.test(html)) errors.push('missing <meta name="description">');
  if (!/<meta name="theme-color"/.test(html)) errors.push('missing <meta name="theme-color">');
  if (!/<link rel="canonical"/.test(html)) errors.push('missing <link rel="canonical">');
  if (!/property="og:type"/.test(html)) errors.push('missing Open Graph tags');

  // World pages (data-world on <html>) own their CSS and carry no kit pin.
  const isWorld = /<html[^>]*\sdata-world=/.test(html);
  if (!isWorld && !html.includes(`crusher-ui-kit@${TARGET_VERSION}/`)) {
    errors.push(`missing crusher-ui-kit@${TARGET_VERSION} reference`);
  }
  for (const v of FORBIDDEN_VERSIONS) {
    if (html.includes(`crusher-ui-kit@${v}/`)) {
      errors.push(`stale crusher-ui-kit@${v} reference`);
    }
  }

  const [sm, rb] = await Promise.all([
    statusOf(url + 'sitemap.xml'),
    statusOf(url + 'robots.txt'),
  ]);
  if (sm !== 200) errors.push(`sitemap.xml: ${sm}`);
  if (rb !== 200) errors.push(`robots.txt: ${rb}`);

  return { name, url, ok: errors.length === 0, errors };
}

const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + 'Z';
console.log(`Smoke test of ${endpoints.length} endpoints (${stamp})`);
console.log('='.repeat(72));

const results = [];
for (let i = 0; i < endpoints.length; i += BATCH) {
  const batchResults = await Promise.all(endpoints.slice(i, i + BATCH).map(checkOne));
  for (const r of batchResults) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(34)} ${r.url}`);
    if (!r.ok) for (const e of r.errors) console.log(`      └ ${e}`);
  }
  results.push(...batchResults);
}

const passed = results.filter(r => r.ok).length;
const failed = results.length - passed;
console.log('');
console.log(`${results.length} endpoints checked: ${passed} ok, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
