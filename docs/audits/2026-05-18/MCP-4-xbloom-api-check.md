# MCP-4 — xBloom API existence check

**Source**: [grilling-2026-05-15-mcp-followups.md item #4](docs/sprints/grilling-2026-05-15-mcp-followups.md)
**Sprint**: T5 (2026-05-18)
**Time budget**: 30 min lookup
**Decision**: **No public xBloom API exists today. Close the open question.**

## Question

Per round 10 of the 2026-05-15 MCP grilling, Chris flagged not knowing whether the xBloom machine exposes an API. Low priority (xBloom runs one fixed reference-cup recipe; even if an API exists, integration value is low). But worth a 30-minute investigation to retire the open question.

## Search trail

1. **`xBloom coffee brewer API developer documentation public`** — 10 results. Surfaces consumer product pages (xbloom.com), the two mobile apps (Google Play / Apple App Store), reviews, and one community recipe site (`xbloom-app.vercel.app`). No official developer docs, no GitHub organization, no API mention.
2. **`xBloom Studio app brew log export integration HTTP`** — 10 results. Surfaces the same product / app / FAQ pages. The official app description mentions "enhanced WiFi and Bluetooth capabilities that streamline network setup" and "share and manage their favorite brew recipes" — both consumer-facing features. Nothing exposes an HTTP surface for log export or external integration.
3. **WebFetch on `xbloom-app.vercel.app`** (community xRecipe site) — page does not disclose its data source. Cannot confirm whether xRecipe consumes an official API or whether the community submits recipes directly. The site is third-party (Vercel-hosted, not on xbloom.com domain).

## Negative result

No publicly documented xBloom API exists as of 2026-05-18. Three corroborating signals:

- No `developers.xbloom.com` / `api.xbloom.com` / `xbloom.com/developers` subdomain or docs path surfaces.
- No public GitHub organization under `xbloom` ownership.
- Official product copy describes Wi-Fi / Bluetooth as recipe-sharing transport, not an integration surface.

The community xRecipe app (`xbloom-app.vercel.app`) appears to be a community submission catalog rather than an official-API consumer; the site's lack of attribution to an xBloom API is consistent with that.

## Operational implication for Latent

**No parity-with-Roest pull integration is buildable today.** The xBloom machine's role in Latent's pipeline is the **reference cup evaluation gate** (Day-7 fixed-recipe pour-over). Per CONTEXT.md, the xBloom evaluation cup is one of the three load-bearing roast-evaluation surfaces. The single-recipe-per-bean shape limits the value of automated pull anyway:

- xBloom does NOT carry recipe variation worth structured pulling (one fixed recipe per session).
- xBloom does NOT carry the optimized-brew tasting data Chris actually uses for evaluation — that lives in claude.ai conversation + brews rows.
- xBloom DOES execute precise recipe state (water temp curve, pour profile) but Chris has not flagged a need to capture this beyond the existing free-text `cooling_curve_target` + `temperature_evolution` columns on `brews`.

Even if xBloom opens a public API in the future, the integration would only meaningfully unlock structured per-pour parameter capture for the reference cupping — a marginal substrate enrichment, not a major Roest-parity moment.

## Re-test trigger

Re-run this check IF either of the following lands:

1. **xBloom publishes developer docs.** Search `developers.xbloom.com` / xbloom.com developer announcements every ~6 months OR if a community signal (Reddit, specialty coffee forum) flags an API drop.
2. **Chris adds a 2nd brewer with a known public API into the reference-cup evaluation pipeline.** The "structured per-pour capture would be valuable" hypothesis becomes operational at that point.

Neither trigger is active today. Open question retired.

## Out of scope for T5

- Any scoping work on a hypothetical xBloom integration (no API to scope against).
- Updates to the reference-cup evaluation protocol in ROASTING.md / CONTEXT.md (the xBloom-as-eval-gate decision predates this audit and is unaffected by the negative result).

## Sources

- [xBloom product home](https://xbloom.com/)
- [xBloom Studio product page](https://xbloom.com/products/xbloom-studio)
- [xBloom Coffee app on Google Play](https://play.google.com/store/apps/details?id=com.xbloom.tbdx)
- [xBloom Coffee app on App Store](https://apps.apple.com/us/app/xbloom-coffee/id6473127142)
- [xRecipe community app (third-party)](https://xbloom-app.vercel.app/)
