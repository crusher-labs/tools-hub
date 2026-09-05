# Hash Generator

Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 and CRC-32 for text or a file on an FD-258-style fingerprint card: six impression boxes, each with the hash and a ridge pattern drawn from its bytes that rolls in as you type; uppercase and Base64 forms, per-hash copy, and a verify line that names the algorithm a pasted hash matches and thumps a MATCH stamp. SHA via Web Crypto; MD5 and CRC-32 implemented on the page (the old cdnjs crypto-js is gone). Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/hash-generator/>

## The world: Fingerprint card

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
