# AGENTS.md - tools-hub

The directory site for the crusher-labs static tools, live at `tools.muhammadhassaanjaved.com` (GitHub Pages). Part of the crusher-labs **static tools line** (frozen at 30). It also owns the shared validation scripts for the whole tools line.

Workspace rules: `x:\crusher-labs\AGENTS.md`. Global rules: `~/.claude/CLAUDE.md`.

## What it is

- A static site (`index.html`) that `fetch`es `tools.json` and renders a categorised, searchable catalog of the 30 tools. Consumes `crusher-ui-kit` via the jsDelivr CDN. No backend.
- Owns `scripts/check-static.mjs` (validates the static contract across the hub + all 30 tools via the `../utility-tools/<tool>` relative path) and `scripts/smoke.mjs` (live-URL smoke test). The 30 tools are grouped under `repos/utility-tools/` specifically to preserve that relative path.

## Commands

| Command | What |
| --- | --- |
| `npm run check:static` | validate the contract for hub + 30 tools (run before any commit touching tool HTML or `tools.json`) |
| `npm run preview` | Python http.server on `127.0.0.1:8723` (`file://` breaks the catalog `fetch`) |
| `npm run smoke` | hit every live URL post-deploy (HTTP 200, title, SEO block, framework pin, sitemap/robots) |

## Static contract

Every tool (and the hub) pins `crusher-ui-kit` via jsDelivr; `<html>` carries `data-default-theme="minimal" data-theme-lock="minimal" data-default-mode="dark" data-default-brand="#0ea5e9"`; `<body class="crusher-tool-page">`; one fixed `<crusher-style-switcher>`. No Tailwind CDN, no Font Awesome. Enforced by `check-static.mjs`.

## Adding / removing a tool (frozen)

Update `tools.json` + re-run `check:static`. The tools line is **frozen at 30** (strategy: `x:\crusher-labs\docs\context\strategy-analysis.md`); don't add without a strategy revisit.

## What NOT to do

- Don't commit to `main` directly (`dev` -> manual QA -> fast-forward `main`). No `Co-Authored-By` trailers.
- Don't edit `crusher-ui-kit`; request changes by appending to `x:/itxcrusher/INBOX.md` (the feedback-file pair was retired 2026-08-25).
- Don't break the `../utility-tools/<tool>` relative path that `check-static.mjs` depends on.
- Don't add Tailwind CDN / Font Awesome; use framework primitives.
