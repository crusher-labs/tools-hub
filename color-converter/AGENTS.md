# AGENTS.md - Color Converter

Single-purpose static tool, built as a **world page**: color checker card. Convert colors between HEX, RGB, HSL, HSV and CMYK on the 24-patch Macbeth color rendition chart (the published sRGB values of the classic chart, clickable as a reference palette) with a loupe holding the color being edited, a lab sheet of every notation with per-format copy, a native picker, the nearest CSS named color, WCAG contrast on white and black with grades, and which text color reads on it. Nothing uploaded. Part of the crusher-labs static tools line. Hosted on GitHub Pages at https://tools.muhammadhassaanjaved.com/color-converter/

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
