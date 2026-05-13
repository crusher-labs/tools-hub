# Tools Hub

Tools and products hub for Muhammad Hassaan Javed. Directory and routing surface for independent tools, projects, and SaaS.

Live: https://tools.muhammadhassaanjaved.com/

## Continuation State

Updated: 2026-05-13

This repo belongs to the broader Hassaan/Crusher ecosystem, but it is intentionally simpler than `hassaan-site`, `crusher-portfolio`, and `crusher-ui-kit`.

Current contract:
- Public static site hosted by GitHub Pages.
- Custom domain: `tools.muhammadhassaanjaved.com`.
- Tool catalog lives in `tools.json`.
- Current catalog has 30 tools and is validated by `npm run check:static`. The same script also audits every `utility-tools/<tool>/index.html` against the same static contract when run from a workspace checkout.
- Each simple tool should stay independently hosted under `https://crusher-labs.github.io/<repo>/` unless it grows enough to justify a separate domain or hosting stack.
- Use the latest published `crusher-ui-kit` package/static contract for public tools. Do not depend on unpublished local framework dev work here.
- Static framework paths must use the published `crusher-ui-kit@0.1.6` `dist/` assets: `dist/crusher-ui.min.css`, `dist/themes/minimal.css`, `dist/static/tool-shell.css`, `dist/static/tool-shell.js`, and `dist/crusher-ui.standalone.esm.js`.
- Public tools and the hub are pinned to the `minimal` dialect via `<html data-theme-lock="minimal">` and use `<crusher-style-switcher default-theme="minimal" default-brand="#0ea5e9" hide-themes hide-theme-color>` for brand-color and light/dark controls. The framework's `tool-shell.js` owns pre-paint hydration; tools must not ship the legacy inline `crusher-minimal-mode-lock` IIFE, `#theme-toggle` button, or the `crusher-tools-framework-bridge` Tailwind override block.
- Chrome (page wrap, header, sections, inputs, buttons, FAB) uses the `crusher-tool-*` primitives shipped in `dist/static/tool-shell.css`. Tools must not load the Tailwind CDN for chrome styling.
- Do not deep-link `crusher-ui-kit/src/...` files from tools.
- GitHub Pages deployment is expected from each tool repo's `main` branch after manual QA.

Workflow:
- Active branch: `dev`.
- Keep this hub public while tools are simple/static.
- Do not merge `dev` to `main` until the current UI/catalog changes are checked.
- Run `npm run check:static` before committing catalog or static contract changes.
- CI runs the same static contract check on GitHub Actions.
- If a tool becomes heavy, private, backend-dependent, or commercially sensitive, move it to a more appropriate private repo/hosting path instead of forcing it into this static hub.

Next steps:
1. Keep `tools.json` accurate as tools are added or renamed.
2. Make sure each listed tool link resolves before promoting changes.
3. Keep this hub as a directory/wrapper, not the implementation repo for every tool.

## Branching and QA Policy

- Every tool repo and `tools-hub` should keep both `main` and `dev`.
- All implementation work lands on `dev`.
- `main` is reserved for manually QA-approved releases.
- After manual QA, merge `dev` into `main` and publish from `main`.
- For new tool repos, keep the initial `main` baseline minimal, then push actual tool files to `dev`.
