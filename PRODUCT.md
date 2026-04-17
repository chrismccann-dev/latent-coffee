# Latent Coffee Research — Product Document

*Last updated: April 2026 (post-PR #10 / #11 / #12)*

---

## What This Is

Latent Coffee Research is a personal coffee research journal that compounds brewing and roasting knowledge over time. It is an **archival tool**, not an iteration workspace. The app stores the final, optimized expression of each coffee — the best brew recipe, the sensory profile at peak, and the learnings that came from getting there.

The iteration work — the 5-10 brew attempts to dial in a recipe, the A/B roast experiments, the cupping comparisons — happens in Claude projects and spreadsheets. This app is where the conclusions land.

The goal is two things:

1. **Training for world brewer's cup level mastery** — building a deep, structured understanding of how cultivars, terroirs, processes, and extraction strategies interact to create the best possible cup expression.
2. **Compounding a knowledge base** — so that when a new green bean or roasted coffee arrives, there's a solid foundation of prior learnings to start from instead of starting from scratch every time.

---

## Who It's For

Chris McCann. Single user. The app uses Supabase Auth with Row Level Security, but there is one user and no plans for multi-tenancy.

---

## Core Workflows

There are two parallel paths that both end in the same archive:

### Path 1: Purchased (Roasted) Beans — 52 of 56 brews

```
Buy specialty coffee
    → Use Claude project + Brewing Master Reference to iterate brew recipes
    → Find best brew expression
    → Archive in app: recipe, sensory notes, terroir, cultivar, extraction strategy, what I learned
```

The Brewing Master Reference (a living document) drives the iteration. It contains:
- A structured **brew prompt** that Claude uses to design recipes (Coffee Brief → Strategy Confirmation → Recipe → Iteration Loop)
- Three **extraction strategies**: Clarity-First (default, low extraction), Balanced Intensity (moderate push), Full Expression (high extraction for dense/anaerobic coffees)
- **Roaster reference cards** with house style tags per roaster
- **Archive patterns** — strategy-level learnings organized by process, variety, and cooling behavior

The app does NOT store iterations. Only the final best brew.

### Path 2: Self-Roasted (Green Beans) — 4 of 56 brews

```
Source green beans (importers, farm direct)
    → Roast in sets of 3 as experiments (vary one variable per set)
    → Cup each roast, record results
    → Iterate until best roast candidate found
    → Treat best roast like a purchased bean → optimize brew recipe
    → Archive everything: green bean data, all roast logs, experiments, cuppings, roast learnings, best brew
```

Key roasting principles (from Roasting Intent document):
- **"Roast for elasticity, brew for intensity"** — roasts should contain many possible cups, not demand one narrow set of conditions
- Experiments are structured A/B/C tests with a single variable changed per set
- The roast_learnings record captures what was learned at the bean level: aromatic behavior, structural behavior, primary levers, failure signals, cultivar-specific takeaways

### Equipment Context

- **Grinder:** Weber EG-1 (one at home, one at office) — large flat burr, tight particle distribution. Grind range 6.0-6.8 is the operating window; below 6.0 hits diminishing returns.
- **Brewers:** Orea Glass/Porcelain, April Glass, Kalita Wave 155, SWORKS Bottomless Dripper (valve-controlled contact time), UFO Ceramic, Hario V60
- **Roaster:** Roest sample roaster (100g batches)
- **Water:** Home uses distilled + remineralized; office uses Palo Alto tap
- **Filters:** Sibarist FAST, Espro Bloom, Hario paper, others per brewer

---

## Data Model

### Entities and Record Counts (as of April 2026)

| Entity | Records | Description |
|--------|---------|-------------|
| **brews** | 55 | Best brew archives (51 purchased, 4 self-roasted) |
| **terroirs** | 22 | Geographic/ecological zones |
| **cultivars** | 30 | Coffee varieties with genetic taxonomy |
| **green_beans** | 4 | Raw coffee lots (self-roasted only) |
| **roasts** | 61 | Individual roast logs per green bean |
| **cuppings** | 17 | Cupping evaluations per roast |
| **experiments** | 0 | Structured A/B/C roast experiments (schema exists, not yet imported) |
| **roast_learnings** | 4 | Per-bean synthesis of what was learned from roasting |
| **process_syntheses** | cache | AI synthesis keyed on (user_id, process), populated on-demand from /processes/[slug] pages |

### Relationship Map

```
profiles (user)
  ├── brews ────────────── terroir_id ──→ terroirs
  │   │                    cultivar_id ─→ cultivars
  │   │                    green_bean_id → green_beans (self-roasted only)
  │   │                    roast_id ────→ roasts (self-roasted only)
  │   └── source: "purchased" | "self-roasted"
  │
  ├── terroirs ─────────── Country → Admin Region → Macro Terroir → Meso Terroir
  │   └── synthesis (AI-generated per macro_terroir + country)
  │
  ├── cultivars ────────── Species → Genetic Family → Lineage → Cultivar Name
  │   └── synthesis (AI-generated per lineage)
  │
  ├── process_syntheses ── (user_id, process) PK — AI synthesis cached per process name
  │                        (no FK; brews.process is free-text, families in lib/process-families.ts)
  │
  └── green_beans ──────── terroir_id, cultivar_id
      ├── roasts ─────────── (cascading delete)
      │   └── cuppings
      ├── experiments ────── (cascading delete)
      └── roast_learnings ── (one per bean, cascading delete)
```

### FK Integrity (all 100%)

- Every brew has `terroir_id` and `cultivar_id` set
- Every self-roasted brew has `green_bean_id` set
- Every green bean has `terroir_id` and `cultivar_id` set
- New brews MUST set `terroir_id` and `cultivar_id` on insert

### Key Brew Fields

| Field | Type | Description | Coverage |
|-------|------|-------------|----------|
| coffee_name | text | Full name of the coffee | 55/55 |
| source | enum | "purchased" or "self-roasted" | 55/55 |
| roaster | text | Roaster who sold the coffee (self-roasted = "Latent") | 55/55 |
| producer | text | Farm / washing station / estate that grew the coffee | 55/55 |
| extraction_strategy | text | Clarity-First / Balanced Intensity / Full Expression | 55/55 |
| what_i_learned | text | Long-form narrative of key learnings from this coffee | ~36/55 |
| key_takeaways | text[] | Bullet-point learnings (from import) | 55/55 |
| terroir_connection | text | How terroir expressed in the cup | ~16/55 |
| cultivar_connection | text | How cultivar expressed in the cup | ~20/55 |
| extraction_confirmed | text | Confirmed strategy tag | ~13/55 |
| Recipe fields | various | brewer, filter, dose_g, water_g, grind, temp_c, bloom, pour_structure, total_time | 55/55 |
| Sensory fields | text | aroma, attack, mid_palate, body, finish, temperature_evolution, peak_expression | 55/55 |

### Canonical Registries

The data model enforces canonical naming through two registries. These prevent taxonomy drift and ensure learnings aggregate correctly.

**Macro Terroir Registry** — ecological systems, not administrative units:
- Central Andean Cordillera, Western Andean Cordillera, Huila Highlands, Sidama Highlands, Guji Highlands, Bench Sheko Highlands, Volcán Barú Highlands, Northern Andean Cordillera, Cerrado Mineiro, Chiapas Highlands, Marcala Highlands, Costa Rican Central Volcanic Highlands, Lake Kivu Highlands, West Arsi Highlands, Yunnan Monsoonal Highlands, Sierra Sur Highlands, Southern Andean Cordillera

Rules:
- Macro must represent a true ecological system (elevation band + climate regime + soil base)
- New macros require validation: does it change extraction behavior? Would you roast differently?
- Meso terroirs (municipality/valley/ridge) are sub-units within a macro
- Admin regions are for traceability only, never used as ecological labels

**Cultivar Registry** — genetic taxonomy:
- 5 Genetic Families: Ethiopian Landrace Families, Typica Family, Bourbon Family, Typica × Bourbon Crosses, Modern Hybrids
- Lineages are branches within families (strictly genetic, not behavioral)
- Cultivar names must resolve to canonical registry entries
- Marketing names are normalized (e.g., "Geisha" → "Gesha (Panamanian selection)")
- Blends are cultivars, not lineages
- "Ethiopian landrace population" is the default for unidentified Ethiopian coffees

### AI Synthesis

Both terroir and cultivar detail pages generate AI synthesis using Claude Sonnet 4.6:
- **Terroir synthesis:** aggregates all brews sharing a macro_terroir + country, distills patterns about the ecological zone's cup expression
- **Cultivar synthesis:** aggregates all brews sharing a lineage, distills patterns about brewing behavior for that genetic branch
- Synthesis context includes: key_takeaways, what_i_learned, sensory notes, extraction_strategy, temperature_evolution, peak_expression, terroir/cultivar_connection
- Synthesis is 2-4 sentences, first person, actionable
- Regenerated on demand (button click on detail page)

---

## Current App State

### Pages

| Page | Status | Description |
|------|--------|-------------|
| **/brews** | Built | List view — effectively the home page |
| **/brews/[id]** | Built | Full brew detail with recipe, sensory, terroir, cultivar sections |
| **/terroirs** | Built | Index grouped by Country → Macro Terroir with brew counts |
| **/terroirs/[id]** | Built | Macro-level aggregation with synthesis, flavor notes, coffee list, confidence |
| **/cultivars** | Built | Index grouped by Genetic Family → Lineage with brew counts (FK joins) |
| **/cultivars/[id]** | Built | Lineage-level aggregation with synthesis, flavor notes, coffee list, confidence |
| **/processes** | Built | Index grouped by Family → process (Washed / Natural / Honey / Anaerobic / Experimental) with brew counts |
| **/processes/[slug]** | Built | Process-level aggregation with synthesis, flavor notes, cultivars, terroirs, coffee list, confidence |
| **/green** | Built | Green bean list and detail with roast logs, cuppings, experiments, learnings |
| **/add** | Partial | Self-roasted flow works (9-step wizard). Purchased flow is stub ("coming soon") |

### What Works Well

- Terroir and cultivar pages aggregate learnings at the right level (macro terroir, lineage)
- AI synthesis provides useful first-person narrative summaries
- All FK relationships are solid — no broken links, no orphaned records
- Green bean detail pages show the full roasting journey (logs → experiments → cuppings → learnings)
- Data model supports both purchased and self-roasted workflows

### What's Missing or Incomplete

**Mobile / responsive design — partially addressed**
- Nav: hamburger + sheet below `md:` breakpoint (PR #14). Sheet auto-closes on route change. Desktop nav untouched.
- Remaining mobile debt, both visible and awaiting a dedicated sprint:
  - `/brews` grid at 2-col / 375px: card text (coffee name, producer, region, roaster stack) truncates at 4-8 chars — barely readable. Needs either a 1-col stack on mobile or a simplified card layout.
  - `/brews/[id]` hero: long coffee-name titles wrap word-by-word because the adjacent `PURCHASED` badge competes for horizontal space. Needs the hero flex layout redesigned for narrow widths.
- The add wizard, 3 aggregation indices, and 3 aggregation detail pages all render cleanly at 375 / 768 / 1280.

**Terroir / cultivar extended fields**
- Terroir extended fields (acidity_character, body_character, farming_model, dominant_varieties, typical_processing) — columns exist, not fully populated, not merged across a macro group with full confidence
- Cultivar extended fields (roast_behavior, resting_behavior, market_context) — columns exist, not fully populated

**Experiments table empty**
- Schema supports structured A/B/C experiments with full hypothesis → outcome → insight flow
- The roasting spreadsheet has experiment data (at least 2 sets) but they haven't been imported
- The add wizard has an experiments step but it depends on the self-roasted flow

**Cross-dimensional search**
- Brews list now filters by `extraction_strategy` (Clarity-First / Balanced Intensity / Full Expression) and every card surfaces its strategy via a colored chip
- Still missing: filters for process / terroir / cultivar; full-text search across what_i_learned narratives; saved combined views (e.g. "Clarity-First × Gesha × Central Andean Cordillera")

### Recently completed (April 2026)

- **Purchased-coffee import flow (PR #9)** — 4-step wizard with canonical registry validation, shared `lib/brew-import.ts` used by UI and API
- **Surface what_i_learned + extraction_strategy (PR #10)** — strategy filter pills on `/brews`, strategy chip on every brew card, extraction pill on terroir/cultivar detail coffee rows, "Tasted As (differs)" only shown on brew detail when tasting diverged from plan
- **Brew card redesign (PR #10)** — removed duplicate content below cards, consolidated four copies of the cover-color function into `lib/brew-colors.ts`, shifted floral sage to teal so the green palette reads as distinct hues (Gesha / floral / fallback)
- **Build hygiene (PR #11)** — enabled `strictNullChecks` in tsconfig so discriminated-union narrowing in `lib/brew-import.ts` compiles under `next build`
- **Producer column + backfill (PR #12, migration 011)** — added `brews.producer`, backfilled 55/55 from the Beans tab + direct fill, split the card and hero so producer and roaster render as distinct lines (no more roaster-as-producer mislabel). `lib/brew-import.ts` + Claude-parse schema now flow producer through.
- **Processes aggregation (migration 012)** — third aggregation dimension alongside terroirs + cultivars. `/processes` index groups 20 distinct process values into 5 families (Washed / Natural / Honey / Anaerobic / Experimental) via `lib/process-families.ts`. Detail pages aggregate brews per process with palate-aware synthesis (explicitly primed that Chris's palate has widened beyond clean-washed — the prompt asks when each style *delivers vs. goes off*, not which is best). Migration normalizes casing + merges `Classic Natural` into `Natural`. Synthesis cached in new `process_syntheses` table. `<StrategyPill>` extracted to `components/StrategyPill.tsx` — consolidates 4 copies across brews-list, terroir-detail, cultivar-detail, processes-detail (2 variants: row + card).
- **Design polish + mobile pass (PR #14)** — mobile nav hamburger + sheet below `md:` breakpoint. `<SectionCard>` and `<Tag>` extracted to `components/` (were triple-duplicated across terroir / cultivar / process detail). `<StrategyPill>` removed from aggregation detail coffee rows (option A from the sprint plan) — strategy still surfaces on `/brews` cards and brew detail pages. `/brews` and `/brews/[id]` still have known mobile debt (see "What's Missing").
- **Flavor-notes canonicalization + brew-edit UI (migration 013)** — `lib/flavor-registry.ts` ships with ~100 canonical flavor tags across 8 families (Citrus, Stone Fruit, Berry, Tropical, Grape & Wine, Floral, Tea & Herbal, Sweet & Confection) + Other, hue-separated palette, and a 3-tier classifier (exact → case-insensitive → longest canonical substring). Migration 013 collapsed 148 drifty raw tags to 132 canonical Title-Case tags in-place; composites ("Floral sweetness") and structure descriptors ("Bright", "Tea-like finish") stay in the data and route to their family at render time — no data lost. All 3 aggregation detail pages now render COMMON FLAVOR NOTES grouped by family (via shared `<FlavorNotesByFamily>`), and `aggregateFlavorNotes(brews)` hoisted the previously-triple-duplicated counting loop. First edit surface: `/brews/[id]/edit` — single-page form covering every editable field, chip-input flavor notes with registry autocomplete and "did you mean X?" warning for non-canonical entries. PATCH `/api/brews/[id]` uses a whitelist + RLS-scoped update; terroir/cultivar are pick-from-existing (create-new still routes through /add).

---

## Source Data Locations

The app is one part of a larger system. These are the other parts:

| Source | Location | Contents |
|--------|----------|----------|
| **Brewing Spreadsheet** | Google Sheets (exported xlsx) | Best Brew tab (56 entries), Beans tab (93 entries), Terroirs (57), Cultivars (37), Taste Profile |
| **Roasting Spreadsheet** | Google Sheets (exported xlsx) | Green Beans, Roasts, Experiments, Cuppings, Overall Lessons per bean |
| **Brewing Master Reference** | Word doc (v5.0) | Brew prompt for Claude, roaster reference cards, archive patterns, equipment reference |
| **Terroir + Cultivar Ruleset** | Word doc | Data schemas, hierarchy rules, canonical registries, validation checklists |
| **Roasting Intent** | Word doc | Roasting philosophy — "roast for elasticity, brew for intensity" |
| **Claude Projects** | claude.ai | Active iteration workspaces for current coffees (not archived) |

The Beans tab in the brewing spreadsheet has **93 entries** — all beans Chris has purchased. Only 56 have a best brew archived. The remaining ~37 are either still being iterated on, were not memorable enough to archive, or were consumed without formal documentation.

---

## Taste Profile

Chris's preferences center on a high-clarity, tea-structured profile:

| Category | Loves | Tolerates | Dislikes |
|----------|-------|-----------|----------|
| Process | Washed, white honey, controlled natural (DRD), controlled mosto | Light honey, very light anaerobic if clean | Heavy anaerobic, uncontrolled natural, co-ferments |
| Acidity | Malic/citric (juicy, crisp) | Tartaric if balanced | Lactic or acetic (fermented, boozy) |
| Body | Light, silky, tea-like | Medium if clean and structured | Syrupy, heavy, creamy |
| Sweetness | Simple sugar, white honey, structured pastry | Subtle caramel if restrained | Jammy, condensed-milk, heavy brown sugar |
| Finish | Quick, clean, bright | Gentle lingering fruit | Bitter, boozy, drying |
| Flavors | Floral, fruit-tea, elegant citric | Sweet spice, oolong, mild savory | Nutty, winey, dark chocolate |

This profile has widened over time to include controlled naturals and structured sweet-savory complexity, as long as clarity, acidity, and a clean finish remain intact.

---

## Architecture

- **Framework:** Next.js 14 App Router, server components by default, client components only for interactivity (synthesis auto-generation)
- **Database:** Supabase Postgres with Row Level Security — all queries scoped to authenticated user
- **Auth:** Supabase cookie-based auth via `@supabase/ssr`
- **AI Synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk`
- **Deployment:** Vercel, preview deployments per branch
- **Dev note:** `ANTHROPIC_API_KEY` must be explicitly passed to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — auto-detection fails in Vercel serverless

---

## Future Directions

These are ideas and patterns that have emerged from the data, not committed features.

### Near-term (data foundation)

- **Producer + roaster canonicalization** — both are free-text today (55/55 populated). Same drift risk as flavor_notes had pre-migration-013. A small canonical registry + edit-form typeahead (same pattern as `lib/flavor-registry.ts`) would let aggregation work at the producer/roaster level.
- **Mobile / tablet design pass** — validate brew-card grid, detail page, nav, and add wizard across 375 / 768 / 1280 viewports. Probably needs a larger tap target for filter pills and a vertical card stack on phone.
- **Backfill remaining what_i_learned** — ~19 brews still missing long-form learnings.
- **Import experiment data** — the roasting spreadsheet has structured experiments that belong in the experiments table.
- **Second filter dimension on /brews** — add process filter next to the strategy pills; probably collapse into a small filter drawer if we keep adding dimensions.

### Medium-term (knowledge compounding)

- **Extraction strategy patterns** — the three strategies (Clarity-First, Balanced Intensity, Full Expression) are a core part of the brewing framework. A view showing which coffees confirmed which strategy, organized by variety × process, would be directly useful for recipe design.
- **Cooling behavior tracking** — many brews have critical evaluation temperature thresholds (e.g., "do not evaluate before 50°C", "rose character only emerges near 40°C"). This is scattered in temperature_evolution and what_i_learned but not structured or searchable.
- **Roaster reference integration** — the Brewing Master Reference has cards for 30+ roasters with house style tags. These could live in the app and link to brews.

### Longer-term (workflow integration)

- **Canonical flavor database from roaster corpora** — `lib/flavor-registry.ts` today has ~100 tags derived from Chris's own 55-brew sample. Expand by scraping every flavor note across every coffee offered by every roaster Chris has bought from (Sey, Colibri, Cafe Imports, etc.), plus large public coffee databases (Coffee Review, Sprudge tasting notes). Goal: a registry of every flavor word a specialty coffee might carry, so when a new brew is added the autocomplete reaches for a real canonical match instead of letting the user free-type something close. Also feeds a "rare flavor" signal — if Chris adds a tag that only appears in 1% of offerings, that's a meaningful marker.

- **Claude project integration** — the iteration workspace (Claude projects) and the archive (this app) are currently disconnected. When a brew is finalized in a Claude project, there's a manual step to transcribe it into the spreadsheet and then into the app. Tighter integration could streamline this.
- **Green bean sourcing intelligence** — when Chris sources a new green bean, the app could surface relevant prior learnings: "You've roasted 2 other Gesha 1931 lots. Development time was the primary lever. Start near Batch 25 parameters."
- **Cross-dimensional queries** — "Show me all Clarity-First brews on Gesha from the Central Andean Cordillera" or "Which cultivars required Full Expression regardless of process?"

---

## Lessons Learned

Running notes from past sprints — keep this section for future-you.

**Design**
- Desktop-first is fine for a personal tool, but mobile/tablet viewport checks need to be a standing part of any UI sprint. Assume nothing about how a new component looks on phone.
- When putting multiple content items on a single surface (book-cover card), strip all duplicates from surrounding chrome. A 40-character coffee name rendered twice per card became very loud once the card itself carried the metadata.
- Color palettes need hue separation, not just lightness separation. Two greens at different saturation still read as "the same color" — if a signal deserves its own color, shift hue (green → teal) rather than lighten. Apply this to any future color-coding work.
- Consolidate color helpers. Duplicated `getFlavorColor` across four pages drifted into subtly different palettes and caused a visible mismatch between the list and detail views. One source of truth per visual system.
- Per-row indicators orthogonal to a page's main dimension are noise. On aggregation detail pages (terroir / cultivar / process), a strategy pill per coffee didn't co-vary with the page's grouping — it became visual clutter faster than signal. The cleaner call was to drop it entirely; the strategy surface is one click away on brew detail and still actively used as a filter on `/brews`. Signal density earns its keep by co-varying with the view you're in.
- A mobile pass that only fixes the most visible issue (nav overflow) is a partial fix, not a done fix. `/brews` cards at 2-col mobile and the brew detail hero both have real problems that need their own scoped sprint — flag explicitly in "What's Missing" so scope doesn't creep.
- **"Keep the data, classify on render" beats destructive canonicalization.** During the flavor-notes sprint, we had two ways to handle composite tags like "Floral sweetness" and structure descriptors like "Bright": rewrite them in a migration, or let the registry classify them at render time. Chose render-time classification via a 3-tier lookup (exact → case-insensitive → longest canonical substring) in `lib/flavor-registry.ts`. Migration only handled purely mechanical fixes (case, prefix strip, sentence splits). Nothing irreversible, the registry is still the single source of truth for grouping, and edge cases like "Tea-like finish" → Tea & Herbal work without having to anticipate every composite in a rewrite.
- **When the audit groups variants by `lower(btrim(note))`, the migration has to replace every non-canonical variant, not just the lowercase one.** First pass of migration 013 missed sentence-case forms ("Candied strawberry", "Passion fruit") because I wrote `array_replace` only for `lower → Canonical`. Had to apply a follow-up sweep catching sentence-case. Next data-canonicalization sprint: the audit query should emit every distinct variant per cluster, and the migration generates one UPDATE per variant.

**Data**
- A field's UI label is a claim about its semantics. The `roaster` fallback into the producer slot broke this — the card read "producer: Hydrangea" but the underlying data said "roaster: Hydrangea". Either add the missing column or label the slot honestly; don't conflate.
- The extraction_confirmed → extraction_strategy relationship is a "did plan match taste" audit trail, not a duplicate field. Show it only on divergence; a field that's identical to another 80% of the time reads as noise.
- Before designing around a field, check population: `what_i_learned` was 56/56 but `extraction_confirmed` was 14/56 — that ratio changed the design choice (surface the former broadly, hide the latter conditionally).
- Not every aggregation dimension needs an FK. `brews.process` is free-text with ~20 values; a `lib/<x>-families.ts` lookup gave us family grouping + colors without a migration or join. Only reach for a table when the dimension needs its own metadata (synthesis cache, which we did add).

**AI synthesis framing**
- A synthesis prompt is a stance, not a summary. Without explicit framing, Claude defaulted to "Chris prefers clean" — so the /processes prompt had to say "palate has widened, focus on when this style delivers vs. when it goes off." When the aggregation dimension is value-laden (process, roast style, anything with good/bad connotations), the prompt needs to declare that values are not the goal; mechanics are.

**Build / tooling**
- `strict: false` with `strictNullChecks: true` is the current baseline. Discriminated-union narrowing depends on `strictNullChecks`. Do not turn it off without first refactoring `PersistResult` / `ValidationResult` / `TerroirMatch` / `CultivarMatch`.
- The worktree can't run `npm run build` (missing `@anthropic-ai/sdk`). Use `npx tsc --noEmit` in the main repo dir as a build proxy before pushing. Relying on Vercel to catch type errors cost one failed deploy.
- Keep PRs scoped. PR #9 shipped with type-narrowing issues that only surfaced when PR #10 triggered a fresh Vercel build. If `next build` had run locally as part of #9's checklist, we'd have caught it at the source.

---

## Migration History

| Migration | What it did |
|-----------|-------------|
| 001 | Initial schema (all tables, RLS policies, unique constraints) |
| 002 | Add cultivar synthesis fields |
| 003 | Add cultivar extended fields (notes, origins, pitfalls, etc.) |
| 004 | Add terroir synthesis fields |
| 005 | Backfill brew → terroir links (coffee_name matching) |
| 006 | Data integrity cleanup: FK backfills, deduplication, terroir/cultivar merges |
| 007 | Align terroir and cultivar names to canonical registries |
| 008 | Add missing schema fields (what_i_learned, terroir/cultivar extended), consolidate Huila |
| 009 | Backfill extraction_strategy (part 1 — strategy-only updates) |
| *SQL* | Backfill extraction_strategy + what_i_learned (parts 2-8, applied via execute_sql) |
| *SQL* | Insert Alo Village Washed 74158 brew, update Yusuf Natural and Finca La Reserva Gesha with spreadsheet data |
| 010 | Backfill cultivar behavior fields (roast_behavior, resting_behavior, market_context) |
| 011 | Add brews.producer column, backfill to 55/55; normalize roaster names (drop "Coffee Roasters" / "Cafe" suffixes); label self-roasted as "Latent"; dedupe Alo Coffee / MSW1 |
| 012 | Normalize brews.process values (casing + merge "Classic Natural" → "Natural"); create process_syntheses cache table with RLS |
| 013 | Canonicalize brews.flavor_notes: case-variant collapse (13 clusters), title-case singletons, prefix/fragment fixes, per-row long-sentence splits. 148 → 132 canonical Title-Case tags. |
