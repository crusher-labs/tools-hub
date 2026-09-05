# JWT Decoder

Decode and inspect a JSON Web Token as a passport: the data page prints alg, jti, holder, issuer, audience, issue, not-before and expiry with local dates and relative times, a machine-readable strip is built from the claims, and the expiry (and not-yet-valid, unsigned) stamps thump down on the facing page with the remaining claims listed under them. Signature verification through Web Crypto: HS256/384/512 with a shared secret, RS/PS/ES with a PEM or JWK public key; a sample token is minted in the browser on load so the verified stamp can be seen. Nothing leaves the browser.

Live: <https://tools.muhammadhassaanjaved.com/jwt-decoder/>

## The world: Passport control

This tool is a **world page** (crusher-labs standard since 2026-09-02): the page is a committed physical object from the tool's own world, with its own CSS, fonts and mode. It does not load `crusher-ui-kit` and has no theme switcher. The brief for this world lives in the workspace atlas (`x:/crusher-labs/docs/context/tools-theme-atlas.md`); change the atlas before changing the world.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for Google Fonts; your inputs and outputs never leave the tab. The "Suggest an improvement" form posts to Web3Forms only when you submit it.

## Contract

Validated by `tools-hub/scripts/check-static.mjs` (world-page contract: SEO block, CSP, feedback form, hub link, prose + FAQ, no kit pins). Run `npm run check:static` from `repos/tools-hub` before committing.

## Development

Open `index.html` directly in a browser. No build, no dependencies. Verify at 1440 and 390 via Playwright `setViewportSize` before shipping.

## License

MIT.
