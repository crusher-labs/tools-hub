# Tools Hub

Tools and products hub for Muhammad Hassaan Javed. Directory and routing surface for independent tools, projects, and SaaS.

Live: https://tools.muhammadhassaanjaved.com/

## Continuation State

Updated: 2026-05-03

This repo belongs to the broader Hassaan/Crusher ecosystem, but it is intentionally simpler than `hassaan-site`, `crusher-portfolio`, and `crusher-ui-kit`.

Current contract:
- Public static site hosted by GitHub Pages.
- Custom domain: `tools.muhammadhassaanjaved.com`.
- Tool catalog lives in `tools.json`.
- Each simple tool should stay independently hosted under `https://crusher-labs.github.io/<repo>/` unless it grows enough to justify a separate domain or hosting stack.
- Use the latest published `crusher-ui-kit` package/static contract for public tools. Do not depend on unpublished local framework dev work here.

Workflow:
- Active branch: `dev`.
- Keep this hub public while tools are simple/static.
- Do not merge `dev` to `main` until the current UI/catalog changes are manually checked.
- Run `npm run check:static` before committing catalog or static contract changes.
- If a tool becomes heavy, private, backend-dependent, or commercially sensitive, move it to a more appropriate private repo/hosting path instead of forcing it into this static hub.

Next steps:
1. Keep `tools.json` accurate as tools are added or renamed.
2. Make sure each listed tool link resolves before promoting changes.
3. Keep this hub as a directory/wrapper, not the implementation repo for every tool.
