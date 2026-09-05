# AGENTS.md - UUID/GUID Generator

Single-purpose static tool, built as a **world page**: take-a-number. Generate UUIDs from a red take-a-number dispenser under a NOW SERVING sign: pull the tab (or click the ticket) and it tears off with a fresh v4 (crypto random), v7 (millisecond time-ordered) or v1 (100 ns timestamp, random multicast node, clock sequence) identifier, or take up to a thousand at once into a pile with per-ticket copy, copy-all and a .txt download. Uppercase, no-hyphen and braces printing; a reader that tells the version, variant and embedded timestamp of any pasted UUID. Nothing uploaded. Part of the crusher-labs static tools line. Hosted on GitHub Pages at https://tools.muhammadhassaanjaved.com/uuid-generator/

Workspace rules: `x:\crusher-labs\AGENTS.md`. Global rules: `~/.claude/CLAUDE.md`. Design standard: `x:\crusher-labs\docs\design-language.md` (tools section) and the atlas `x:\crusher-labs\docs\context\tools-theme-atlas.md`.

## What it is

- One `index.html`, no build step, no backend, fully client-side.
- Owns its CSS, fonts (Google Fonts) and mode. Does NOT load `crusher-ui-kit`; has no style switcher. `<html data-world="...">` marks it for the world-page contract.

## Contract (must hold)

- SEO-META block, CSP meta (fonts.googleapis/gstatic + api.web3forms only, plus any host the tool genuinely needs), favicon, canonical, OG tags, `<h1>`, prose section with `<h2>` + `<details>` FAQ, the Web3Forms feedback form with honeypot, a link to https://tools.muhammadhassaanjaved.com/.
- Validated by `tools-hub/scripts/check-static.mjs` (run `npm run check:static` from `repos/tools-hub`).

## What NOT to do

- Don't add the kit pins or the style switcher back; a world has a mode.
- Don't restyle it toward the old dark shell. The object is the design.
- Don't commit to `main` directly (`dev` -> QA at 1440 + 390 -> fast-forward `main`). No `Co-Authored-By` / AI-attribution trailers.
- Don't add Tailwind CDN / Font Awesome.
