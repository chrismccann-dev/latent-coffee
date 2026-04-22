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
| **roaster_syntheses** | cache | AI synthesis keyed on (user_id, roaster), populated on-demand from /roasters/[slug] pages |

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
| **/roasters** | Built | Index grouped by extraction-strategy family (Clarity-First / Balanced / Extraction-Forward / Varies / Self-Roasted) with brew counts |
| **/roasters/[slug]** | Built | Roaster-level aggregation with BMR house-style block, palate-aware synthesis, flavor notes, cultivars, terroirs, processes, coffee list, confidence |
| **/green** | Built | Green bean list and detail with roast logs, cuppings, experiments, learnings |
| **/add** | Partial | Self-roasted flow works (9-step wizard). Purchased flow is stub ("coming soon") |

### What Works Well

- Terroir and cultivar pages aggregate learnings at the right level (macro terroir, lineage)
- AI synthesis provides useful first-person narrative summaries
- All FK relationships are solid — no broken links, no orphaned records
- Green bean detail pages show the full roasting journey (logs → experiments → cuppings → learnings)
- Data model supports both purchased and self-roasted workflows

### What's Missing or Incomplete

**Mobile / responsive design — addressed**
- Nav: hamburger + sheet below `md:` breakpoint (PR #14).
- `/brews` grid, `/brews/[id]` hero, and the 5-dim filter bar all now render cleanly at 375px (see "Recently completed" below).
- The add wizard, 3 aggregation indices, and 3 aggregation detail pages all render cleanly at 375 / 768 / 1280.

**Experiments table — partially backfilled**
- Schema supports structured A/B/C/D experiments with full hypothesis → outcome → insight flow
- 18 experiments imported (migration 019) for the 4 green beans currently in the database
- The roasting spreadsheet has 16 additional experiments tied to 5 CGLE / Forrest / Higuito beans whose green_beans rows have not been imported yet — these will land in the next sprint alongside the green_beans backfill

**Cross-dimensional search**
- Brews list now filters across 5 dimensions — extraction strategy, process family, roaster family, cultivar lineage, terroir macro — with multi-select within each dimension (OR) and intersection across dimensions (AND). URL-driven state, shareable links, back-button works.
- Still missing: full-text search across `what_i_learned` narratives; saved / named views.

### Recently completed (April 2026)

- **Purchased-coffee import flow (PR #9)** — 4-step wizard with canonical registry validation, shared `lib/brew-import.ts` used by UI and API
- **Surface what_i_learned + extraction_strategy (PR #10)** — strategy filter pills on `/brews`, strategy chip on every brew card, extraction pill on terroir/cultivar detail coffee rows, "Tasted As (differs)" only shown on brew detail when tasting diverged from plan
- **Brew card redesign (PR #10)** — removed duplicate content below cards, consolidated four copies of the cover-color function into `lib/brew-colors.ts`, shifted floral sage to teal so the green palette reads as distinct hues (Gesha / floral / fallback)
- **Build hygiene (PR #11)** — enabled `strictNullChecks` in tsconfig so discriminated-union narrowing in `lib/brew-import.ts` compiles under `next build`
- **Producer column + backfill (PR #12, migration 011)** — added `brews.producer`, backfilled 55/55 from the Beans tab + direct fill, split the card and hero so producer and roaster render as distinct lines (no more roaster-as-producer mislabel). `lib/brew-import.ts` + Claude-parse schema now flow producer through.
- **Processes aggregation (migration 012)** — third aggregation dimension alongside terroirs + cultivars. `/processes` index groups 20 distinct process values into 5 families (Washed / Natural / Honey / Anaerobic / Experimental) via `lib/process-families.ts`. Detail pages aggregate brews per process with palate-aware synthesis (explicitly primed that Chris's palate has widened beyond clean-washed — the prompt asks when each style *delivers vs. goes off*, not which is best). Migration normalizes casing + merges `Classic Natural` into `Natural`. Synthesis cached in new `process_syntheses` table. `<StrategyPill>` extracted to `components/StrategyPill.tsx` — consolidates 4 copies across brews-list, terroir-detail, cultivar-detail, processes-detail (2 variants: row + card).
- **Design polish + mobile pass (PR #14)** — mobile nav hamburger + sheet below `md:` breakpoint. `<SectionCard>` and `<Tag>` extracted to `components/` (were triple-duplicated across terroir / cultivar / process detail). `<StrategyPill>` removed from aggregation detail coffee rows (option A from the sprint plan) — strategy still surfaces on `/brews` cards and brew detail pages. `/brews` and `/brews/[id]` still have known mobile debt (see "What's Missing").
- **Flavor-notes canonicalization + brew-edit UI (migration 013)** — `lib/flavor-registry.ts` ships with ~100 canonical flavor tags across 8 families (Citrus, Stone Fruit, Berry, Tropical, Grape & Wine, Floral, Tea & Herbal, Sweet & Confection) + Other, hue-separated palette, and a 3-tier classifier (exact → case-insensitive → longest canonical substring). Migration 013 collapsed 148 drifty raw tags to 132 canonical Title-Case tags in-place; composites ("Floral sweetness") and structure descriptors ("Bright", "Tea-like finish") stay in the data and route to their family at render time — no data lost. All 3 aggregation detail pages now render COMMON FLAVOR NOTES grouped by family (via shared `<FlavorNotesByFamily>`), and `aggregateFlavorNotes(brews)` hoisted the previously-triple-duplicated counting loop. First edit surface: `/brews/[id]/edit` — single-page form covering every editable field, chip-input flavor notes with registry autocomplete and "did you mean X?" warning for non-canonical entries. PATCH `/api/brews/[id]` uses a whitelist + RLS-scoped update; terroir/cultivar are pick-from-existing (create-new still routes through /add).
- **Roasters aggregation (migration 014)** — fourth aggregation dimension alongside terroirs / cultivars / processes. `/roasters` index groups 21 distinct roaster names into 5 families (Clarity-First / Balanced / Extraction-Forward / Varies / Self-Roasted) via `lib/roaster-registry.ts`, mirroring the BMR's existing extraction-strategy tags. Detail pages aggregate brews per roaster with palate-aware synthesis primed with the BMR's documented house-style read for that roaster (when present) — Claude treats the BMR card as a working hypothesis to confirm or push back on against the brew corpus. Migration 014 normalizes "Luminous Coffee" → "Luminous" (1 row) and adds the `roaster_syntheses` cache table. `lib/roaster-registry.ts` ships with `ROASTER_METADATA` for all 21 roasters (13 sourced from the BMR doc, 7 from a mid-sprint research pass on previously-undocumented roasters, plus Latent for self-roasted). `<TagLinkList>` extracted to `components/TagLinkList.tsx` (consolidates the 6+ copies of `SectionCard` + `Tag` + `Link` triplet across the 4 aggregation detail pages). Header nav grows to 6 desktop items + ADD; `gap-8` → `gap-6` to absorb the new slot. All 4 aggregation detail pages now cross-link roasters bidirectionally (the older terroir↔cultivar↔process tag sections were backfilled in a follow-up sprint — see "Cross-link backfill" below).
- **Design-system standardization sprint** — formalized the chrome token system in `tailwind.config.ts` + `app/globals.css` as the canonical source of truth. Added `text-chip` (8px) and `text-micro` (9px) font-size tokens + `.btn-sm` button variant; removed every `text-[Npx]` arbitrary value from JSX; replaced the last inline `#hex` chrome color (source badge). Aligned `<SectionCard>` title to the `.label` pattern (mono 10.4px semibold `text-latent-mid`) so the section-label treatment is consistent across every card on every page. The 4 *Synthesis.tsx components and the last inline `Section`/`Tag` re-implementations on `/brews/[id]` now route through the canonical `<SectionCard>` + `<Tag>` primitives. `lib/country-colors.ts` + `lib/cultivar-family-colors.ts` dedupe two previously-duplicated palette constants; the family-colors file adopts the detail-page palette (distinct per family) as canonical — the previous index-page behavior of collapsing all non-Ethiopian families to gray was a drift, not a decision. See the new "Design System" section below for the full token map.
- **Data-depth backfill sprint (migrations 015 / 016 / 017)** — the sprint premise was "extended fields are sparse, backfill from reference docs" but the audit revealed the real gap was canonicalization drift, not content depth. Three migrations shipped. **015** reclassified two Guatemala terroirs that had been placed under foreign-country macros (Huehuetenango had been labeled `Chiapas Highlands`, Acatenango labeled `Costa Rican Central Volcanic Highlands`) into new macros `Huehuetenango Highlands` and `Acatenango Volcanic Highlands`, with `why_it_stands_out` content grounding each as ecologically distinct. **016** handled cultivar canonicalization: collapsed all 5 Gesha rows (Panamanian / Colombian / Brazilian / 1931 / bare) into one canonical `Gesha` row under `Gesha lineage` (merged scalar + array content via COALESCE priority, re-pointed 22 brews + 2 green beans to the survivor, deleted the other 4), renamed `Sidama-type landrace populations (JARC selections)` → `JARC blend lineage` (making the "blends don't transfer learnings to their component cultivars" distinction explicit), moved Garnica from `Timor-derived crosses` under Typica × Bourbon Crosses to `Timor Hybrid-derived lineage` under Modern Hybrids (Garnica is Catimor-derived), and added the missing "lineage" suffix to `Pacas × Maragogype`. Drops the `Timor-derived crosses` lineage. **017** backfilled the 5 gappy array fields (`typical_origins`, `limiting_factors`, `common_processing_methods`, `typical_flavor_notes`, `common_pitfalls`) for the 9 lineages that rendered blank post-canonicalization — content drafted at the lineage level (not cultivar-specific) and landed on the lineage representative cultivar (detail page merge is first-non-null, so one populated row surfaces the section). Post-sprint every lineage renders all 5 extended-field sections. Zero UI change; all gains come from the substrate. Sprint explicitly did not touch layout / chrome / any lib file — chrome is locked until the Claude-Design-led redesign.
- **Cross-dimensional filters on `/brews`** — multi-select filter bar above the grid extends the shipping `extraction_strategy` pill row with four new dimensions: process family (5), roaster family (5), cultivar lineage (13), terroir macro (21). Low-cardinality dimensions (strategy / process / roaster) render as flat family-colored pill rows; high-cardinality dimensions (lineage / macro) render as popover-per-dimension buttons with an active-count badge. Combinator is OR within a dimension, AND across dimensions. State lives entirely in `searchParams`, so filter combos are shareable URLs and the back button works. Filter options are derived from the unfiltered corpus so no dead values surface. Empty state shows `NO BREWS MATCH THESE FILTERS` + clear-all button; filtered-count shows `N / 55`. New client component `<BrewsFilterBar>` with internal `<FilterPill>` + `<FilterPopover>` + `<DimensionRow>` primitives. Reuses existing `PROCESS_FAMILIES` / `ROASTER_FAMILIES` / `EXTRACTION_STRATEGIES` constants + their family-color helpers. No schema change, no migration.
- **Cross-link backfill across the 4 aggregation detail pages** — the older CULTIVARS / TERROIRS / PROCESSES tag sections on `/terroirs/[id]`, `/cultivars/[id]`, and `/processes/[slug]` now render through `<TagLinkList>` instead of plain `<SectionCard>` + `<Tag>` — closing the cross-link cycle the roasters sprint half-built. Every tag on every aggregation detail page is now a clickable link to the corresponding detail page. Selects extended by one column (`id`) on the already-embedded cultivar / terroir joins — no extra queries. `/processes/[slug]` drops its direct `<Tag>` import (now uses `<TagLinkList>` exclusively for the 3 cross-link blocks). Section titles renamed to "EXPLORED" everywhere for consistency ("PROCESSES EXPLORED" vs the former bare "PROCESSES"). No layout / chrome / dimension changes.
- **Producer + roaster canonicalization (migration 018)** — mirrors migration 013's flavor-notes pattern for the remaining free-text columns on brews. Audit found 2 drifted producer clusters (Pepe Jijon ×3 variants, Peterson Family ×2) + 5 verbose/parenthetical strings; roaster was already canonical (migrations 011 + 014 did that work). Migration 018 collapses the producer drift to 49 canonical "Person, Farm"-shape names in place. New [lib/producer-registry.ts](lib/producer-registry.ts) + [lib/canonical-registry.ts](lib/canonical-registry.ts) factory: `makeCanonicalLookup(names)` returns a `CanonicalLookup` bundle (`list` / `isCanonical` / `findClosest`) reused by flavor / producer / roaster registries — killed 3 copies of the same 3-tier classifier. New [components/CanonicalTextInput.tsx](components/CanonicalTextInput.tsx) — single-value typeahead + datalist + "did you mean X?" amber warning, accepts the lookup bundle as one prop. `/brews/[id]/edit` producer + roaster fields now route through it. FlavorNotesInput keeps its multi-value chip shape but shares the factory. No schema change, no new tokens, no new colors — chrome stays re-skinnable under the queued Claude-Design redesign.
- **Experiments import + render polish (migration 019)** — backfilled the experiments table from the Coffee Roasting Spreadsheet. 18 rows landed across the 4 green_beans currently in the database (Surma 2 / Java 6 / Libertad 7 / Oma 3). Migration uses `jsonb_to_recordset` so all string escaping is handled by JSON; idempotent via `ON CONFLICT DO NOTHING` on a new `(user_id, green_bean_id, experiment_id)` unique constraint; FKs resolved via subquery on `green_beans.lot_id` so the migration is portable. Spreadsheet has 16 additional experiments tied to 5 beans (CGLE Mandela XO / Sudan Rume Washed / Sudan Rume Natural, Forrest Gesha Clouds, Higuito Anaerobic Bourbon) whose green_beans rows haven't been imported — flagged for the next sprint. `app/(app)/green/[id]/page.tsx` adopted canonical `<SectionCard>` (replacing 6 sites of an inline `Section` duplicate that predated the components/ extraction), dropped the `🧪` emoji from the EXPERIMENTS title, swapped the experiment-render `<strong>:` labels for the canonical `.label` mono-uppercase pattern (matching how every other detail page labels fields), and surfaced `what_changes_going_forward` (the operational takeaway, missing from the prior render). No new tokens, no new colors, no new components — chrome stays re-skinnable under the queued Claude-Design redesign.
- **Mobile polish on `/brews`, `/brews/[id]`, and the filter bar** — closes the last concrete mobile-debt bullet. `/brews` grid is now `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` — 1-col below 640px so the all-content-on-cover metadata stack reads in full (no more "Moons…" / "Alo C…" 4-5-char truncation). `/brews/[id]` hero stacks vertically below `sm:` (`flex-col sm:flex-row`) and the title row uses `flex-wrap` so the PURCHASED / ROASTED badge + Edit flow below the title instead of clipping past the viewport. `/brews` filter bar collapses behind a single "FILTERS (N) ▾" trigger below `md:` via the new `<FilterTrigger>` primitive — the 4 dimension rows render as before on desktop but fold to one button on mobile with an active-count badge. `<FilterPopover>`'s dropdown anchors `right-0 md:left-0` with a `max-w-[calc(100vw-3rem)]` cap so the Macro popover no longer clips the right edge on mobile. `<DimensionRow>` drops the fixed `w-16` label column — the label now sits inline with the first pill, preserving visual language while freeing ~20% horizontal space at 375px. No tokens, no new breakpoints (defaults: `sm:` 640px, `md:` 768px), no schema change.
- **BMR v7.1 → `BREWING.md` (V1-brews sync sub-sprint 1, step a — PR #27)** — moves the Brewing Master Reference from the Dropbox Word doc into the repo as a living reference. 866-line v7.1 at repo root, byte-identical to the Dropbox source (no re-edits needed in this session — the prior session's F1/F2 restructure had already landed there). F1 added explicit Terroir (Country / Macro / Meso) + Cultivar rows to the Step 4 archive format so the canonical-registry sync can parse them per-field; F2 split the dense "Coffee" blob into 7 discrete fields (Roaster / Coffee Name / Lot Code / Producer / Roast Date / Roast Machine / Roaster Tasting Notes). Step 2 in-progress-recipe examples correctly keep the single "Coffee" row — the split only applies to the resolved-brew archive format. New CLAUDE.md "Living reference docs" section anchors the pattern: Chris hand-edits on mental-model shifts, Claude Code patches during archive sync, Dropbox originals remain as archival snapshots (same treatment will apply to the future `ROASTING.md`). Source Data Locations table in this doc updated to reflect the shift from Dropbox-as-working-copy to repo-as-working-copy. No code touched; step (b) (extract `lib/terroir-registry.ts` + `lib/cultivar-registry.ts` via `makeCanonicalLookup`) is the next session.
- **Green detail render polish (Sprint A from the post-audit queue)** — closes the highest-leverage render gaps on `/green/[id]` surfaced by the April 2026 self-roasted-flow audit. Fixes the `10.20%%` / `776 g/L g/L` display bugs by normalizing `green_beans.moisture` + `density` to bare numeric strings (3/4 beans had `%` stored, 0/4 had `g/L` — audit's premise that the schema canonically stored units was only partially true) and moving the single unit append back to the template. All 4 beans re-measured against Chris's Lighttells MD-500 as the canonical reading. **ROAST LEARNINGS** block grows from 5 to 14 rendered fields — the 9 previously-hidden columns include `starting_hypothesis` (the output of the whole experiment run, rendered last), `cultivar_takeaway` + `general_takeaway` (generalization layers), `underdevelopment_signal` + `overdevelopment_signal` (roast-level diagnostic tells), `what_didnt_move_needle` (load-bearing negative result), `roast_window_width`, `rest_behavior`, `reference_roasts`. A new local `<LearningField label value>` helper routes through the canonical `.label` utility (`/simplify` caught an initial Tailwind-string drift that would have diverged from the rest of the app's mono-uppercase headers). **ROAST LOG** gains FC Temp + Drop Temp columns (the two numbers Chris's learnings explicitly name as "the primary lever that mattered" — previously invisible) plus a `↗` profile_link affordance per row (one click to the Roest graph). 9 columns total, `overflow-x-auto` preserves mobile horizontal scroll at 375px. Experiments / cupping history / hero intentionally untouched (Sprint B queue — rewrites, not render polish). One file, zero schema change, zero migration.

---

## Source Data Locations

The app is one part of a larger system. These are the other parts:

| Source | Location | Contents |
|--------|----------|----------|
| **Brewing Spreadsheet** | Google Sheets (exported xlsx) | Best Brew tab (56 entries), Beans tab (93 entries), Terroirs (57), Cultivars (37), Taste Profile |
| **Roasting Spreadsheet** | Google Sheets (exported xlsx) | Green Beans, Roasts, Experiments, Cuppings, Overall Lessons per bean |
| **Brewing Master Reference** | Repo — `BREWING.md` (v7.1, living doc). Archival snapshot in Dropbox (`Coffee_Brewing_Master_Reference_v7.md`) for Claude projects. | Brew prompt for Claude, roaster reference cards, archive patterns, equipment reference. Migrated into repo 2026-04-21 as the working copy for Claude-authored sync V1 — compounds edit-by-edit alongside `PRODUCT.md`. |
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

## Design System

The brand voice is **quiet research notebook**: monospace labels, book-cover cards per brew, uppercase taxonomy, a restrained sage/dark palette that lets coffee metadata do the talking. Code-level source of truth is `tailwind.config.ts` + `app/globals.css`. The Dropbox folder `Latent Coffee Design System/` is the **Claude Design skill workspace** (UI-kit prototypes, preview HTML, the mirrored `colors_and_type.css` reference) — it is not mirrored into this repo; the Tailwind config wins whenever they disagree.

### Voice & casing

- **First-person research notebook.** Chris speaks as *"I"* — "What I learned", "My taste profile". Never *"you"* or *"we"*. No marketing copy, no CTAs beyond `+ ADD`, no hero headlines.
- **Taxonomic over marketing.** Coffees are classified, not sold. Numbers are labels, not features (`55 COFFEES`, never "55+ coffees tasted!").
- **Uppercase mono** for every label, nav item, badge, pill, section header, count chrome. **Title-case sans** for coffee names, terroir/cultivar names. **Sentence case prose** for the narrative content inside cards.

### Palette

- **Chrome (monochrome + sage):** `latent-bg #FAFAFA` (page), `latent-fg #1A1A1A` (ink), `latent-mid #888` (secondary text), `latent-subtle #BBB` (tertiary), `latent-border #E5E5E5` (hairline), `latent-accent #2C3E2D` (dark sage, primary-button hover + dark-card flourish), `latent-accent-light #4A7C59` (focus ring, PURCHASED badge), `latent-highlight #F8FFF0` + `latent-highlight-border #C5E1A8` (tag/chip background).
- **Semantic palettes (out of scope for chrome sprints):**
  - Book-cover colors: `lib/brew-colors.ts` — process × flavor signals (sage for Gesha/washed, burgundy for anaerobic/wine, gold for honey, brown for natural, teal for floral, slate fallback).
  - Extraction-strategy pills: `lib/extraction-strategy.ts` — Clarity-First (sage), Balanced (ochre), Full (burgundy).
  - Process families: `lib/process-families.ts` — 5 families × per-family hue.
  - Flavor families: `lib/flavor-registry.ts` — 8 families × per-family hue, hue-separated not lightness-separated.
  - Roaster families: `lib/roaster-registry.ts` — 5 BMR-mirrored families + warm-neutral per-roaster swatches.
  - Country swatches: `lib/country-colors.ts` — 12 earth-toned hues, one per producing country.
  - Cultivar family swatches: `lib/cultivar-family-colors.ts` — 6 warm/cool hues, one per genetic family.
- **Hue-separation rule** — two colors at different saturation still read as "the same color." If a signal deserves its own color, shift hue, not lightness.
- **One helper per visual system.** Each semantic palette has exactly one source-of-truth file. Do not copy palette maps into pages.

### Type scale

- **Sans:** Inter (300/400/500/600/700) — coffee names, prose, headings.
- **Mono:** JetBrains Mono (400/500/600/700) — labels, nav, tags, data, badges, buttons. This is the brand's signature voice.
- **Scale** (defined in `tailwind.config.ts`):

| Token | Size | Use |
|---|---|---|
| `text-chip` | 0.5rem (8px) | Strategy-pill short-form, hero cover meta |
| `text-micro` | 0.5625rem (9px) | Strategy-pill row variant, brew-cover flavor line |
| `text-xxs` | 0.65rem (10.4px) | Labels, tags, badges, section headers, metadata |
| `text-xs` | 0.72rem (11.5px) | Nav links, buttons, small chrome |
| `text-sm` | 0.875rem (14px) | Body prose, inputs |
| `text-lg` | 1.125rem (18px) | Brand wordmark |
| `text-xl` | 1.25rem (20px) | Wizard step titles |
| `text-2xl` | 1.5rem (24px) | Detail-page title (largest in-product) |

- **Quiet hierarchy.** The loudest sans text is a brew name at 24px semibold. There is no display/hero type. Page titles are 11.5px mono uppercase labels.
- **Letter-spacing:** `tracking-wide` (0.1em) for most mono uppercase, `tracking-widest` (0.15em) for the brand lockup.

### Spacing

Tailwind defaults, used densely on a narrow set: **1 / 1.5 / 2 / 3 / 4 / 5 / 6 / 8 / 12 / 16**. Page shell is `max-w-3xl` (768px) for detail pages, `max-w-[1200px]` for the /brews grid and header. Horizontal padding `px-6`, vertical `py-8`. Header height fixed `h-14` (56px). No arbitrary `p-[17px]` anywhere — if a size isn't on the scale, it's drift.

### Component primitives

Chrome utilities (via `@apply` in `app/globals.css`):
- **`.section-card`** / **`.section-card-dark`** — white/inverse 1px-border card, `rounded-md`, `p-6 mb-4`.
- **`.label`** — mono xxs semibold uppercase `text-latent-mid`, `mb-2 block`. The canonical section-label treatment.
- **`.tag`** — inline-block mono xxs, sage-highlight bg + border, `rounded`, `px-2 py-1`.
- **`.btn` / `.btn-primary` / `.btn-secondary` / `.btn-sm`** — mono xs semibold uppercase, `px-4 py-3` (default) or `px-3 py-2` (`sm`), `rounded`.
- **`.input` / `.textarea`** — mono sm, 1px latent-border, `px-3 py-2`, sage focus ring.
- **`.editable-field`** — sage-highlight bg + border, signals "this value is editable."
- **`.coffee-card`** — list-row card with hover border shift.
- **`.data-table`** — mono xs table with hairline row dividers + highlight-on-hover.

React components (in `components/`):
- **`<SectionCard title? dark? children>`** — wraps the `.section-card` / `.section-card-dark` treatment with optional `.label`-style title. Every section-of-content on a detail page uses this; do not reimplement inline.
- **`<Tag>`** — renders the `.tag` class.
- **`<TagLinkList title items>`** — `SectionCard` + flex-wrap of `<Link><Tag>`. Used for every cross-link tag block on aggregation detail pages.
- **`<StrategyPill strategy variant="row"|"card">`** — extraction-strategy badge; `card` on book covers, `row` reserved for future use.
- **`<FlavorNotesByFamily>`** — renders `aggregateFlavorNotes(brews)` grouped into the 8 flavor families.
- **`<FlavorNotesInput>`** — chip-input with registry autocomplete + closest-match suggestion.
- **`<Header>`** — sticky brand + nav + ADD + mobile hamburger.

### Iconography

**Zero icon library.** No Lucide, no Heroicons, no SVG icon sprites. What's allowed:
- Unicode glyphs as chrome: `+ ADD`, `← Back to Brews`, `→` for hover-revealed affordance, `·` as metadata separator.
- Exactly four emoji used as category prefixes only: `🌍` (terroir), `🧬` (cultivar), `☕` (empty brew avatar), `🌱` (empty green-bean avatar). Never in buttons, never in badges, never decorating tags.
- Color swatches as visual identifiers: country swatches on terroir pages, family swatches on cultivar pages, full book-cover tiles for brews.
- The brand mark is typographic (`LATENT` + `RESEARCH` in bold mono / light mono) — not pictorial.

If a future surface genuinely needs a line-icon (e.g. a settings gear), use Lucide at `stroke-width: 1.5`, 12–16px, `currentColor` — and flag the addition. Don't sneak one in.

### Surfaces, motion, interaction

- **Flat surfaces.** Page `#FAFAFA`, card `#FFF`, dark-accent card `#1A1A1A`. No gradients, no textures, no hero imagery, no photography.
- **No shadows at rest.** The only shadow in the product is brew-card hover — `shadow-lg` + `-translate-y-1 scale-[1.01]`, the book-lifts-off-the-shelf moment. Focus ring is 2px sage `outline` + 2px offset.
- **Restrained motion.** Every transition is `transition-colors` or `transition-all duration-150` (buttons) / `duration-200` (brew-card hover). Default CSS ease. No bounces, springs, skeleton shimmer, page-load fades, or scroll-linked effects.
- **No transparency.** No frosted glass, no backdrop-blur. `text-white/75` on book covers (dimness hierarchy) and `hover:bg-latent-highlight/30` on list rows (pale sage wash) are the only opacity uses.
- **Selection / scrollbars.** Selection: sage-highlight bg on black text. Scrollbars: 6px, `#CCC` thumb, transparent track.

### Discipline

- **Adding a token = a deliberate decision.** Same energy as adding to the flavor-registry or roaster-registry. If a color / size / spacing isn't on the canonical list, it's drift, not creativity.
- **Desktop is the primary design target.** Tablet spot-check on every UI sprint; phone-scope lives in its own sprint.
- **When in doubt, match the document.** The Dropbox folder's `README.md` + `colors_and_type.css` are a high-fidelity mirror of the code. If the code disagrees with itself between two pages, the documented token wins.

---

## Active Sprint Queue

The current ranked queue of scoped, sized sprints. Shipped sprints are indexed in [Shipped Sprints](#shipped-sprints) with narrative prose in [Current App State § Recently completed](#recently-completed-april-2026). Per-sprint retrospectives live in `memory/project_*.md`. Idea-stage work not yet scoped lives in [Future Directions](#future-directions).

**Last reorder:** 2026-04-21 (Reference Taxonomies umbrella promoted to #1 after scoping brainstorm — Chris's Variety research phase starts immediately and enriches the `lib/cultivar-registry.ts` + `lib/terroir-registry.ts` extracts that sync V1 already shipped in PR #30; V1-brews sync moved to #2 pending step (d) dog-food).

**Workflow rule that bounds what belongs in this queue:** per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves (green bean → roasts → experiments → cuppings → lessons → reference roast → perfected brew). The 5 mid-iteration beans not yet in the DB (CGLE Mandela XO / Sudan Rume Washed / Sudan Rume Natural / Forrest Gesha Clouds / Higuito Anaerobic Bourbon) are NOT a backlog — they land event-driven when Chris finalizes each bean, not on a sprint cadence. Do not propose a "backfill the 5 missing beans" sprint. Revisit when systematic Claude-driven sync exists.

### 1. Reference Taxonomies umbrella — attribution scaffolding + Variety (NEXT, scoped 2026-04-21)

Brainstormed 2026-04-21 in a four-part interpretive session. Full scope in [docs/features/reference-taxonomies-attribution.md](docs/features/reference-taxonomies-attribution.md) (meta) + 5 sibling per-taxonomy docs (Region / Variety / Process / Dripper / Flavor).

**Value prop:** *preload canonical knowledge; compound observations against it.* Today aggregation pages (`/terroirs/[macro]`, `/cultivars/[id]`, `/processes/[slug]`) are empty for entities with no brews. Post-umbrella they render authored reference content the moment an entity enters the canonical registry — the first brew for a new cultivar adds observations against a preloaded framework instead of starting from zero. Also closes the drift loop: Chris's ChatGPT context doc has 14 macros, the DB has 21 — ~1 month of unenforced doc-primary drift. Porting the doc into the repo and making it the enforcement contract eliminates the drift source.

**Why promoted:** Chris's Variety research phase is immediate next task (Chris-driven, not a Claude sprint) and enriches the `lib/cultivar-registry.ts` extract that sync V1 already shipped (PR #30) with curated canonical content + per-entity authored reference material. Sync V1 with an un-enriched DB-snapshot registry still accelerates the drift it's meant to prevent — the taxonomy content is what makes enforcement meaningful, not just the name list. Variety research also resolves one of sync V1 step (d) dog-food pre-reqs (Mokka cultivar classification), so the two sprints share a loop.

**Phyla map:**
- **A1 (port existing ruleset from Chris's Google Doc):** Region, Variety
- **A2 (author new ruleset with same discipline):** Process, Dripper, Flavor
- **C (placement only, not a taxonomy sprint):** Grind size — see § Side-quests

**Sub-sprint 1a — Attribution scaffolding (Claude, small).** Produces `docs/taxonomies/` directory, header-block template, `## Sources` convention. ~2-3 hour task that unblocks every subsequent taxonomy sprint. Can ship in parallel with Chris's Variety research.

**Sub-sprint 1b — Variety research (Chris, unbounded).** Chris drafts `docs/taxonomies/varieties.md` following the adoption workflow in the attribution doc: research → draft → Claude vet → iterate → adopt. ~20 canonical cultivars × ~18 attribute fields. External source: Rob Hoo, *Cultivar: A Practical Guide for Coffee Roasters*. Starting point: the Cultivar section of Chris's ChatGPT context doc (template + registry already exists; per-cultivar content to fill in).

**Sub-sprint 1c — Variety port + render + enforce (Claude).** Fires after 1b hands over a final `varieties.md` draft. Enriches the existing `lib/cultivar-registry.ts` (reconciles canonical names against adopted list; extends aliases map for any trade-name drift surfaced; lineage list reconciled). Renders REFERENCE block on `/cultivars/[id]` above existing synthesis. Enforces on `/add` + `/brews/[id]/edit` via `CanonicalTextInput`.

**Follow-on sub-sprints (deferred, fire after 1c):**
- **Sub-sprint 1d — Region research + port** (mirror of Variety, ~21 macros; enriches `lib/terroir-registry.ts` with per-macro authored content + reconciles the 14-vs-19-vs-21 drift between doc / registry / DB). See [docs/features/reference-taxonomies-region.md](docs/features/reference-taxonomies-region.md).
- **Sub-sprint 1e — Process research + port** (A2, ~20-25 processes, author from Sami). See [docs/features/reference-taxonomies-process.md](docs/features/reference-taxonomies-process.md).
- **Sub-sprint 1f — Dripper research + port** (A2, ~8-10 drippers, BREWING.md integration, no new app page). See [docs/features/reference-taxonomies-dripper.md](docs/features/reference-taxonomies-dripper.md).
- **Sub-sprint 1g — Flavor extension** (A2, loose bar, family-level content, extends existing `lib/flavor-registry.ts`). See [docs/features/reference-taxonomies-flavor.md](docs/features/reference-taxonomies-flavor.md). May deprioritize or defer indefinitely.

**Sizing:** Sub-sprint 1a is half a session. 1b is Chris-driven, 2-5 focused sessions. 1c is 1 Claude sprint after 1b hands over. Follow-on sub-sprints each 1 Claude sprint after Chris's corresponding research phase.

**Scope notes (see attribution doc for full coverage):**
- Citations are bottom-of-page `## Sources` blocks, no inline markers.
- Tested vs untested claims use voice-only signal (no badges, no schema separation).
- External claims never graduate to "Chris's tested" — stay cited forever; Chris's observations live alongside as separate sections.
- No source whitelist; Chris curates per-claim at authoring time.
- Enforcement bar varies: strict for Region / Variety / Process / Dripper; loose for Flavor.

### 2. Claude-authored sync V1 — brews slice (scoped 2026-04-21)

Paste resolved archive block from the coffee-brewing Claude project → Claude Code validates against canonical registries → writes to Supabase via Supabase MCP → patches `BREWING.md` → commits.

**Why promoted over #2:** Chris has active backlog of resolved brews sitting in the Claude project threads (not yet uploaded), AND BMR v5 maintenance is getting cumbersome to do manually each time. Roasting pain is lower (slower cycle, fewer entries per bean) and slots behind as sub-sprint 2.

**Findings from paste-format review (2026-04-21, sample = Picolot Emerald Mokka Natural):**
- **F1** — Archive format is missing Terroir + Cultivar as explicit rows. Today the EA fills them in the spreadsheet. Fix: add **Terroir** (Country / Macro / Meso) + **Cultivar** (canonical name) rows when migrating BMR v5 → `BREWING.md`. Every post-migration brew has what the sync needs; backlog brews need a one-time retrofit.
- **F2** — "Coffee" row is a dense blob (lot code / producer / roast date / roast machine / roaster tasting notes smashed together). Split into **Lot Code / Producer / Roast Date / Roaster Tasting Notes** rows during migration.

**Sub-sprint 1 — steps:**
- **a.** ✅ **Done 2026-04-21.** BMR v7.1 migrated to repo as `BREWING.md` at root (monolithic, internal consumption). F1 + F2 already landed in prior Dropbox v7.1 edits. Migration was a file copy + PRODUCT.md Source Data table update + new CLAUDE.md "Living reference docs" section anchoring the pattern for both `BREWING.md` and the future `ROASTING.md`.
- **b.** ✅ **Done 2026-04-21 (PR #30).** `lib/terroir-registry.ts` (13 countries / 19 macros / 22 mesos as 3 independent `CanonicalLookup`s — mirrors how the archive-format `Country / Macro / Meso` field parses positionally) + `lib/cultivar-registry.ts` (26 canonical names + 13 lineages as flat lookups). Factory gained an optional `aliases` map (tier-0 resolution, backwards-compatible) because the 3-tier classifier returned null on "Geisha" → "Gesha" — trade-name drift isn't catchable by substring / prefix alone. Future registries can declare aliases the same way. **Coordination with candidate #1:** the extracts here are the DB-snapshot starting point. The Reference Taxonomies Variety + Region sprints (candidate #1 sub-sprints 1c + 1d) will enrich these registries with curated canonical content + per-entity authored reference material, and may adjust the canonical name set per the canonical-adoption workflow.
- **c.** ✅ **Done 2026-04-21.** `SYNC.md` at repo root: validator-table-driven playbook (N canonical fields as rows, not hard-coded), per-field `block` vs. `warn` semantics, decision-prompt shapes (alias / canonical-miss / missing-from-paste / dedup / new-terroir-or-cultivar), field → column mapping table (identifies 4 post-F2 paste fields with no DB column — Lot Code / Roast Date / Roast Machine / Roaster Tasting Notes — deferred to schema-additions sprint #4), 6-phase procedure, rollback runbook (git revert + compensating Supabase DELETE via MCP + verify), and an "Open taxonomy questions" section hedging the Reference Taxonomies brainstorm. Dry-run on Picolot Emerald Mokka Natural surfaced three real findings that reshape step (d): Mokka not in cultivar registry (needs Chris pre-decision on family/lineage — now part of candidate #1 Variety research), Garrido producer not canonical (scope call: promote Producer to block-level?), `LABEL_ALIASES` in [lib/brew-import.ts](lib/brew-import.ts) missing post-F2 field labels (parser tweak likely wants to land before dog-food).
- **d.** Dog-food against one backlog brew end-to-end. Find real friction, not speculated friction. **Pre-reqs flagged by step (c) dry-run:** (1) decide Mokka's genetic_family + lineage (resolves through candidate #1 Variety research); (2) decide whether Producer promotes from `warn` to `block`; (3) decide whether to extend `LABEL_ALIASES` first or accept manual stash during the sync.

**Deferred to sub-sprint 2 (roasting follow-on, post V1-brews dog-food — see candidate #7):**
- `reference_mode` column on `green_beans` (`yes` / `no` / `partial` + note). Grandfather pre-counterflow beans to `no` / `partial`. Post-counterflow default `yes` on resolution.
- Roasting Master Reference v2 → `ROASTING.md` in repo.
- Checkpoint sync for per-roast / per-cupping events.
- Mid-cycle "in progress" status badge on `/green` + `/green/[id]`.

**Scope note — per-roaster brewing-guide content:** the BMR's per-roaster brewing-guide cards (currently partially surfaced on `/roasters/[id]` as the HOUSE STYLE block) fully land in `BREWING.md` as part of step (a). Follow-on work to have `/roasters/[id]` excerpt the full per-roaster section from `BREWING.md` (same pattern as the Reference-Roast feature's `/roasting-guide/` excerpts going into `/green/[id]`) is a natural extension, either in sub-sprint 2 or as a small follow-up sprint — not a separate feature.

**V1 explicitly out of scope:** EA replacement, brewing iteration capture, Sheets API polling, bespoke /sync UI, auto-scraping terroir/cultivar metadata, `/reference/brewing` page. V2 (MCP server so Claude projects can push directly without the paste step) deferred until V1 has run on 2+ real coffees.

**Sizing:** sub-sprint 1 is probably 2-3 dedicated sessions (steps a + b done; step c = 1; step d = 1).

### 3. Experiments + Cupping History rework

Chris's post-audit call: both `/green/[id]` sections need rethink. Experiments: 6 schema fields render, 10 hidden — introduce a collapsible pattern or A/B/C/D side-by-side grid so `levels_tested` + `observed_outcome_a/b/c/d` surface without dumping all 17 fields inline. Cupping History: 27 rows flat is unreadable — group by batch (collapsible) or by rest-day phase (Day 3-5 cupping vs Day 7+ pourover).

Plan-mode sprint, interpretive. Likely a new collapsible primitive + 2-3 component extractions. Depends on a populated real bean for preview verification (SRH Washed re-upload when resolved, or the next closed bean). Slots after V1-brews so the roasting-side UI work lands when the sync pipeline is already real.

### 4. Schema additions for dropped source data

Close the P1 data-loss gaps from the self-roasted audit. Single migration adds: `green_beans.elevation` (int, masl), `green_beans.producer_tasting_notes` (text), `green_beans.exporter` (text), `roasts.turning_point_temp` (decimal), `cuppings.sweetness` (text), `cuppings.brew_method` (text). Update the /add flow parsers to read these columns instead of folding/dropping them (cupping `brew_method` is currently folded into `eval_method` as a string concat; `sweetness` is dropped entirely). Update `handleSaveSelfRoasted` to write them. Surface the high-value ones in `/green/[id]` UI — elevation in GREEN BEAN DETAILS, producer_tasting_notes as its own block ("what the producer said this should taste like" is the target the roasting is aiming at).

Sizing: 1 sprint — migration + parser update + save update + render update.

### 5. Reference Roasts entity + surface (scoped 2026-04-21)

See [docs/features/reference-roast-and-guide.md § Reference-roast model](docs/features/reference-roast-and-guide.md). Corresponds to Sprint B of the feature doc.

New `reference_roasts` table (one row per resolved bean), replacing `roast_learnings.best_batch_id` free-text + `roasts.is_reference` bool (both dropped). One FK to the canonical reference roast + an array of replication roast FKs + `why_this_roast_won` prose (moved from roast_learnings) + nullable `brew_id`. Renders in the existing BEST ROAST block on `/green/[id]` (enriched: FC/drop/dev/Agtron inline + replication batches + brew backlink).

Sizing: 1 sprint.

### 6. Roasting Guide + cross-bean excerpts (scoped 2026-04-21)

See [docs/features/reference-roast-and-guide.md § Cross-bean insights](docs/features/reference-roast-and-guide.md). Corresponds to Sprints A-remaining + C of the feature doc.

Bootstrap: convert `Coffee_Roasting_Master_Reference_Guide_V2.docx` (1245 lines, 24 sections) to `docs/ROASTING_GUIDE.md` in repo. Build `/roasting-guide/` page as a Next.js server component reading the markdown at request time. Excerpts pull into `/green/[id]` (BEAN CONTEXT block with fallback cascade) and `/cultivars/[id]` (ROASTING PROFILE block). Scope is Chris's Roest L200 Ultra in counterflow mode only — machine-specific, not a universal reference.

Sizing: 1-2 sprints (bootstrap = 1, excerpts + autolinking = 1). Can partially ship in parallel with #5.

### 7. Claude-authored sync V1 — roasting slice (sub-sprint 2)

The roasting half of V1. See candidate #2's "Deferred to sub-sprint 2" block for scope. Fires strictly after sub-sprint 1 has a resolved brew going through the pipe cleanly, not before. Forcing roasting through sync before brews is proven loses the "lower cognitive load on the active pain" sequencing win.

### 8. Event-driven bean uploads (not a sprint, recurring task)

Now that the /add flow works end-to-end (PR #25), this is ergonomic: Chris pastes each bean's 9 tabs through the wizard on resolution. Mandela XO + Sudan Rume Hybrid Washed expected ~Apr-May 2026. Each is a one-sitting upload, no sprint needed. Will move to the V1-roasting sync path once #7 ships.

### Blocked / parked

- **A: Claude-Design-led redesign** — waiting on Chris's Claude Design (claude.ai/design) output. Current design is "pretty good" in the meantime. Anything shipped in self-roasted sprints must stay modular enough for the eventual redesign to re-skin (route through SectionCard, Tag, TagLinkList, .label; no new tokens / colors / spacing unless a canonical registry requires it). **Scope note:** when this fires, explicitly re-examine desktop vs. mobile as a first-class design consideration — current rule is "desktop-first with mobile spot-check", and the redesign is the right moment to revisit whether that's still the correct balance given how the app is actually used.

### Side-quests (logged, do not auto-queue)

- **Split `brews.producer` into `producer_name` + `farm_name`** — the "Person, Farm" convention is locked, a clean comma-parse. Valuable for roasting-side Instagram outreach. Fires when the use case fires, not before.
- **Edit-form mobile polish** — `/brews/[id]/edit` grid-cols-2 truncates longer canonical values at 375px. Own sprint, post-redesign probably.
- **Roaster/producer conflation cleanup (flagged 2026-04-21)** — on at least one brew Chris noticed Hydrangea (a roaster) in the producer column. Small data-cleanup audit — query for all rows where `brews.producer` matches a value in `lib/roaster-registry.ts`, review, correct. While we're in there, check whether any other registry cross-contamination exists (e.g. roaster values in other canonical-registry columns, or vice versa). Post-migration-018 the registries are canonical but the data still has some pre-canonical rows with wrong-column values.
- **Producers aggregation starting point** — the mechanical 1-day "copy the /roasters pattern" sprint that would be the foundation of the "Producers as a first-class citizen" Medium-term feature. See Future Directions § Medium-term for the full framing. Unblock when 2+ producers have 3+ brews each.
- **Port EG-1 grind-size analysis into BREWING.md** — Phylum C of the Reference Taxonomies umbrella (see candidate #1). Chris already authored the grind-size analysis externally; this side-quest ports it into a new BREWING.md section. Scope is explicitly EG-1 only. Likely 1-hour task — too small to earn its own feature doc. Fires when Chris is ready to drop the external doc into the repo.

### How to apply (operational hints for future sessions)

- **Chris's default next task:** candidate #1, sub-sprint 1b — Variety taxonomy research. Chris-driven, not a Claude sprint. Fires when Chris dedicates session time to drafting `docs/taxonomies/varieties.md`.
- **Claude's default next task:** depends on Chris's signal. Two viable paths:
  - **(i)** Candidate #1 sub-sprint 1a — attribution scaffolding. Small independent Claude-driven unit. Can ship in parallel with Chris's research.
  - **(ii)** Candidate #2 sub-sprint 1, step (d) — V1-brews sync dog-food. Ready to fire pending the 3 pre-reqs flagged by step (c) dry-run (one of which resolves through Chris's Variety research).
- **Candidate #1 sub-sprint 1c (Variety port)** fires strictly after 1b hands over a final draft. Do NOT attempt to pre-populate `docs/taxonomies/varieties.md` from training data — Chris owns the research, Claude vets + ports. Sub-sprint 1c enriches the existing `lib/cultivar-registry.ts` (from candidate #2 step b) with curated canonical content + authored reference material.
- **Candidate #2 step (d)** — dog-food surfaces real friction. Don't short-circuit: the point is finding what the speculative design missed.
- **Candidate #3** is plan-mode territory when it fires — don't start without a real bean loaded for preview verification.
- **Candidate #7 (V1-roasting slice)** fires strictly after #2 has been dog-fooded against a real backlog brew. Don't short-circuit the sequencing.
- **When queue priorities change**, edit this section directly — don't maintain a parallel copy in `memory/project_sprint_roadmap.md` (that file is now a pointer to this section).
- **When a sprint lands**, add a one-line entry to [Shipped Sprints](#shipped-sprints), write a retrospective `memory/project_[sprint-name].md`, and remove the candidate from this queue.

---

## Future Directions

These are ideas and patterns that have emerged from the data, not yet scoped into the Active Sprint Queue.

### Near-term (data foundation)

- **Split `brews.producer` into `producer_name` + `farm_name`** — the "Person, Farm" convention (now locked post migration 018) makes this a clean parse. Valuable for the roasting side: reaching out to farms directly on Instagram for future sourcing needs the person and the farm as separate fields. (Also in Active Sprint Queue § Side-quests.)
- **Backfill remaining what_i_learned** — ~19 brews still missing long-form learnings.

### Medium-term (knowledge compounding)

- **Producers as a first-class citizen (needs dedicated brainstorm session — first-principles)** — today producers are a canonical free-text column on brews (49 canonical names post migration 018). Surface-level goal: treat producers the way `/roasters` and `/terroirs` and `/cultivars` are treated — index + detail + synthesis. But the real question goes deeper than "make a page." **What does Chris fundamentally want to get out of producers as a data dimension?** Sourcing intelligence (which farms have I bought from, which importers represent them, what does this producer's other work taste like)? Farm-level lineage tracking (multiple lots from the same farm over time)? Relationship-graph mapping (producer → farm → importer → roaster)? Possibly all three, possibly a different framing entirely. Mechanical starting point is still a 1-day "copy the /roasters pattern" sprint, but the brainstorm should precede that — use the reference-roast brainstorm pattern (four-part interpretive session, probes, reference artifacts, output = `docs/features/*.md` scoping doc). Open thread: **farm** + **importer** as sub-dimensions of producer; whether `brews.producer` stays flat or splits into `producer_name` + `farm_name` + `importer_id`. Deferred until the corpus has signal (currently only Pepe Jijon / Finca Soledad has 3+ brews); the wait also gives the brainstorm time to bake before committing the data shape.
- **Reference taxonomies umbrella (scoped 2026-04-21, now in Active Sprint Queue candidate #1)** — brainstormed in a four-part interpretive session. Full scope in [docs/features/reference-taxonomies-attribution.md](docs/features/reference-taxonomies-attribution.md) (meta) + 5 sibling per-taxonomy docs ([region](docs/features/reference-taxonomies-region.md), [variety](docs/features/reference-taxonomies-variety.md), [process](docs/features/reference-taxonomies-process.md), [dripper](docs/features/reference-taxonomies-dripper.md), [flavor](docs/features/reference-taxonomies-flavor.md)). Value prop: *preload canonical knowledge, compound observations against it*. Key decisions: single-pipeline authoring (Chris is always the author; external sources cited at page bottom); voice-only signal for tested vs untested claims; external claims never graduate (stay cited forever); no source whitelist; enforcement bar varies per taxonomy (strict for region/variety/process/dripper, loose for flavor). Dropped from original scoping: tag-cleanup UI (eliminated by enforcement), new `/drippers` top-level page (content lives in BREWING.md), `brews.brewer` FK migration (lib registry is sufficient), standalone grind-analysis doc (content lives in BREWING.md as Phylum C side-quest).
- **Extraction strategy patterns** — the three strategies (Clarity-First, Balanced Intensity, Full Expression) are a core part of the brewing framework. A view showing which coffees confirmed which strategy, organized by variety × process, would be directly useful for recipe design.
- **Cooling behavior tracking** — many brews have critical evaluation temperature thresholds (e.g., "do not evaluate before 50°C", "rose character only emerges near 40°C"). This is scattered in temperature_evolution and what_i_learned but not structured or searchable.

### Longer-term (workflow integration)

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
- **When an existing taxonomy is in scope, mirror it before inventing.** The roasters sprint started with a brainstormed family shape (Ethereal / Structured Sweet / Anaerobic-friendly) — but the BMR doc already groups every roaster by an extraction-strategy tag (CLARITY-FIRST / BALANCED / FULL EXPRESSION / VARIES). Mirroring that taxonomy directly was both more accurate (Sey is FULL EXPRESSION, not "Ethereal") and more useful (the family answers "what should I expect when a new bag arrives" — already Chris's mental model). When a sprint's interpretive call has a documented external source, default to mirroring instead of inventing.
- **Pause-for-research is cheap when the cards are small and bounded.** The roasters sprint paused mid-execution for Chris to research 7 BMR-less roasters (~20 minutes of his time, structured request format with brew-anchors). Net result: full registry on first push instead of 7 placeholders + a follow-up edit pass. The trigger pattern: when a finite list of metadata is needed, the user has source access, and the alternative is shipping with `// TODO: fill in`, ask once and ship complete.
- **A "design-system adoption" sprint for a reverse-engineered design system is a cleanup sprint.** The Claude-Design folder was documentation derived from the code, not a new aesthetic to adopt. The real scope was: standardize arbitrary sizes into named tokens (`text-chip` / `text-micro`), dedupe duplicated palette constants (country + family), route the last inline card/tag reimplementations through the canonical components, align the `SectionCard` title to the documented `.label` pattern. Net: -123 / +52 lines across 20 files, one new tailwind fontSize extension, two new `lib/*-colors.ts` files. When "applying a design system" that was reverse-engineered, the audit step is the whole sprint; the execution is mechanical.
- **Tailwind `theme.extend` changes don't hot-reload in `next dev`.** Added `text-chip` + `text-micro` to `tailwind.config.ts`, verified in the browser, saw 16px (the browser default) on the strategy pill because the class simply wasn't generated. `preview_stop` + `preview_start` fixed it. The class existed in source but not in the compiled CSS, and the visual was misleading (pills looked "fine-ish" at default size). When adding a theme token mid-session, restart the dev server before trusting the preview. This is a notable exception to "HMR handles everything" in Next 14.
- **/simplify catches dead-equivalent code that earlier sprints missed.** `brews/[id]/page.tsx` had a local `Section` and `Tag` defined inline — literal re-implementations of the canonical `SectionCard` + `Tag` components. Previous sprints migrated the 3 aggregation detail pages + the 4 synthesis components; this page got skipped because its inline dupes predated the canonical extraction. The visual regression risk was zero (identical chrome) but the drift risk was real. Whenever extracting a primitive, follow up with a grep for the inline shape — not just the sprint's touched files.

**Refactor / reuse**
- **Extract on the 2nd duplication, not the 4th.** `<TagLinkList>` (SectionCard + Tag + Link triplet) was duplicated 6+ times across 4 aggregation detail pages within the roasters sprint alone. /simplify caught it with high confidence and the extraction was a 30-line component. The pattern was visible from the 3rd copy; waiting for the 6th was scope drift. Apply the CLAUDE.md "factor on 2+ duplications" rule earlier next time.
- **Factor canonical-registry boilerplate behind a factory.** Migration 018 added producer + roaster canonical-lookup helpers that were byte-for-byte copies of the pair already in `lib/flavor-registry.ts` (3-tier classifier: trim → case-insensitive set lookup → substring both directions → 3-char prefix match, shortest wins). /simplify flagged it immediately; extracting `makeCanonicalLookup(names)` into `lib/canonical-registry.ts` collapsed 3 copies into one factory, pre-computed the lowercase array once (was re-computing per keystroke in the substring loop), and made the `CanonicalTextInput` prop surface collapse from 6 props to 3 (bundle `list` + `isCanonical` + `findClosest` into one `CanonicalLookup` object). Next time a canonical string-registry ships, route through the factory from the first commit - don't wait for /simplify.
- **Forward-compatibility via string convention, not schema.** Producer is one free-text column but the data has a dominant "Person, Farm" shape across the corpus. Migration 018 locked the convention (Pepe Jijon → "Pepe Jijon, Finca Soledad", Julio Madrid (La Riviera farm) → "Julio Madrid, La Riviera") rather than splitting the column into `producer_name` + `farm_name` this sprint. The split, when it comes, is now a clean parse on the comma. Pattern: when a future schema split is plausible but not committed, pick the string convention that makes the split trivial, document it in the registry comment, don't commit the split until the use case fires. Keeps the sprint small and preserves the option.
- **Aliases as a tier-0 of the canonical factory, not per-registry wrapping.** The cultivar registry needed "Geisha" → "Gesha" (trade-name spelling → botanical canonical). The existing 3-tier classifier (exact → substring → 3-char prefix) returned null because the two strings share neither a 3-char prefix nor a substring match. Two options: extend `makeCanonicalLookup` with an optional `aliases` map (tier-0 before the existing tiers), or wrap per-registry. Chose factory extension — uniform API across all 5 registries, backwards-compatible (existing call sites pass nothing), and future registries with known trade-name drift can declare it inline. Pattern: when a drift class is reusable across registries, extend the factory; when it's dataset-specific, wrap at the registry. Aliases are reusable (every canonical registry potentially has trade-name drift); they belong in the factory.

**Data**
- A field's UI label is a claim about its semantics. The `roaster` fallback into the producer slot broke this — the card read "producer: Hydrangea" but the underlying data said "roaster: Hydrangea". Either add the missing column or label the slot honestly; don't conflate.
- The extraction_confirmed → extraction_strategy relationship is a "did plan match taste" audit trail, not a duplicate field. Show it only on divergence; a field that's identical to another 80% of the time reads as noise.
- Before designing around a field, check population: `what_i_learned` was 56/56 but `extraction_confirmed` was 14/56 — that ratio changed the design choice (surface the former broadly, hide the latter conditionally).
- Not every aggregation dimension needs an FK. `brews.process` is free-text with ~20 values; a `lib/<x>-families.ts` lookup gave us family grouping + colors without a migration or join. Only reach for a table when the dimension needs its own metadata (synthesis cache, which we did add).
- **Canonical enforcement at sync time requires per-field parseability upstream.** The V1-brews sync architecture (candidate #1) is "paste archive block → validate each field against a canonical registry → write." That plan can't execute if the archive format smashes multiple canonical-registry values into one prose blob. F1 (add Terroir + Cultivar as explicit rows) and F2 (split the "Coffee" blob into 7 discrete fields) in the `BREWING.md` migration were the pre-conditions for step (b) and (c) to be possible at all — without them, step (c)'s SYNC.md playbook would have had to do prose extraction on every paste. Pattern: when designing a sync or validation pipeline, audit the source format first. If the source smashes N canonical values into 1 field, the spec fix (split the field) has to land before the code sprint — not during it.

**AI synthesis framing**
- A synthesis prompt is a stance, not a summary. Without explicit framing, Claude defaulted to "Chris prefers clean" — so the /processes prompt had to say "palate has widened, focus on when this style delivers vs. when it goes off." When the aggregation dimension is value-laden (process, roast style, anything with good/bad connotations), the prompt needs to declare that values are not the goal; mechanics are.

**Build / tooling**
- `strict: false` with `strictNullChecks: true` is the current baseline. Discriminated-union narrowing depends on `strictNullChecks`. Do not turn it off without first refactoring `PersistResult` / `ValidationResult` / `TerroirMatch` / `CultivarMatch`.
- The worktree can't run `npm run build` (missing `@anthropic-ai/sdk`). Use `npx tsc --noEmit` in the main repo dir as a build proxy before pushing. Relying on Vercel to catch type errors cost one failed deploy.
- Keep PRs scoped. PR #9 shipped with type-narrowing issues that only surfaced when PR #10 triggered a fresh Vercel build. If `next build` had run locally as part of #9's checklist, we'd have caught it at the source.

---

## Shipped Sprints

Compact reverse-chronological index. Richer narrative per-sprint prose lives in [Current App State § Recently completed](#recently-completed-april-2026). Per-sprint retrospectives live in `memory/project_*.md` (one file per sprint).

| Date | Sprint | Landmark |
|---|---|---|
| 2026-04-21 | SYNC.md playbook (V1-brews sync sub-sprint 1, step c) | `SYNC.md` at repo root — validator-table-driven, dry-run against Picolot Emerald |
| 2026-04-21 | Terroir + cultivar canonical registries (V1-brews sync sub-sprint 1, step b) | PR #30 — `lib/terroir-registry.ts` + `lib/cultivar-registry.ts` + factory alias tier |
| 2026-04-22 | Producer + roaster canonicalization | PR #23 + migration 018 |
| 2026-04-21 | BMR v7.1 → `BREWING.md` (V1-brews sync sub-sprint 1, step a) | PR #27 — `BREWING.md` at repo root |
| 2026-04-21 | Reference Roasts + Roasting Guide — brainstorm + feature doc | `docs/features/reference-roast-and-guide.md` |
| 2026-04-21 | Mobile polish on /brews, /brews/[id], filter bar | — |
| 2026-04-21 | Cross-dim filters on /brews | — |
| 2026-04-20 | Self-roasted flow audit + /add hardening | PR #25 + migration 020 |
| 2026-04-20 | Green detail render polish | — |
| 2026-04-20 | Data-depth backfill (terroirs + cultivars) | Migrations 015 / 016 / 017 |
| 2026-04-19 | Experiments import + render polish | Migration 019 |
| 2026-04-19 | Design-system standardization | — |
| 2026-04-19 | Cross-link backfill across aggregation detail pages | — |
| 2026-04-18 | Roasters aggregation | Migration 014 |
| 2026-04-17 | Design polish + mobile pass | PR #14 |
| 2026-04-17 | Flavor canonicalization + edit UI | Migration 013 |
| 2026-04-16 | Processes aggregation | Migration 012 |
| 2026-04-16 | Producer column + backfill | PR #12 + migration 011 |
| 2026-04-16 | Extraction strategy sprint | PRs #10 / #11 |
| 2026-04-15 | Terroir macro redesign | PR #5 |
| 2026-04-14 | Cultivar lineage redesign | PR #4 |
| (earlier) | Purchased-coffee import flow, build hygiene, initial schema + backfills | PR #9 + migrations 001-010 |

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
| 014 | Roasters aggregation: normalize `Luminous Coffee` → `Luminous` (1 row); create roaster_syntheses cache table with RLS. |
