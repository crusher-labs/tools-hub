#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(`[tools-hub] ${message}`);
}

const [html, rawTools, cname] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('tools.json', 'utf8'),
  readFile('CNAME', 'utf8')
]);

const tools = JSON.parse(rawTools);
assert(Array.isArray(tools), 'tools.json must be an array');
assert(tools.length > 0, 'tools.json must contain at least one tool');
assert(cname.trim() === 'tools.muhammadhassaanjaved.com', 'CNAME must match the public tools domain');
assert(html.includes("fetch('./tools.json'"), 'index.html must load tools.json');
assert(html.includes('dist/crusher-ui.min.css'), 'index.html must use the published static CSS artifact');
assert(html.includes('dist/crusher-ui.standalone.esm.js'), 'index.html must use the published standalone JS artifact');
assert(!html.includes('/src/css/themes/'), 'index.html must not deep-link framework source theme CSS');

const names = new Set();
const urls = new Set();
for (const [index, tool] of tools.entries()) {
  const label = `tool at index ${index}`;
  assert(typeof tool.name === 'string' && tool.name.trim(), `${label} needs a name`);
  assert(typeof tool.description === 'string' && tool.description.trim(), `${label} needs a description`);
  assert(typeof tool.icon === 'string' && tool.icon.trim(), `${label} needs an icon`);
  assert(typeof tool.url === 'string' && tool.url.trim(), `${label} needs a URL`);

  const url = new URL(tool.url);
  assert(url.protocol === 'https:', `${tool.name} URL must use https`);
  assert(url.hostname === 'crusher-labs.github.io', `${tool.name} URL must stay under crusher-labs.github.io for simple public tools`);
  assert(url.pathname !== '/', `${tool.name} URL must include a repo path`);
  assert(!names.has(tool.name), `duplicate tool name: ${tool.name}`);
  assert(!urls.has(tool.url), `duplicate tool URL: ${tool.url}`);
  names.add(tool.name);
  urls.add(tool.url);
}

console.log(`[tools-hub] ${tools.length} tools validated`);
