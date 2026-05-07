# Tools Hub

Tools and products hub for Muhammad Hassaan Javed. Directory and routing surface for independent tools, projects, and SaaS.

Live: https://tools.muhammadhassaanjaved.com/

## Continuation State

Updated: 2026-05-07

This repo belongs to the broader Hassaan/Crusher ecosystem, but it is intentionally simpler than `hassaan-site`, `crusher-portfolio`, and `crusher-ui-kit`.

Current contract:
- Public static site hosted by GitHub Pages.
- Custom domain: `tools.muhammadhassaanjaved.com`.
- Tool catalog lives in `tools.json`.
- Current catalog has 11 deployed tools and is validated by `npm run check:static`.
- Each simple tool should stay independently hosted under `https://crusher-labs.github.io/<repo>/` unless it grows enough to justify a separate domain or hosting stack.
- Use the latest published `crusher-ui-kit` package/static contract for public tools. Do not depend on unpublished local framework dev work here.
- Static framework paths should use published `dist/` assets, including `dist/crusher-ui.min.css`, `dist/crusher-ui.standalone.esm.js`, and `dist/themes/<theme>.css`.
- Do not deep-link `crusher-ui-kit/src/...` files from tools. Static tools should consume only published package assets.
- Several local utility folders exist but are not listed here yet because their GitHub Pages URLs currently return 404.

Workflow:
- Active branch: `dev`.
- Keep this hub public while tools are simple/static.
- Do not merge `dev` to `main` until the current UI/catalog changes are manually checked.
- Run `npm run check:static` before committing catalog or static contract changes.
- CI runs the same static contract check on GitHub Actions.
- If a tool becomes heavy, private, backend-dependent, or commercially sensitive, move it to a more appropriate private repo/hosting path instead of forcing it into this static hub.

Next steps:
1. Keep `tools.json` accurate as tools are added or renamed.
2. Make sure each listed tool link resolves before promoting changes.
3. Add `aspect-ratio-calculator` only after it has an `index.html`.
4. Add the pending local utility tools after their repos/pages are published.
5. Keep this hub as a directory/wrapper, not the implementation repo for every tool.

Pending tools to add to `tools.json` after their GitHub Pages URLs resolve:
- `aspect-ratio-calculator`
- `base64-encoder`
- `binary-converter`
- `color-palette-generator`
- `css-box-shadow-generator`
- `diff-checker`
- `epoch-converter`
- `hash-generator`
- `html-entity-encoder`
- `image-compressor`
- `json-prettifier`
- `json-yaml-csv-converter`
- `jwt-decoder`
- `lorem-ipsum-generator`
- `morse-code-converter`
- `regex-tester`
- `url-encoder-decoder`
- `uuid-generator`
- `word-frequency-counter`

## Branching and QA Policy

- Every tool repo and `tools-hub` should keep both `main` and `dev`.
- All implementation work lands on `dev`.
- `main` is reserved for manually QA-approved releases.
- After manual QA, merge `dev` into `main` and publish from `main`.
- For new tool repos, keep the initial `main` baseline minimal, then push actual tool files to `dev`.

## Crusher UI Kit Suggestions

- Add a published static bundle for all dialect theme CSS, for example `dist/themes/all.css`, so no-build tools do not need seven repeated theme links.
- Keep `dist/static/tool-shell.css` as the recommended starting point for utility pages and expand it with common two-panel, textarea, action-row, result-card, and floating hub-link patterns.
- Consider adding a tiny static runtime helper for tool pages that syncs `data-mode`, the old Tailwind `dark` class, saved theme state, and `<crusher-style-switcher>` events.
- Document one canonical CDN snippet pinned to a concrete version for public tools, then update tools only after that package version is published.
- Avoid requiring public tools to deep-link into `src/`; all static consumers should stay on published `dist/` artifacts.
