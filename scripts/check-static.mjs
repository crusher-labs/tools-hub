#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
// Tools are subdirectories of this repo (one Pages site, one host). Anything
// that is not a tool directory is listed here.
const NON_TOOL_DIRS = new Set(['scripts', 'node_modules', '.git', '.github']);
const TARGET_VERSION = '1.2.1';
const KNOWN_CATEGORIES = new Set(['text', 'design', 'media', 'security', 'time']);

function assert(condition, message) {
  if (!condition) throw new Error(`[tools-hub] ${message}`);
}

const errors = [];
function softAssert(label, condition, message) {
  if (!condition) errors.push(`[${label}] ${message}`);
}

// ---- Hub contract -----------------------------------------------------------

const [hubHtml, rawTools, cname] = await Promise.all([
  readFile(join(repoRoot, 'index.html'), 'utf8'),
  readFile(join(repoRoot, 'tools.json'), 'utf8'),
  readFile(join(repoRoot, 'CNAME'), 'utf8')
]);

const tools = JSON.parse(rawTools);
assert(Array.isArray(tools), 'tools.json must be an array');
assert(tools.length > 0, 'tools.json must contain at least one tool');
assert(cname.trim() === 'tools.muhammadhassaanjaved.com', 'CNAME must match the public tools domain');

assertStaticContract('tools-hub/index.html', hubHtml);
// The catalog must be STATIC in the HTML. It used to be built client-side from
// tools.json, which left no crawlable link to any tool: Google never indexed one
// of them in four months. Never let that regress.
assert(!hubHtml.includes("fetch('./tools.json'"), 'index.html must NOT build its catalog at runtime; run scripts/render-catalog.mjs');

const names = new Set();
const urls = new Set();
for (const [index, tool] of tools.entries()) {
  const label = `tool at index ${index}`;
  assert(typeof tool.name === 'string' && tool.name.trim(), `${label} needs a name`);
  assert(typeof tool.description === 'string' && tool.description.trim(), `${label} needs a description`);
  assert(typeof tool.icon === 'string' && tool.icon.trim(), `${label} needs an icon`);
  assert(typeof tool.url === 'string' && tool.url.trim(), `${label} needs a URL`);
  assert(typeof tool.category === 'string' && tool.category.trim(), `${label} needs a category`);
  assert(KNOWN_CATEGORIES.has(tool.category), `${label} category "${tool.category}" not in [${[...KNOWN_CATEGORIES].join(', ')}]`);

  const url = new URL(tool.url);
  assert(url.protocol === 'https:', `${tool.name} URL must use https`);
  assert(url.hostname === 'tools.muhammadhassaanjaved.com', `${tool.name} URL must sit on the tools host, not a third-party domain`);
  assert(url.pathname !== '/', `${tool.name} URL must include a tool path`);
  assert(!names.has(tool.name), `duplicate tool name: ${tool.name}`);
  assert(!urls.has(tool.url), `duplicate tool URL: ${tool.url}`);
  names.add(tool.name);
  urls.add(tool.url);
}

// Every catalog entry needs a real, crawlable <a href> in the hub HTML, and the
// hub needs a link out to each tool for discovery to work at all.
for (const tool of tools) {
  const path = new URL(tool.url).pathname;
  assert(hubHtml.includes(`href="${path}"`), `index.html has no static link to ${path} (run scripts/render-catalog.mjs)`);
}
const staticLinks = (hubHtml.match(/class="crusher-tool-card hub-card"/g) || []).length;
assert(staticLinks === tools.length, `index.html has ${staticLinks} tool cards but tools.json lists ${tools.length}`);

// ---- Workspace-wide utility-tools audit ------------------------------------

