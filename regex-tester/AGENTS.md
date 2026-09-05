# AGENTS.md - Regex Tester

Single-purpose static tool, built as a **world page**: radar. Test a JavaScript regular expression against your text on a radar scope: every match is a contact that paints bright as the four-second sweep passes its bearing (its position in the text) and fades on the phosphor; the console highlights matches, lists every capture and named group, toggles flags, accepts /pattern/flags, previews a replace, and drops to NO SIGNAL on an invalid pattern. Quick-reference signal codes included. Nothing uploaded. Part of the crusher-labs static tools line. Hosted on GitHub Pages at https://tools.muhammadhassaanjaved.com/regex-tester/

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
