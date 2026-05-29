# Sub-sprint 4d — Cultivars polish — Claude's complementary pass — 2026-05-28

Mirror of the 4a/4b/4c complementary-pass docs. Phase 2 of the 3-phase grilling sequence (Chris audit → Claude complementary pass → plan-mode bundle). Records the substrate cross-check + render-gate audit + categorization that fed the ratified bundle.

## Method

- Read [app/(app)/cultivars/page.tsx](../../app/%28app%29/cultivars/page.tsx) (index) + [app/(app)/cultivars/[id]/page.tsx](../../app/%28app%29/cultivars/%5Bid%5D/page.tsx) (detail).
- Cross-checked all 27 `Cultivar` columns in [lib/types.ts](../../lib/types.ts) against detail-page render paths.
- Queried live population of the candidate-unrendered columns against the DB (32 materialized cultivar rows — the other ~31 of the 63 registry canonicals have no brew reference yet, so no row exists; expected event-driven materialization, not a gap).
- Render-gate spot-check mirroring the 4b `brewGuideLink` false-negative + 4c `Water:` label-collision catches.

## Substrate cross-check: `Cultivar` columns → render paths

**All reference fields render correctly.** No false-negative render gates. The ≥2-brew synthesis gate + LOW-confidence "1 coffee explored" message both read right on a single-brew cultivar.

| Column | Populated (of 32) | Render path |
|---|---|---|
| species / genetic_family / lineage / cultivar_name | — | hero breadcrumb + index spine ✓ |
| genetic_background | 28 | GENETIC BACKGROUND ✓ |
| typical_origins / altitude_sensitivity / limiting_factors / market_context | — | CULTIVAR CONTEXT ✓ |
| common_processing_methods / typical_flavor_notes / acidity_style / body_style / aromatics / terroir_transparency / extraction_sensitivity / brewing_tendencies | — | BREWING & CUP PROFILE ✓ |
| roast_tolerance / roast_behavior / resting_behavior / common_pitfalls | — | ROASTING CHARACTERISTICS ✓ |
| synthesis / synthesis_brew_count / short_form_capsule / synthesis_input_max_updated_at | — | SynthesisCard (≥2-brew gate) ✓ |
| **cultivar_notes** | **28** | **none — UNRENDERED** |
| **cultivar_confidence** | 26 (`high`/`medium`) | **none — UNRENDERED** |
| cultivar_source | 26 (`roaster`) | none — provenance metadata, correctly internal |
| cultivar_raw | 7 | none — raw input string, correctly internal |
| id / user_id / created_at / updated_at | — | infra |

### The two real gaps — both resolved as "leave internal"

- **`cultivar_notes` (28/32 populated).** Reads as **normalization/authoring guidance** ("treat as a field blend; do not separate into component cultivars," "treat as named cultivar with uncertain genetics") with occasional corpus context. **Chris's call: leave internal** — it's behind-the-scenes canonicalization guidance, not user-facing reference. Documented here so the field's existence is known for a future redesign.
- **`cultivar_confidence` (26/32, `high`/`medium`).** This is the **registry's genetic-classification confidence**, semantically distinct from the page's brew-count Confidence card. Surfacing both on one page would read as two competing "confidence" signals. **Chris's call: leave internal.**

## Categorization

- **Bucket A (ratified — ship):** Index species-heading weight. Currently *inverted* — species renders at `text-xxs` (10.4px, muted) while family renders at `text-xs` (11.5px, bold dark + swatch), so the top-of-spine level is visually quieter than the level beneath it. Chris flagged this forward-looking: every cultivar today is Arabica, but Liberica + Eugenioides roasted lots are coming, and species should read as the dominant tier. Fix: bump species above family in size + darken.
- **Bucket B (resolved — no action):** "What I've Learned" synthesis position. Chris confirmed it's the most-referenced block, but it reads naturally at section 6 and is long enough that leading with it would push the quick-reference registry blocks down. **Decision: leave at section 6 for now.** `short_form_capsule` (already in substrate, rendered on mobile, unused on desktop) noted as the lever for a future bigger redesign — do not touch now.
- **Bucket G (out of scope / internal):** `cultivar_notes` + `cultivar_confidence` left internal (above). No schema migration, no MCP/Tool change, no synthesis-prompt rewrite.

## Six-actor audit

The only shipped change is index typography (Actor 6 / UI render). No new field, Tool, column, vocabulary, or count delta — nothing propagates beyond the index page. Actors 1-5 unaffected. CLAUDE.md § Cultivars index description gets the heading-weight note; PRODUCT.md + shipped.md get the sprint-close row.

## Bundle shape

Single PR, no DB dependency (no migration-apply gap — contrast 4c). Touches `app/(app)/cultivars/page.tsx` + `CLAUDE.md` + `PRODUCT.md` + `docs/sprints/shipped.md`.
