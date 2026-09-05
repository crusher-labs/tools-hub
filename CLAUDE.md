@AGENTS.md

## Notes

- This repo IS the whole tools line since the 2026-09-03 consolidation: the hub plus all 37 tools as subdirectories, one Pages site at `tools.muhammadhassaanjaved.com`. Run `npm run build` before any commit touching tool HTML or `tools.json`.
- `crusher-ui-kit` is read-only here (request changes by appending to `x:/itxcrusher/INBOX.md`). Only the hub still loads the kit; the 37 tool pages are world pages that own their CSS.

## Compaction

Preserve: current task, files modified, failing `check:static`/`smoke`, decisions. Write durable state to the workspace `HANDOFF.md`.
