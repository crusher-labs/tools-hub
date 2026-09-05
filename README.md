# Tools Hub

The static tools line for Muhammad Hassaan Javed: a directory site plus 37 single-purpose tools, all served from this one repo.

Live: <https://tools.muhammadhassaanjaved.com/> (each tool at `/<slug>/`)

## What this is

One GitHub Pages site. `index.html` is the searchable directory; every tool is a subdirectory with its own `index.html`. No backend, no build step beyond two generator scripts, nothing uploaded anywhere: every tool runs entirely in the visitor's browser.

Each tool is a **world page** (the 2026-09-02 design standard): the page is a committed object from that tool's own world, owning its CSS, fonts and mode. The hash generator is a fingerprint card, the JWT decoder is a passport, the epoch converter is a geological core sample. Only the hub itself still uses the shared `crusher-ui-kit` shell.

## The 2026-09-03 consolidation

The tools used to be 37 separate GitHub Pages sites under `crusher-labs.github.io/<repo>/`. Google had indexed **none** of them, nor the hub, in four months. Three causes, all now fixed:

1. The hub rendered its catalog client-side after fetching `tools.json`, so the HTML contained no `<a href>` to any tool. Crawlers found a page that linked nowhere.
2. `sitemap.xml` listed exactly one URL: the hub itself.
3. `github.io` is on the Public Suffix List, so the host cannot be verified in Google Search Console without DNS we do not control.

Consolidating onto a domain we own solved all three at once, and cost nothing because there was no traffic or link equity to lose. The 37 original repos keep their history and now serve redirect stubs carrying a canonical to the new URL.

## Commands

| Command | What |
| --- | --- |
| `npm run build` | regenerate the catalog + sitemap, then validate. **Run after any `tools.json` change** |
| `npm run check:static` | validate the static contract for the hub + all 37 tool pages |
| `npm run render:catalog` | rewrite the static catalog in `index.html` from `tools.json` |
| `npm run render:sitemap` | rebuild `sitemap.xml` from the pages on disk |
| `npm run preview` | serve on <http://127.0.0.1:8723/> |
| `npm run smoke` | after deploy, hit every URL in the sitemap |

CI runs `check:static` and fails if the generated files are stale.

## Adding a tool

1. Create `<slug>/index.html` (plus `README.md` and `AGENTS.md`) following the world-page contract.
2. Add the entry to `tools.json`.
3. `npm run build`.

Skipping step 3 leaves the tool with no crawlable link and absent from the sitemap, which is precisely how the first 37 stayed invisible.

## Branching

Work on `dev`; `main` is fast-forward only and is what Pages serves. This repo must stay **public**: the `crusher-labs` org is on the free plan, where Pages only serves public repositories.

## License

MIT.