let toolsAudited = 0;
try {
  const entries = await readdir(repoRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || NON_TOOL_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const toolDir = join(repoRoot, entry.name);
    const indexPath = join(toolDir, 'index.html');
    try {
      const html = await readFile(indexPath, 'utf8');
      assertStaticContract(`${entry.name}/index.html`, html);
      toolsAudited += 1;
    } catch (err) {
      if (err.code === 'ENOENT') {
        softAssert(entry.name, false, 'missing index.html');
      } else {
        throw err;
      }
    }
    // Variant landing pages one level deeper (e.g. 50kb/index.html) carry the
    // same contract - stale pins on a forgotten variant are the July failure.
    for (const sub of await readdir(toolDir, { withFileTypes: true })) {
      if (!sub.isDirectory() || sub.name.startsWith('.') || sub.name === 'scripts') continue;
      try {
        const html = await readFile(join(toolDir, sub.name, 'index.html'), 'utf8');
        assertStaticContract(`${entry.name}/${sub.name}/index.html`, html);
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
    }
  }
} catch (err) {
  throw err;
}
softAssert(
  'tools',
  toolsAudited === tools.length,
  `audited ${toolsAudited} tool page(s) but the catalog lists ${tools.length} - the fleet was NOT fully validated`
);
// Hub's own sitemap + robots
for (const seoFile of ['sitemap.xml', 'robots.txt']) {
  try { await stat(join(repoRoot, seoFile)); }
  catch (err) {
    if (err.code === 'ENOENT') softAssert('tools-hub', false, `missing ${seoFile}`);
    else throw err;
  }
}

if (errors.length > 0) {
  for (const e of errors) console.error(e);
  throw new Error(`[tools-hub] ${errors.length} static-contract violation(s) across hub + tools`);
}

console.log(`[tools-hub] ${tools.length} catalog entries validated`);
console.log(`[tools-hub] static contract validated for hub + ${toolsAudited} tool page(s)`);

// ---- Helpers ---------------------------------------------------------------

function assertStaticContract(label, html) {
  const must = (cond, msg) => softAssert(label, cond, msg);

  // World pages (2026-09-02 standard): the page is a committed object from the
  // tool's world and owns its CSS. They do not load the kit shell or the style
  // switcher. Detected by data-world="<name>" on <html>; everything else is a
  // legacy shell page and keeps the original contract below.
  const world = html.match(/<html[^>]*\sdata-world="([^"]+)"/);
  if (world) {
    must(label !== 'tools-hub/index.html', 'only tool pages may be world pages; the hub keeps the kit shell');
    must(!html.includes('crusher-ui-kit@'), `world page "${world[1]}" must not load crusher-ui-kit (worlds own their CSS)`);
    must(!html.includes('<crusher-style-switcher'), 'world pages have no style switcher (a world has a mode)');
    must(html.includes('<meta name="viewport"'), 'must declare the viewport meta');
    must(/<link[^>]+rel="stylesheet"[^>]+fonts\.googleapis\.com/.test(html) || !/fonts\.googleapis/.test(html), 'Google Fonts must load via a <link rel="stylesheet">');
    must(html.includes('https://tools.muhammadhassaanjaved.com/'), 'must link back to the hub');
    must(html.includes('<!-- SEO-META-START -->') && html.includes('<!-- SEO-META-END -->'), 'must contain the SEO-META block');
    must(html.includes('<meta name="description"'), 'must declare <meta name="description">');
    must(html.includes('<meta name="theme-color"'), 'must declare <meta name="theme-color">');
    must(html.includes('<link rel="canonical"'), 'must declare <link rel="canonical">');
    must(html.includes('property="og:type"'), 'must declare Open Graph tags');
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    must(titleMatch && titleMatch[1].trim().length > 0, 'must have a non-empty <title>');
    must(html.includes('rel="icon"'), 'must declare a favicon link');
    must(html.includes('http-equiv="Content-Security-Policy"'), 'must declare a Content-Security-Policy meta tag');
    must(html.includes('https://api.web3forms.com'), 'must allow https://api.web3forms.com in CSP connect-src');
    must(html.includes('id="tool-feedback-form"'), 'must ship the "Suggest an improvement" feedback form');
    must(html.includes('class="tool-feedback-honey"'), 'feedback form must include the botcheck honeypot');
    must(html.includes("'30e570c5-aeeb-439d-8a8a-bd2516a5dc5d'") || html.includes('"30e570c5-aeeb-439d-8a8a-bd2516a5dc5d"'), 'feedback form must carry the Web3Forms access key');
    must(!html.includes('cdn.tailwindcss.com'), 'must not load the Tailwind CDN');
    must(!html.includes('font-awesome') && !html.includes('fontawesome'), 'must not load Font Awesome');
    must(/<h1[\s>]/.test(html), 'must have an <h1>');
    must(/<h2[\s>]/.test(html) && html.includes('<details'), 'must carry the prose + FAQ section (SEO content)');
    return;
  }

  must(
    html.includes(`crusher-ui-kit@${TARGET_VERSION}/dist/crusher-ui.min.css`),
    `must load crusher-ui-kit@${TARGET_VERSION} CSS bundle`
  );
  must(
    html.includes(`crusher-ui-kit@${TARGET_VERSION}/dist/themes/minimal.css`),
    `must load the published minimal theme CSS from @${TARGET_VERSION}`
  );
  must(
    html.includes(`crusher-ui-kit@${TARGET_VERSION}/dist/static/tool-shell.css`),
    `must load the static tool-shell CSS from @${TARGET_VERSION}`
  );
  must(
    html.includes(`crusher-ui-kit@${TARGET_VERSION}/dist/static/tool-shell.js`),
    `must defer-load the static tool-shell.js helper from @${TARGET_VERSION}`
  );
  must(
    html.includes(`crusher-ui-kit@${TARGET_VERSION}/dist/crusher-ui.standalone.esm.js`),
    `must load standalone ESM bundle from @${TARGET_VERSION}`
  );

  must(html.includes('data-theme-lock="minimal"'), 'must lock the public UI to the minimal theme');
  must(html.includes('data-default-theme="minimal"'), 'must declare data-default-theme="minimal" on <html>');
  must(html.includes('data-default-mode="dark"'), 'must declare data-default-mode="dark" on <html> (default mode for the crusher-labs aesthetic — flipped 2026-05-14)');

  must(html.includes('<!-- SEO-META-START -->') && html.includes('<!-- SEO-META-END -->'),
       'must contain the SEO-META block (description, theme-color, canonical, OG, Twitter) — sweep-able via the START/END markers');
  must(html.includes('<meta name="description"'), 'must declare <meta name="description"> for SEO');
  must(html.includes('<meta name="theme-color"'), 'must declare <meta name="theme-color"> for mobile browser chrome');
  must(html.includes('<link rel="canonical"'), 'must declare <link rel="canonical"> pointing at the production URL');
  must(html.includes('property="og:type"'), 'must declare Open Graph tags (og:type, og:title, og:description, og:url, og:site_name) for share previews');
  must(html.includes('data-default-brand='), 'must declare a data-default-brand color on <html>');
  must(html.includes('<crusher-style-switcher'), 'must mount <crusher-style-switcher>');
  must(html.includes('hide-themes'), 'style switcher must hide dialect choices');
  must(html.includes('hide-theme-color'), 'style switcher must hide theme-primary swatch');

  // Page-level hygiene
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  must(titleMatch && titleMatch[1].trim().length > 0, 'must have a non-empty <title>');
  must(html.includes('rel="icon"'), 'must declare a favicon link (use <link rel="icon" href="data:,"> at minimum)');
  must(
    html.includes('http-equiv="Content-Security-Policy"'),
    'must declare a Content-Security-Policy meta tag'
  );
  must(
    html.includes("slot=\"mode-light-icon\"") && html.includes("slot=\"mode-dark-icon\""),
    'style switcher must slot custom sun/moon icons (framework fallback is FA5; tools should use FA6 paths)'
  );

  // Every kit reference must be the pinned version - a stray old pin means a page
  // the bump sweep missed (and its SRI hashes are stale with it).
  for (const match of html.matchAll(/crusher-ui-kit@(\d+\.\d+\.\d+)/g)) {
    must(match[1] === TARGET_VERSION, `references crusher-ui-kit@${match[1]} - the pinned version is ${TARGET_VERSION} (bump via scripts/bump-kit.mjs, never by hand: the SRI hashes must be regenerated in the same pass)`);
  }

  // Each of the five pins must carry an SRI integrity hash. The hash bytes are trusted
  // to bump-kit.mjs (verifying them here would need the network); presence is the contract.
  for (const pinned of ['crusher-ui.min.css', 'themes/minimal.css', 'static/tool-shell.css', 'static/tool-shell.js', 'crusher-ui.standalone.esm.js']) {
    const pinRe = new RegExp(`crusher-ui-kit@${TARGET_VERSION.replaceAll('.', '\\.')}/dist/${pinned.replaceAll('.', '\\.')}" integrity="sha384-[A-Za-z0-9+/=]+" crossorigin="anonymous"`);
    must(pinRe.test(html), `the ${pinned} pin must carry a sha384 integrity hash + crossorigin`);
  }

  const forbidden = [
    ['/src/css/themes/', 'must not deep-link framework source theme CSS'],
    ['cdn.tailwindcss.com', 'must not load the Tailwind CDN (chrome should use crusher-tool-* primitives)'],
    ['crusher-minimal-mode-lock', 'must not ship the legacy crusher-minimal-mode-lock IIFE — tool-shell.js replaces it'],
    ['crusher-tools-framework-bridge', 'must not ship the framework-bridge style block — tool-shell.css replaces it'],
    ['id="theme-toggle"', 'must not ship the legacy #theme-toggle button — style switcher provides the mode toggle'],
    ['style-switcher-v3', 'must not reset stale mode prefs via the legacy contract version key'],
    ['_setActiveColor', 'must not call private style-switcher member _setActiveColor'],
    ['_cacheSwatchColors', 'must not call private style-switcher member _cacheSwatchColors'],
    ['.hasCustomBrand', 'must not access private style-switcher member hasCustomBrand'],
    ['.activeBrand', 'must not access private style-switcher member activeBrand']
  ];
  for (const [needle, msg] of forbidden) {
    must(!html.includes(needle), msg);
  }

  for (const theme of ['glass', 'brutal', 'neumorph', 'neobrutal', 'futuristic', 'bento']) {
    must(!html.includes(`dist/themes/${theme}.css`), `must not load the ${theme} theme CSS`);
  }

  must(!html.includes('hide-colors'), 'style switcher must keep color controls visible');
  must(!html.includes('hide-mode'), 'style switcher must keep light/dark controls visible');

  // Web3Forms email-capture contract (2026-05-14).
  must(
    html.includes('https://api.web3forms.com'),
    'must allow https://api.web3forms.com in CSP connect-src (email capture endpoint)'
  );
  if (label.startsWith('utility-tools/')) {
    must(
      html.includes('id="tool-feedback-form"'),
      'utility tool must ship the "Suggest an improvement" feedback disclosure form'
    );
    must(
      html.includes('class="tool-feedback-honey"'),
      'feedback form must include the botcheck honeypot'
    );
    must(
      html.includes("'30e570c5-aeeb-439d-8a8a-bd2516a5dc5d'") ||
        html.includes('"30e570c5-aeeb-439d-8a8a-bd2516a5dc5d"'),
      'feedback form must carry the Web3Forms access key (rotate via batch script if compromised)'
    );
  }
  if (label === 'tools-hub/index.html') {
    must(html.includes('id="newsletter-form"'), 'tools-hub must ship the newsletter signup form');
    must(html.includes('id="suggest-form"'), 'tools-hub must ship the suggest-a-tool form');
  }
}
