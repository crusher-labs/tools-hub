# Video to Audio Converter

Extract the audio track from a video (MP4, WebM, MOV and any file the browser can decode) as MP3 or lossless WAV on a reel-to-reel dubbing deck: the supply reel empties into the take-up reel with the real progress of the encode, two VU meters follow the real signal level, the tape counter runs, and the finished tape carries a player and a download. Decoding by Web Audio decodeAudioData; MP3 by the vendored lamejs (LGPL, kept unmodified beside its licence) at 96 to 320 kbps; no ffmpeg, no service worker, nothing uploaded.

Live: <https://tools.muhammadhassaanjaved.com/video-to-audio-converter/>

## The world: Dubbing deck

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
