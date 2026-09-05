# Epoch/Human Date Converter

Convert Unix timestamps (seconds, milliseconds, microseconds or nanoseconds, detected by size or forced) to dates in any time zone and back, on a stratigraphic core log of computer time from the signed 32-bit floor of 1901 to the unsigned ceiling of 2106, oldest at the bottom, with the Epoch, Y2K and the 2038 overflow seam marked; a red marker drops to the entered moment. Outputs ISO 8601 in UTC and in the chosen zone, RFC 2822, local and zoned human dates, day of year and ISO week, relative time, with per-row copy, a Now button and a live clock. Zone arithmetic through Intl. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/epoch-converter/>

## The world: Strata

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
