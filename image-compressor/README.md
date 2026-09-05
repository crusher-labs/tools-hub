# Image Compressor

Compress an image in the browser on a self-service bag drop: the image is the bag on the belt, a seven-segment scale counts its size in KB down as the quality changes, an allowance in KB turns the lamp green or red (OVERWEIGHT), Fit to allowance searches for the best quality under the limit (stepping the longest side down if it must), and check-in downloads the result with a printed tag of size, dimensions, format and saving. JPEG, WebP or lossless PNG resize. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/image-compressor/>

## The world: Baggage drop

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
