# AGENTS.md - JSON to YAML/CSV Converter

Single-purpose static tool, built as a **world page**: carbonless form. Convert between JSON, YAML and CSV in any direction on a three-part carbonless form set: JSON on the white original, YAML on the canary copy, CSV on the pink one; write on any sheet and the other two are re-pressed as you type, a sheet that fails to parse is stamped VOID, and tearing a copy off puts it on the clipboard. Own YAML subset parser (maps, lists, quoted and block scalars, simple flow collections), RFC 4180 CSV with delimiter detection, nested data flattened to dotted columns. Nothing uploaded. Part of the crusher-labs static tools line. Hosted on GitHub Pages at https://tools.muhammadhassaanjaved.com/json-yaml-csv-converter/

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
