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
- Current catalog has 30 tools and is validated by `npm run check:static`.
- Each simple tool should stay independently hosted under `https://crusher-labs.github.io/<repo>/` unless it grows enough to justify a separate domain or hosting stack.
- Use the latest published `crusher-ui-kit` package/static contract for public tools. Do not depend on unpublished local framework dev work here.
- Static framework paths should use published assets only. For `crusher-ui-kit@0.1.1`, core CSS/JS are available under `dist/`, but theme CSS is currently available under `src/css/themes/<theme>.css`.
- Move tools from `src/css/themes/<theme>.css` to `dist/themes/<theme>.css` after a published UI kit release exposes those files on the CDN.
- GitHub Pages deployment is expected from each tool repo's `main` branch after QA.

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

## Crusher UI Kit Suggestions

- Add a published static bundle for all dialect theme CSS, for example `dist/themes/all.css`, so no-build tools do not need seven repeated theme links.
- Ensure the next package publish includes `dist/themes/*.css` and `dist/static/tool-shell.css`; `crusher-ui-kit@0.1.1` does not expose those CDN paths even though the local build contains them.
- Keep `dist/static/tool-shell.css` as the recommended starting point for utility pages and expand it with common two-panel, textarea, action-row, result-card, and floating hub-link patterns.
- Consider adding a tiny static runtime helper for tool pages that syncs `data-mode`, the old Tailwind `dark` class, saved theme state, and `<crusher-style-switcher>` events.
- Document one canonical CDN snippet pinned to a concrete version for public tools, then update tools only after that package version is published.
- Avoid requiring public tools to deep-link into `src/`; all static consumers should stay on published `dist/` artifacts.
