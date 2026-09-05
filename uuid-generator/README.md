# UUID/GUID Generator

Generate UUIDs from a red take-a-number dispenser under a NOW SERVING sign: pull the tab (or click the ticket) and it tears off with a fresh v4 (crypto random), v7 (millisecond time-ordered) or v1 (100 ns timestamp, random multicast node, clock sequence) identifier, or take up to a thousand at once into a pile with per-ticket copy, copy-all and a .txt download. Uppercase, no-hyphen and braces printing; a reader that tells the version, variant and embedded timestamp of any pasted UUID. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/uuid-generator/>

## The world: Take-a-number

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
