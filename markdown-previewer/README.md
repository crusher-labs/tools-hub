# Markdown Previewer

Write Markdown on a typescript manuscript (monospace on cream, editor's margin rule) and read it typeset live on a book page: running head from the first heading, folio, drop cap on the opening paragraph, and the page turns when the title changes. Own DOM-building renderer (no innerHTML): headings, lists with nesting, task lists, tables, fenced code, quotes, links, images, rules; raw HTML shown as text. Copy the HTML. Nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/markdown-previewer/>

## The world: Manuscript and book

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
