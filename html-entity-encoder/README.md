# HTML Entity Encoder/Decoder

Encode special characters to HTML entities and decode them back on a 1940s code badge: the brass dial turns to the last special character typed and the red enamel centre reads out its named, decimal and hex entity. Named / decimal / hex styles, the five unsafe characters or every symbol, decoding through the browser's own parser, and a searchable code book of every named entity the page knows. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/html-entity-encoder/>

## The world: Decoder ring

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
