# JSON to YAML/CSV Converter

Convert between JSON, YAML and CSV in any direction on a three-part carbonless form set: JSON on the white original, YAML on the canary copy, CSV on the pink one; write on any sheet and the other two are re-pressed as you type, a sheet that fails to parse is stamped VOID, and tearing a copy off puts it on the clipboard. Own YAML subset parser (maps, lists, quoted and block scalars, simple flow collections), RFC 4180 CSV with delimiter detection, nested data flattened to dotted columns. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/json-yaml-csv-converter/>

## The world: Carbonless form

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
