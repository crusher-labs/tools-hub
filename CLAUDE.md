@AGENTS.md

## Notes

- The hub + the shared `check-static.mjs` / `smoke.mjs` scripts for the whole static tools line live here. Run `npm run check:static` before any commit touching tool HTML or `tools.json`.
- `crusher-ui-kit` is read-only here (request changes by appending to `x:/itxcrusher/INBOX.md` (the feedback-file pair was retired 2026-08-25)). Tools line is frozen at 30.

## Compaction

Preserve: current task, files modified, failing `check:static`/`smoke`, decisions. Write durable state to the workspace `HANDOFF.md`.
