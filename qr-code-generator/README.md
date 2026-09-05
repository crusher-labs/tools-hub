# QR Code Generator

Generate a QR code for a URL, text, Wi-Fi network (WIFI: format), email, phone number or SMS on an airline boarding pass: the code prints where the barcode goes, the facts about it (version as the flight, error-correction level as the gate, module count as the seat, byte count as boarding) print beside it, and the stub tears off to download PNG or SVG. Error correction L/M/Q/H, size, quiet zone and colours. Encoding by the vendored MIT qrcode-generator (qrcode.js, Kazuhiko Arase), drawn as SVG and canvas here. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/qr-code-generator/>

## The world: Boarding pass

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
