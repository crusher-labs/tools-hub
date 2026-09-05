# Color Converter

Convert colors between HEX, RGB, HSL, HSV and CMYK on the 24-patch Macbeth color rendition chart (the published sRGB values of the classic chart, clickable as a reference palette) with a loupe holding the color being edited, a lab sheet of every notation with per-format copy, a native picker, the nearest CSS named color, WCAG contrast on white and black with grades, and which text color reads on it. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/color-converter/>

## The world: Color checker card

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
