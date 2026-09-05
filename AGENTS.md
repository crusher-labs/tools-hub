# AGENTS.md - tools-hub

The **entire static tools line**: the directory site at `tools.muhammadhassaanjaved.com` plus all 37 tools, each a subdirectory served at `/<slug>/`. One GitHub Pages site, one host, one sitemap. It also owns the validation and generator scripts.

Consolidated on 2026-09-03. Before that the tools were 37 separate Pages sites on `crusher-labs.github.io`; Google had indexed **zero** of them in four months because (a) the hub built its cards client-side so the HTML had no crawlable links, (b) the sitemap listed only the hub, and (c) `github.io` is on the Public Suffix List so the host cannot be verified in Search Console. Those repos now serve redirect stubs.

Workspace rules: `x:\crusher-labs\AGENTS.md`. Global rules: `~/.claude/CLAUDE.md`.

## What it is

- A static site. `index.html` carries the catalog as **static HTML** (generated from `tools.json` by `scripts/render-catalog.mjs`); its script only indexes that DOM for search. It must never fetch `tools.json` at runtime again - that is what made the tools invisible to Google, and `check-static.mjs` now fails if the fetch comes back.
- Each tool is a subdirectory with its own `index.html` (a world page owning its CSS, fonts and mode) plus `README.md` and `AGENTS.md`. Only the hub still pins `crusher-ui-kit` via jsDelivr.
- Owns `scripts/render-catalog.mjs`, `scripts/render-sitemap.mjs`, `scripts/check-static.mjs` and `scripts/smoke.mjs`. There is one `robots.txt` and one `sitemap.xml`, at the repo root, because there is one host.

## Commands

| Command | What |
| --- | --- |
| `npm run build` | **run this after any `tools.json` change**: regenerates the catalog + sitemap, then validates. CI fails if these are stale |
| `npm run check:static` | validate the contract for hub + 37 tool pages |
| `npm run render:catalog` | rewrite the static catalog in `index.html` from `tools.json` |
| `npm run render:sitemap` | rebuild `sitemap.xml` from the pages on disk |
| `npm run preview` | http.server on `127.0.0.1:8723` |
| `npm run smoke` | hit every URL in the sitemap post-deploy |

## Static contract

Two contracts, both enforced by `check-static.mjs`, picked by whether `<html>` carries `data-world`:

- **World pages** (all 37 tools, the 2026-09-02 standard). The page is a committed object from the tool's own world and owns its CSS, fonts and mode. It must NOT load `crusher-ui-kit` and has no style switcher. It must carry: the viewport meta, the SEO-META block (description, theme-color, canonical, og), a non-empty title, a favicon, a CSP meta, the Web3Forms feedback form with its honeypot, a link back to the hub, an `<h1>`, and an `<h2>` + `<details>` FAQ section.
- **The hub** (`index.html` only). Still the kit shell: pins `crusher-ui-kit` via jsDelivr with SRI, `<html>` carries `data-default-theme="minimal" data-theme-lock="minimal" data-default-mode="dark" data-default-brand="#0ea5e9"`, `<body class="crusher-tool-page">`, one fixed `<crusher-style-switcher>`. Plus: a static `<a href>` for every entry in `tools.json`, and no runtime `fetch` of the catalog.

No Tailwind CDN, no Font Awesome, anywhere.

## Adding / removing a tool

Add the directory with its `index.html`, add the entry to `tools.json`, then `npm run build` (this regenerates the catalog links and the sitemap; skipping it means the tool has no crawlable link and is absent from the sitemap, which is exactly how the first 37 stayed unindexed).

## What NOT to do

- Don't commit to `main` directly (`dev` -> manual QA -> fast-forward `main`). No `Co-Authored-By` trailers.
- Don't edit `crusher-ui-kit`; request changes by appending to `x:/itxcrusher/INBOX.md` (the feedback-file pair was retired 2026-08-25).
- Don't make the catalog dynamic again, and don't hand-edit the block between the `CATALOG-START`/`CATALOG-END` markers - regenerate it.
- Don't add per-tool `robots.txt` or `sitemap.xml`; those are per-host and live at the repo root.
- Don't add Tailwind CDN / Font Awesome; use framework primitives.
