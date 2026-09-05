# Word Frequency Counter

Count how often each word appears in a text on a library card-catalog drawer: every distinct word is a 3 x 5 card with its count, share and a typed frequency bar, filed in rank order on the brass rod behind Top 10 and The rest guide cards, riffling into place as you type. Ignore case, drop common words, minimum length, top 25 / 50 / 100 / all, lexical density, copy as CSV or list. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/word-frequency-counter/>

## The world: Card catalog

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
