# Sub-sprint 4e — Terroirs polish bundle — kickoff 2026-05-28

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — fifth sub-sprint, opened after Sub-sprint 4d (Cultivars polish) closed 2026-05-28 ([PR #288](https://github.com/chrismccann-dev/latent-coffee/pull/288), main `4a49184`).

## Why terroirs is next

Per Chris's lived-frequency ordering (audio 2026-05-26): green beans → roasters → brews are the top three (shipped 4a/4b/4c); cultivars / terroirs / processes are the aggregation surfaces after. 4d (cultivars) shipped as the lightest bundle of the series — Chris's read was that these aggregation pages are **reference/informational by nature**, so they need less work than the top-three surfaces. **Chris explicitly flagged at 4d close: "Terroirs is gonna be pretty similar for me here... probably gonna have a similar shape to this one."** Carry that prior in — expect a light bundle, possibly a single ratified change or "fine as-is," not a redesign.

`/terroirs` was last reworked in **Sub Pages 2 (2026-05-10)** — the three-job reorder (sourcing / brewing / archive reflection). It shares the same `SectionCard` + `<FlavorNotesByFamily>` + `<TagLinkList>` + synthesis-card + `<CollapsibleBlock>` substrate as cultivars.

## ⚠️ NOT a planned-execution sprint

Same rule as 4a-4d: **default mode = LISTEN, DO NOT EXECUTE.** The autonomy rule does NOT apply until Chris's Phase 1 audit + Claude's complementary pass + a bundled plan + ratified open decisions. Grilling-shaped session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).

**4c/4d lesson worth carrying in**: Chris's audit can reframe the sprint (4c → forward data-model design) or shrink it to one change (4d → single index-typography fix). Don't assume "polish" means a CSS sweep — listen for what the audit actually surfaces.

## Process — 3 phases, strictly sequential

### Phase 1 — Chris's page-by-page audit (Chris-driven)

**Pages to walk:**

1. **`/terroirs` (index)** — [app/(app)/terroirs/page.tsx](app/%28app%29/terroirs/page.tsx). Groups by Country → Macro Terroir, brew counts via `select('*, brews(id)')` FK join. **0-brew macro groups hidden** (Sub Pages 2). Newly auto-created terroirs from green-bean uploads appear once ≥1 brew references them. *Worth a specific look mirroring the 4d catch*: is the Country→Macro heading-weight hierarchy right, or inverted like cultivars' species/family was? (4d found species rendered smaller than family — check whether Country reads as the dominant tier above Macro here.)
2. **`/terroirs/[id]` (detail)** — Sub-Pages-2 vintage, 10 sections: (1) Hero (color swatch + title + country/admin_region breadcrumb + elevation/climate_stress), (2) High Level Summary (merged.context prose), (3) Meso Terroirs Explored (tag cluster), (4) Terroir Context (soil / cup_profile / why_it_stands_out), (5) Terroir Character (acidity / body / farming_model), (6) Typical Production (dominant_varieties + typical_processing), (7) What I've Learned (synthesis — the most load-bearing aggregation surface), (8) Coffees Brewed From This Region, (9) Additional Information (`<CollapsibleBlock>`: Flavor Notes + Cultivars + Processes + Roasters), (10) Confidence. **Note**: terroir detail aggregates all terroir rows sharing `macro_terroir + country` (merges context fields first-non-null / union meso / min-max elevation) — it is NOT single-row like cultivars.

**Walk a representative sample.** 121 canonical macros across 38 countries (registry); far fewer materialized as DB rows with brews. Walk at minimum: 1 well-populated macro (many brews — e.g. an Ethiopian or Colombian macro), 1 single-brew macro (synthesis-card gate — verify the LOW-confidence message), 1 sparse-context macro (empty-state field handling), 1 macro that aggregates multiple terroir rows (verify the merge logic reads coherently).

**For each surface, note:** info design · UX (front-and-center vs demote) · IA (section order vs the job) · noise · missing (any populated `terroirs` column not rendered? check `lib/types.ts Terroir`) · mobile.

**Open questions to surface (mirroring 4d's frame):**
1. Primary job on `/terroirs/[id]`? Sub Pages 2 locked three jobs (sourcing / brewing / archive reflection) with synthesis as "most load-bearing." Has lived practice confirmed that, or is it more purely informational like cultivars turned out to be?
2. Is the 10-section order still right, or has any section's weight shifted? (On cultivars, "What I've Learned" was confirmed most-referenced but stayed at §6 — does the terroir synthesis warrant its current §7, or move?)
3. Index Country→Macro hierarchy — heading-weight right, or inverted (the 4d catch)?
4. Mobile scope — full pass or spot-check? (Aggregation surfaces have been desktop-primary across 4b/4c/4d.)

**Handoff signal**: "OK that's my full audit pass." Do not advance until then.

### Phase 2 — Claude's complementary pass

Output: `docs/sprints/sub-sprint-4e-terroirs-polish-complementary-pass-<date>.md` (mirror of 4a-4d). Substrate cross-check: every populated `terroirs` column has a render path (query live population — 4d found `cultivar_notes` + `cultivar_confidence` populated-but-unrendered; check for the terroir analog, e.g. `meso`/`micro` free-text, `terroir_notes`, `terroir_confidence`, provenance fields). The merge logic across multiple terroir rows sharing macro+country (first-non-null / union / min-max) — does it drop any populated field? The `terroir_id` FK join + synthesis adapter ([lib/synthesis/adapters/terroir.ts](lib/synthesis/adapters/terroir.ts)) shape; the synthesis-card render gate; `TERROIR_MACRO_LOOKUP` canonical resolution. Render-gate audit mirroring the 4b `brewGuideLink` + 4c `Water:` + 4d species-weight catches.

### Phase 3 — Plan-mode bundled implementation

Enter plan mode. Present bundle structure, ratify, ship. Files likely to touch: `app/(app)/terroirs/page.tsx` + `[id]/page.tsx`, `lib/synthesis/adapters/terroir.ts` (if substrate-fold), `lib/types.ts` (if new field surfaces), `CLAUDE.md § Terroirs`, sprint-close housekeeping.

**Likely NOT in scope** (defer per Bucket G): schema migrations (unless a column is genuinely missing); MCP Tool surface (terroir resolution stable); synthesis prompt rewrites.

## Locked decisions from prior sprints (do NOT re-litigate)
1. ✓ Desktop is the primary design target (phone-scope = separate sub-sprints)
2. ✓ 3-phase sequencing (Chris audit → Claude complementary pass → plan-mode bundle)
3. ✓ Single PR per bundle
4. ✓ MCP-only writes (forms deprecated)
5. ✓ Six-actor audit before every PR

## ⚠️ Migration-apply gap (learned in 4c, avoided in 4d)
If a bundle adds a DB column, apply the migration to Supabase BEFORE merge — the worktree has no DDL path (only PostgREST). 4d had no DB dependency and merged clean; aim for the same. If a column is genuinely needed, ship code on a branch + hand Chris the one-line migration + merge after `check-migrations` goes green.

## Reference
- [Sub-sprint 4d kickoff](sub-sprint-4d-cultivars-polish-kickoff-2026-05-28.md) + [complementary pass](sub-sprint-4d-cultivars-polish-complementary-pass-2026-05-28.md) — most recent precedent (the "informational surface → light bundle" + intentionally-internal-columns lessons)
- [Sub-sprint 4c kickoff](sub-sprint-4c-brews-polish-kickoff-2026-05-28.md) + [complementary pass](sub-sprint-4c-brews-polish-complementary-pass-2026-05-28.md) — the data-model-reframe + migration-gap lessons
- [PRODUCT.md § Active Sprints #4](../../PRODUCT.md) — series-level scope
- [CLAUDE.md § Terroirs](../../CLAUDE.md) — post-Sub-Pages-2 detail-page shape
