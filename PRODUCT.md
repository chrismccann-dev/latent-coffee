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
  │                        (no FK; brews.process is free-text, families in lib/process-registry.ts)
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

**Cultivar Registry** — genetic taxonomy (adopted 2026-04-22, [docs/taxonomies/varieties.md](docs/taxonomies/varieties.md) authoritative, [lib/cultivar-registry.ts](lib/cultivar-registry.ts) validation mirror):
- 4 species: Arabica (dominant) + Eugenioides / Liberica / Robusta (scaffolded for future non-Arabica lots)
- 8 Genetic Families: 5 Arabica (Ethiopian Landrace Families, Typica Family, Bourbon Family, Typica × Bourbon Crosses, Modern Hybrids) + 3 non-Arabica self-referential (Eugenioides, Liberica, Robusta)
- 20 lineages — branches within families, strictly genetic (not behavioral)
- 63 canonical cultivars + 48 structural aliases (trade-name drift, color variants, diacritic fixes, sub-selection collapses)
- Cultivar names must resolve to the canonical registry via the 3-tier classifier (exact → alias → substring → prefix)
- Marketing names are normalized (e.g., "Geisha" → "Gesha", "Bourbon Aruzi" → "Aruzi", "Catimor Group" → "Catimor (group)", "Mocha" / "Moka" → "Mokka")
- Blends are cultivars, not lineages (e.g., `74158/74110/74112 blend`, `Ethiopian Landrace Blend (74110/74112)`, `Red Bourbon / Mibirizi blend`)
- "Ethiopian landrace population" is the default for unidentified Ethiopian coffees
- Adding a new canonical entry is a 3-step edit: (1) `docs/taxonomies/varieties.md` per-cultivar section, (2) `lib/cultivar-registry.ts` `CULTIVARS` array, (3) DB migration if an existing row needs renaming

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
- **Processes aggregation (migration 012)** — third aggregation dimension alongside terroirs + cultivars. `/processes` index groups 20 distinct process values into 5 families (Washed / Natural / Honey / Anaerobic / Experimental) via `lib/process-registry.ts` (renamed from `lib/process-families.ts` in sprint 1e.1, 2026-04-23). Detail pages aggregate brews per process with palate-aware synthesis (explicitly primed that Chris's palate has widened beyond clean-washed — the prompt asks when each style *delivers vs. goes off*, not which is best). Migration normalizes casing + merges `Classic Natural` into `Natural`. Synthesis cached in new `process_syntheses` table. `<StrategyPill>` extracted to `components/StrategyPill.tsx` — consolidates 4 copies across brews-list, terroir-detail, cultivar-detail, processes-detail (2 variants: row + card).
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
- **Variety content backfill (Reference Taxonomies sub-sprint 1a.2, PR #36 + migration 022)** — materializes `docs/taxonomies/varieties.md` into the `cultivars` DB table so `/cultivars/[id]` detail pages render the 2026-04-22 research without waiting for sprint 1b's enforcement or a per-cultivar render refactor. 26 UPDATEs, 18 attribute columns per row (13 text + 5 array). Overwrite mode — `varieties.md` is now the canonical source; migrations 010 and 017 are superseded. 13 previously-sparse rows (Bourbon / Caturra blend, Caturra, Garnica, Java, Marsellesa, Pink Bourbon, Purple Caturra, Red Bourbon, Red Bourbon / Mibirizi blend, Rosado, Sidra, Sudan Rume, Pacamara) are now fully populated. Zero schema change, zero code change, zero FK change. Surfaced pre-existing observation: for multi-cultivar lineages, `/cultivars/[id]` first-non-null merge means Pink Bourbon / Java / Rosado / Sudan Rume specific content is correctly stored but shadowed by Ethiopian landrace population's content on the lineage detail render — design inherited from the cultivar lineage redesign (PR #4); a per-cultivar subsection render is a downstream candidate, not blocking 1b.
- **Region content backfill (Reference Taxonomies sub-sprint 1d.2, migration 024)** — materializes `docs/taxonomies/regions.md` into the `terroirs` DB table so `/terroirs/[id]` detail pages render the canonical macro-level content without waiting for sprint 1d.3's enforcement. 22 UPDATEs, 11 content columns per row (8 text + 2 int for elevation + 2 array). Overwrite mode — `regions.md` is the canonical source; migration 009 (pre-1d.1 stopgap from an older Terroirs spreadsheet) is superseded. Pre-sprint audit: every DB `macro_terroir` already resolves cleanly to a `TERROIR_MACROS` canonical (1d.1 exhaustive cross-check stuck; zero reclassifications needed on the follow-on). **Two interpretive calls locked in plan-mode vet:** `climate_stress` shifts from one-word enum values (cool/temperate/warm) to free-text regions.md Climate Regime (e.g. "warm, distinct dry season, moderate rainfall"; "cool, frequent cloud cover, strong diurnal shifts") — column was already `text`, richer signal for future synthesis, same precedent as the 1d.1 meso/micro free-text demotion; `typical_processing` Title Case mapped through `lib/process-registry.ts` canonical so /processes cross-linking stays coherent, `dominant_varieties` preserves regions.md wording exactly. `meso_terroir` column untouched (row-level free-text per 1d.1 decision). Zero schema change, zero code change, zero FK change — 55 brew FKs intact post-apply. Surfaced observation: Yunnan Central's elevation floor shifted from DB 900m to canonical 1400m, consistent with Dehong prefecture's regions.md classification; the specific brew's altitude (if surfaced) would live on the bean row, not the terroir. True half-sprint — plan + vet + 1 AskUserQuestion + author + apply + verify + docs ≈ 40 min. See `memory/project_region_taxonomy_content_backfill.md` for full retro.
- **Region structural port (Reference Taxonomies sub-sprint 1d.1, migration 023)** — second Phylum A1 port to land; mirror of Variety 1a.1. Chris's research CSV (126 rows) + one hand-authored extension (Bench Sheko Highlands, Ethiopia South West for the Gesha Village system) expanded the feature doc's ~21-macro estimate to 121 canonical macros across 38 countries (127 country-scoped entries; macros like Lake Kivu Highlands span multiple countries and appear as multiple rows) — same 6× scope expansion Variety showed vs. its feature doc. **Content:** `docs/taxonomies/regions.md` (~3560 lines) authored from the CSV + Bench Sheko extension using the 14-field per-macro template (Context / Elevation Band / Climate / Soil / Farming Model / Dominant Varieties / Typical Processing / Cup Profile / Acidity Character / Body Character / Why It Stands Out, plus Country / Admin Regions / Typical Meso Terroirs as reference headers). Authoritative source; DB columns become materialization (sprint 1d.2 backfill). **Registry:** `lib/terroir-registry.ts` refactored flat 3-bundle (13 countries / 19 macros / 22 mesos as string arrays) → rich `TerroirEntry[]` shape (country / admin_region / macro_terroir per row). `TERROIR_COUNTRIES` + `TERROIR_MACROS` preserved as derived legacy exports. Adds `getTerroirEntry(country, macro)` / `resolveTerroirMacro(macro)` helpers + `TERROIR_MACRO_LOOKUP` / `TERROIR_COUNTRY_LOOKUP` / `isCanonicalMacroTerroir` / `findClosestMacroTerroir`. 12-entry alias map (7 rename drift: `Acatenango Volcanic Highlands` / `Costa Rican Central Volcanic Highlands` → `Central Volcanic Highlands`, `Huehuetenango Highlands` → `Western Dry Highlands`, `Marcala Highlands` → `Central Honduras Highlands`, `Sierra Sur Highlands` → `Oaxaca Southern Highlands`, `Southern Andean Cordillera` → `Western Andean Cordillera`, `Yunnan Monsoonal Highlands` → `Yunnan Central Highlands`; 5 diacritic-free: `Volcan Baru Highlands`, `Espirito Santo Highlands`, `Pinar del Rio Western Highlands`, `Balsamo Volcanic Belt`, `Alotepec-Metapan Highlands`). **Meso / micro demoted:** Chris's CSV confirmed every behavioral attribute is macro-scoped; meso + micro carry no distinct aggregation signal. `TERROIR_MESOS` / `TERROIR_MESO_LOOKUP` deleted; the `terroirs.meso_terroir` DB column is retained but becomes free-text pass-through everywhere (SYNC validator row 5, /add, edit form). Producer-level locality is the right home for farm / sub-region detail, via the planned `producer_name` + `farm_name` split. **Drift killed:** `lib/brew-import.ts` retires its local `TERROIR_REGISTRY` (22 entries, 19 unique macros) + `TerroirRegistryEntry` interface, re-exports from `terroir-registry.ts`. Same pattern as Variety. `matchTerroir` meso tiebreak removed; admin tiebreak preserved. **Structural migration 023:** 11 DB-row macro_terroir renames / reclassifications preserving all 55 brew FKs — Guatemala Acatenango / Huehuetenango / Costa Rica macros renamed to CSV canonicals (country prefix dropped); Colombia Cauca moves from Southern → Western Andean Cordillera (Southern Andean Cordillera ceases to exist as a Colombia macro); Colombia Antioquia moves from Western → Central Andean Cordillera (CSV row 31 vs the pre-1d.1 mis-tag); Peru + Ecuador Northern Andean Cordillera → Northern Andean Highlands (CSV name split: "Cordillera" is Colombia-only); China Yunnan Monsoonal → Yunnan Central (default given generic admin); Burundi Kayanza moves from Lake Kivu → Mumirwa Escarpment (Lake Kivu in CSV is DR Congo + Rwanda only). **Post-migration DB state:** 22 rows / 19 distinct macros / 55 brew FKs intact. **Retro vs. Variety 1a.1:** pre-sprint dual-registry audit ran clean (found the same class of drift); Python script generating both markdown and TS from CSV avoided transcription errors on 127 × 14 cells; Chris's meso/micro deprecation question answered with strong CSV evidence (every attribute macro-scoped). **Content backfill (1d.2)** and **CanonicalTextInput enforcement (1d.3)** queued as the next two Claude sprints; per-macro "Observed Across My Corpus" deferred to Chris-driven authoring.
- **Region enforcement (Reference Taxonomies sub-sprint 1d.3)** — closes the Region slice of the umbrella (1d.1 structural + 1d.2 content + **1d.3 enforcement**). Mirror of Variety 1b. `CanonicalTextInput` swapped in on `/add` purchased review step 6 + `/brews/[id]/edit` macro_terroir inputs, backed by `TERROIR_MACRO_LOOKUP` (121 canonicals + 12 aliases) and `TERROIR_COUNTRY_LOOKUP` (38 countries). `/edit` also gains a meso free-text input (replacing the previous `<select>` of DB rows). `/add` step 6 gains an `updateMacroTerroir` wrapper that auto-populates admin_region from `getTerroirEntry(country, macro)` when the macro resolves canonically AND admin_region is empty — parallels `updateCultivarName`'s auto-populate of species/family/lineage. PATCH `/api/brews/[id]` drops `terroir_id` from its whitelist; accepts `terroir_name` + `country` (+ optional `admin_region` / `meso_terroir`) and resolves to `terroir_id` server-side via the new `findOrCreateTerroir(supabase, userId, country, rawMacro, adminOverride?, mesoOverride?)` helper. `findOrCreateCultivar` + `findOrCreateTerroir` extracted into `lib/brew-import.ts` — collapses ~55 lines of inline PATCH code that Variety 1b introduced. `findOrCreateCultivar` uses `resolveCultivar` from `lib/cultivar-registry.ts` (caught in /simplify pass); `findOrCreateTerroir` wraps `matchTerroir` and adds canonicalization. Admin_region drift on 6 existing DB rows (DB has province-specific "Kayanza Province" vs registry grouping "Kayanza / Muramvya / Mwaro") left untouched — `matchTerroir` filters on `(country, macro_terroir)` only, so no duplicate-creation risk. Meso free-text pass-through on both surfaces (per 1d.1). Code-only sprint, no migration. Preview-verified end-to-end on 2 real brews (Alo Village Ethiopia, Colibri Gesha Panama) — happy path, alias resolution ("Volcan Baru" → "Volcán Barú"), unresolvable rejection, and new-canonical creation with auto-populated admin ("Yirgacheffe Highlands" → admin "Gedeo"). Flagged as follow-ups (not blocking): `components/CanonicalTextInput.tsx:49` stale copy ("will be saved as free-text" now wrong since 1b's save-gate); `/brews/[id]/edit/page.tsx` over-fetches full `terroirs` + `cultivars` tables when only the currently-linked rows are needed (trim via `.eq('id', brew.terroir_id).single()` or FK hydration in the brew SELECT). See `memory/project_region_taxonomy_enforcement.md` for full retro.

- **Variety taxonomy adoption (Reference Taxonomies sub-sprint 1a.1, PR #34 + migration 021)** — first-shipped deliverable of the umbrella scoped 2026-04-21. Compressed the attribution scaffolding (1a) + Variety research (1b) + Variety port (1c) into one sprint because Chris's CSV research came back meaningfully wider than the feature doc scope (72 entries → 63 canonical after vet + collapse, vs. the ~20 original estimate). **Content:** `docs/taxonomies/varieties.md` (~1500 lines) authored from the CSV using the 18-field content template — authoritative source for the taxonomy going forward; DB content columns become materialization, not source-of-truth. **Registry:** `lib/cultivar-registry.ts` refactored flat-string-list → rich `CultivarEntry[]` (name / species / family / lineage) + 48-entry alias map; preserves legacy exports (CULTIVAR_NAMES / CULTIVAR_LINEAGES / CULTIVAR_LOOKUP) for back-compat. Adds `getCultivarEntry` / `resolveCultivar` helpers. **Drift killed:** `lib/brew-import.ts` retires its local `CULTIVAR_REGISTRY` + `GENETIC_FAMILIES`, re-exports from cultivar-registry.ts — collapses 7+ pre-existing inconsistencies between the two registries (en-dash vs hyphen, stale Garnica family, divergent 74110/74112 lineage, Gesha 5 vs 1, etc.). `lib/cultivar-family-colors.ts` adds Eugenioides / Liberica / Robusta colors; removes orphan SL Selections family color. **Structural migration 021:** 4 renames preserving all 56 brew FKs — Bourbon Aruzi → Aruzi (canonical naming alignment with Caturra / Laurina); Catimor Group → Catimor (group) (group-label convention, same treatment for new `Sarchimor (group)`); 74110/74112 → Ethiopian Landrace Blend (74110/74112) under JARC blend lineage (the Heart Tagel Alemayehu brew is a genuinely-mixed lot; pure-lot 74110 / 74112 become separate canonicals for future use); Laurina moved to Bourbon mutation lineage (CSV research corrected the prior Bourbon classic placement). **Side effects:** Mokka locked as Bourbon Family / Bourbon (classic) resolves 1 of 3 SYNC V1 step (d) pre-reqs; Icatu reclassified from Timor Hybrid-derived to Multi-parent hybrid lineage (direct Arabica × Robusta introgression, not Timor); Rosado kept separate from Pink Bourbon (aliases doc said merge; CSV framed per-lot uncertainty); non-Arabica species (Eugenioides / Liberica / Robusta) scaffolded in the registry for future lots. **Content backfill (sub-sprint 1a.2)** and **CanonicalTextInput enforcement (sub-sprint 1b)** queued as the next two Claude sprints. Per-cultivar "Observed Across My Corpus" corpus distillation deferred to sub-sprint 1c (Chris-driven authoring).

- **Roaster taxonomy structural port (Reference Taxonomies sub-sprint 1h.1, 2026-04-24, migration 027)** — second roaster-shaped Phylum A1 port of the umbrella (after Variety + Region) but with a twist: existing 21-canonical registry + rich `ROASTER_METADATA` cards already in place from the 2026-04-18 roasters-aggregation sprint and the 2026-04-22 producer-roaster canonicalization sprint. Sprint extended that to **70 canonical roasters** (Chris's authored CSV: 64 + 5 currently-brewed extras supplied at plan-time: TM Coffee / Colibri Coffee Roasters / Olympia Coffee / Rose Coffee / Noma Coffee + Latent self-roasted) across **6 families** — added **SYSTEM** as a 6th family per Chris + ChatGPT review (control-loop-identity roasters whose recipes change per coffee against TDS/EY targets: Subtext, Picky Chemist, Ona, Rose Coffee, Noma Coffee). SYSTEM is orthogonal to Clarity/Balanced/Full extraction-level framing — the SYSTEM definition Chris authored: "brewing as an optimization problem, not a recipe; CLARITY = don't over-extract; FULL = push extraction; SYSTEM = control extraction precisely." 4 strategy reclassifications dropped out: Rose Coffee (BALANCED → FULL → SYSTEM, Winton 5-pour is engineered control), Noma Coffee (BALANCED → FULL → SYSTEM, Method-driven), Picky Chemist (FULL EXPRESSION → SYSTEM, fixed grind / fixed water / engineered repeatability), TM Coffee (BALANCED → CLARITY-FIRST per CSV, ultra-light Okinawan house style). **Content:** [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md) (~1730 lines) authored from CSV using a 29-field per-entry template (location/country, roast style, development bias, rest curve, strategy tag, primary driver, extraction purpose, house style, brew guide source/link/type, recipe baseline temp/dose/water/ratio/time/agitation, primary brewer, filter type, extraction intent, failure mode, over-extraction tolerance, process sensitivity, brew adjustment method, calibration role, confidence, notes). **Registry:** [lib/roaster-registry.ts](lib/roaster-registry.ts) refactored flat → rich `RoasterEntry[]`. New types + helpers: `ROASTER_FAMILIES` extended to 6, `ROASTER_STRATEGY_TAGS` (10 + SELF-ROASTED), `STRATEGY_TAG_FAMILY` map + `familyForStrategyTag(tag)`, `getRoasterEntry(name)`, `getDisplayName(name)`. Hue-separated palette: System color `#7B5A78` (warm-purple, distinct from Varies' muted `#8B6B7B` and Self-Roasted's dark-brown `#5A4A45`). Optional `displayName` field for tight UI surfaces — preserves Chris's existing short-form aesthetic ("Moonwake" not "Moonwake Coffee Roasters") on `/brews` covers + `/roasters` index. Optional `bmrHouseStyle` / `bmrNotes` fields preserve the prior 21-entry registry's authored prose verbatim where richer than CSV (Hydrangea El Paraíso thermal-shock guidance, Sey Aeropress collab specifics, etc.). 24-entry alias map: 20 short-form aliases (`Moonwake` → `Moonwake Coffee Roasters` etc.) + 4 structural-drift / spelling variants (`Daturra Coffee` → `Datura Coffee`, `Datura` → `Datura Coffee`, `normlppl` → `normlppl/minmax`, `minmax` → `normlppl/minmax`). **Back-compat preserved verbatim:** `ROASTER_NAMES`, `ROASTER_METADATA`, `ROASTER_LOOKUP`, `getRoasterFamily`, `getFamilyColor`, `isCanonicalRoaster`, `findClosestRoaster` all derive from `ROASTERS` array — every existing consumer (`/roasters` index/detail, `/brews` filter bar, `/brews/[id]/edit` CanonicalTextInput, `/api/roasters/synthesize` prompt) continues working unchanged. **Migration 027:** 20 short-form `brews.roaster` UPDATEs + matching `roaster_syntheses` cache renames; 51 brew rows touched (1 unchanged — The Picky Chemist already canonical), 4 Latent self-roasted unchanged, 0 schema changes (no FK to a roasters table — `brews.roaster` stays text-only by design). **Light-touch UI:** `/brews/page.tsx` brew card line + `/roasters/page.tsx` index card label both swap to `getDisplayName(roaster) ?? roaster` to keep visual brevity post-migration. `/roasters/[slug]/page.tsx` hero + filter bar + synthesis route render unchanged via back-compat exports. **Verification:** typecheck clean, preview-verified end-to-end on `/roasters` (System pill renders for first time, 6 families with correct counts), `/roasters/Rose Coffee` detail (System family, BMR house-style preserved, 2 brews), `/brews` (cards retain short displayName, System filter pill present), `/brews/[id]/edit` on a Rose Coffee brew (typeahead has all 70 canonicals, alias `Rose` resolves to "did you mean Rose Coffee?"). **Out of scope (separate sprints):** 1h.2 enforcement on `/add` purchased review step + add-new escape hatch (Chris flagged: adding a new roaster is more likely than adding a new cultivar — strict pick-from-canonical with "add if needed" UX); rich-field UI surfacing on `/roasters/[slug]` (the 25 new CSV fields per entry — temp/dose/water/ratio/time/agitation/brewer/filter/etc. — could feed a richer detail page; deferred to a downstream UI sprint); synthesis prompt extension to consume new high-signal CSV fields (extractionIntent / failureMode / restCurve). **Retro vs. Variety/Region 1a.1/1d.1:** the existing 21-entry registry simplified the structural port (alias map seeds itself from the 20 short→full DB names; back-compat is a derived-from-rich-source cleanup, not a delta). Python script generating both .ts and .md from the parsed CSV avoided transcription errors on 70 × 30 cells. MCP supabase write was permission-blocked; Chris ran the migration manually via Supabase SQL Editor — same workflow precedent as earlier audit queries. The 5 currently-brewed-but-not-in-CSV roasters (D2 in plan-mode) was the only meaningful surprise — without the question, the registry would have shipped missing TM/Colibri/Olympia/Rose/Noma. The Rose + Noma SYSTEM reclassifications were a downstream win Chris flagged in his 5-row paste. See `memory/project_roaster_taxonomy_adoption.md` for full retro.

- **Process structural port (Reference Taxonomies sub-sprint 1e.1, 2026-04-23)** — first **Phylum A2** port of the umbrella (author new ruleset rather than port existing doc). Chris's CSV + aliases CSV revealed Process is fundamentally different in shape from Variety + Region: not a flat canonical list but a **composable taxonomy** (base + optional subprocess + up to 4 stackable modifier axes + decaf + signature). The design conversation (3 rounds pre-code) locked 6 decisions before plan-mode: Decaf demoted from base to modifier axis; subprocesses kept only for Honey color tiers (all other legacy "subprocesses" decompose to base + modifiers); Supernatural dropped from canonical and aliased to base:Natural (Robert's research: "diluted down to 'good natural'" — no consistent operation to codify); proprietary methods live on a new `signature_method` axis (Moonshadow / TyOxidator / Hybrid Washed); modifiers unordered; `/processes` page redesign deferred to 1e.4. **Content:** `docs/taxonomies/processes.md` authored from Chris's CSV + Robert (Moonwake) producer notes + the 20-row decomposition table for current `brews.process` values. Rich per-entity reference content (extraction framing, fingerprints, when-delivers-vs-off) deferred to a separate Chris-authored content-backfill sub-sprint. **Registry:** `lib/process-families.ts` renamed to `lib/process-registry.ts` and refactored from a 66-line flat `FAMILY_MAP` (23-string → 5-family) to a composable registry: 4 bases + 7 Honey subprocesses + 13 fermentation + 5 drying + 7 intervention + 4 experimental + 4 decaf modifiers + 3 signature methods, each axis getting its own `CanonicalLookup` via `makeCanonicalLookup`. ~70 aliases span all axes (Spanish terms, SWP/MWP/EA shorthand, oxidator → aerobic, anoxic → anaerobic, DRD → Dark Room Dried, etc.). New types + helpers: `StructuredProcess`, `composeProcess(structured)` → display string, `decomposeProcess(legacy)` → structured form, `LEGACY_DECOMPOSITIONS` with all 20 current DB values (4 cells tagged `TODO(1e.2)` for Chris to confirm at migration apply time: Anaerobic Honey subprocess tier, Moonshadow Washed base correction, Double Anaerobic Thermal Shock base, Double Fermentation Thermal Shock base). **Back-compat preserved verbatim:** `PROCESS_FAMILIES` + `ProcessFamily` type + `getProcessFamily` + `getFamilyColor` still work exactly as before — the 5-family classifier's `FAMILY_MAP` stays for exact back-compat on 2 edge cases (Moonshadow Washed → Washed family, TyOxidator → Anaerobic family) that structural derivation would reclassify; /simplify flagged removal as the cleaner shape but rejected since it violated zero-UI-change in 1e.1. 4 import sites updated (components/BrewsFilterBar.tsx + 3 app/(app) pages; `/processes/[slug]/page.tsx` was a 4th consumer the Explore survey missed — caught via final grep, confirming the standing "grep before claiming consumer list is complete" discipline). **Zero DB change. Zero UI change. Zero `brews.process` data change.** Schema migration (8 new structured columns on `brews`), decomposition of the 20 DB values via Chris's manual-confirm offer, `/add` + `/edit` picker rework, and `/processes` page redesign are queued as **1e.2 / 1e.3 / 1e.4**. See `memory/project_process_taxonomy_adoption.md` for full retro.

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
  - Process families: `lib/process-registry.ts` — 5 families × per-family hue (back-compat shape; post 1e.1 the file also exports the full composable process registry).
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

**Last reorder:** 2026-04-24 (**1m + 1h.2 bundled and shipped together**; 1k Grinder promoted to top Claude priority). **Sequencing:** ~~1i SR canonical rebuild~~ ✅ → ~~1h.1 Roaster structural port~~ ✅ → ~~1m Roast level + 1h.2 Roaster enforcement~~ ✅ → **1k Grinder** → 1l Producer → 1f Brewer+filter → 1g Flavor (Chris-parallel) → 2.1 V1-brews dog-food → 2.2-2.6 V2 brainstorm + build.

**Prior reorders:**
- **2026-04-24 (1m + 1h.2 ship):** Roast level + roaster /add enforcement bundled — both sprints touched `/add` purchased step 6 so they shipped in one PR to avoid two preview cycles on the same form. 1m: 8 Agtron-anchored canonical buckets (Extremely Light → Very Dark, 10-unit ranges) + 22 aliases (5 marketing tags + 17 drift variants). Marketing tags (Nordic / Ultra / Specialty / Modern / Omni Light) are aliases-only — semantic home is `roaster.roastStyle`, follow-up sprint 1h.3. 1h.2: `CanonicalTextInput` extended with `allowOverride` prop + inline "Use anyway" link below amber warning when input is non-resolvable; click flips to green-acknowledged "will save verbatim" hint. Used only on roaster (text-only column with no FK). `findOrCreateRoaster` extracted to `lib/brew-import.ts` for parity with cultivar / terroir helpers. Foundational addition: `canonicalize(input)` method on `CanonicalLookup` returns title-case canonical form on write paths — fixes a latent case-drift bug across all 5 registries (`isCanonical(v) ? v : findClosest(v) ?? v` previously persisted lowercase verbatim). Migration 028 backfilled 4 drift values on `brews.roast_level` (`Light roast` → `Light`, `light to medium` / `Light-medium` → `Medium Light`, legacy `Balanced Intensity` parser-misroute on Finca La Reserva Gesha → `Light`). Shared primitive extracted from /simplify pass: `components/SaveGateWarning.tsx` (de-dupes amber CANNOT SAVE YET block between /add and /edit). Surprise: MCP supabase write turns out NOT to be permission-blocked — UPDATEs ran fine; migration 028 applied directly without a Chris-step. See `memory/project_roast_level_taxonomy_adoption.md` for full retro.
- **2026-04-24 (1h.1 ship):** Roaster taxonomy structural port complete — 70 canonical roasters across 6 families (added SYSTEM as a 6th family per Chris + ChatGPT review for control-loop-identity roasters: Subtext, Picky Chemist, Ona, Rose Coffee, Noma Coffee). Migration 027 renamed 20 short-form DB values to canonical full names. 4 strategy reclassifications: Rose / Noma / Picky Chemist → SYSTEM; TM Coffee → CLARITY-FIRST. Rich `RoasterEntry` shape with 29 CSV fields per entry + `displayName` for tight UI surfaces. Adoption surface — 1h.2 enforcement (CanonicalTextInput on /add + add-new escape hatch since Chris adds new roasters more often than new cultivars) deferred but unblocks /add hardening alongside 1m.
- **2026-04-24 (sequencing reframe):** "all taxonomies first, then V2 brainstorm + build". Chris reframed the umbrella so every `/add` field has a canonical registry before candidate #2 V2 architecture is designed — the write payload then reduces to registry picks + structured recipe + free-text prose, with zero unknown validation surface for the brainstorm to solve. New taxonomy sub-sprints added: **1l Producer** (full A1-style port against the existing 49-canonical registry), **1m Roast level** (canonical bucket scale + Agtron ranges, straightforward), **1k Grinder + grind size** (absorbs EG-1 side-quest). **1f rescoped from "Dripper" to "Brewer + filter"** (two registries, often paired).
- **2026-04-24 (first pass):** candidate #2 rescoped from "Claude Code paste-driven V1-brews sync" to "Claude ↔ app bidirectional sync" — direct push from external `claude.ai` projects, app-served BREWING.md + ROASTING.md with read/write, all entity types not just brews. Original V1 step (d) dog-food preserved as sub-sprint 2.1. Roasting absorbed from candidate #7 into sub-sprint 2.6. Brainstorm flag + MVP upload mental model captured under candidate #2.
- **2026-04-23:** Process slice Claude-complete (1e.1 + 1e.2 + 1e.3). Roaster taxonomy CSV (64 canonicals) authored — promoted to sub-sprint 1h. Chris-parallel work: Flavor 1g authoring; Variety 1c + Region Observed distillation remain Chris-authored + deferred.

**Workflow rule that bounds what belongs in this queue:** per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves (green bean → roasts → experiments → cuppings → lessons → reference roast → perfected brew). The 5 mid-iteration beans not yet in the DB (CGLE Mandela XO / Sudan Rume Washed / Sudan Rume Natural / Forrest Gesha Clouds / Higuito Anaerobic Bourbon) are NOT a backlog — they land event-driven when Chris finalizes each bean, not on a sprint cadence. Do not propose a "backfill the 5 missing beans" sprint. Revisit when systematic Claude-driven sync exists.

### 1. Reference Taxonomies umbrella — Variety follow-ons + Region (ACTIVE, scoped 2026-04-21)

Brainstormed 2026-04-21 in a four-part interpretive session. Full scope in [docs/features/reference-taxonomies-attribution.md](docs/features/reference-taxonomies-attribution.md) (meta) + 5 sibling per-taxonomy docs (Region / Variety / Process / Dripper / Flavor).

**Value prop:** *preload canonical knowledge; compound observations against it.* Today aggregation pages (`/terroirs/[macro]`, `/cultivars/[id]`, `/processes/[slug]`) are empty for entities with no brews. Post-umbrella they render authored reference content the moment an entity enters the canonical registry — the first brew for a new cultivar adds observations against a preloaded framework instead of starting from zero. Also closes the drift loop: Chris's ChatGPT context doc has 14 macros, the DB has 21 — ~1 month of unenforced doc-primary drift. Porting the doc into the repo and making it the enforcement contract eliminates the drift source.

**Phyla map:**
- **A1 (port existing ruleset from Chris's Google Doc):** Region, Variety
- **A2 (author new ruleset with same discipline):** Process, Dripper, Flavor
- **C (placement only, not a taxonomy sprint):** Grind size — see § Side-quests

**Sub-sprint 1a.1 — Variety adoption (✅ shipped 2026-04-22, PR #34).** Attribution scaffolding + Variety research/vet/port compressed into one sprint because Chris's CSV came back richer than the original scope (72 entries → 63 canonical). `docs/taxonomies/varieties.md` authored as authoritative content. `lib/cultivar-registry.ts` refactored to rich `CultivarEntry[]` shape (name / species / family / lineage). `lib/brew-import.ts` CULTIVAR_REGISTRY retired — pre-existing dual-registry drift killed. `lib/cultivar-family-colors.ts` extended for non-Arabica. Migration 021 applied (4 structural changes: Bourbon Aruzi → Aruzi; Catimor Group → Catimor (group); 74110/74112 → Ethiopian Landrace Blend (74110/74112) + split into new 74110 / 74112 canonicals for pure-lot cases; Laurina Bourbon (classic) → Bourbon mutation lineage). Side-effect: Mokka classified, resolves SYNC V1 step (d) pre-req. See `memory/project_variety_taxonomy_adoption.md` for full retro.

**Sub-sprint 1a.2 — Variety content backfill (✅ shipped 2026-04-22, PR #36).** Migration 022 populates 18 attribute content columns (13 text + 5 array) on every existing DB cultivar row from the authored `varieties.md` content. 13 previously-sparse rows now fully populated (Bourbon / Caturra blend, Caturra, Garnica, Java, Marsellesa, Pink Bourbon, Purple Caturra, Red Bourbon, Red Bourbon / Mibirizi blend, Rosado, Sidra, Sudan Rume, Pacamara). Zero schema / code change. Surfaced pre-existing observation (flagged in PR body): for multi-cultivar lineages, /cultivars/[id]'s first-non-null merge means Pink Bourbon / Java / Rosado / Sudan Rume specific content is correctly stored but shadowed by Ethiopian landrace population's content on the lineage detail render. Per-cultivar subsection render is a downstream candidate, not blocking 1b.

**Sub-sprint 1b — Variety enforcement (✅ shipped 2026-04-22).** `CanonicalTextInput` swapped in on `/add` purchased review step 6 + `/brews/[id]/edit` cultivar input, backed by `CULTIVAR_LOOKUP` (63 canonicals + 48 aliases). PATCH `/api/brews/[id]` resolves `cultivar_name` → `cultivar_id` via find-or-create, auto-populating species/family/lineage from `getCultivarEntry()` on create. Architectural shift: edit-form "existing" flips from 26 DB rows to the 63-entry canonical registry; missing canonicals get created lazily the first time a user sets a brew to that name. `isResolvable` extracted onto `CanonicalLookup` for reuse across CanonicalTextInput consumers. Self-roasted `/add` step 8 surfaced as latent-broken during investigation (generic textarea, no parser, no structured fields — existing 4 SR brews saved via pre-PR #25 historical path); deferred to `/add` hardening side-quest. See `memory/project_variety_taxonomy_adoption.md` for full retro.

**Sub-sprint 1c — Variety Observed corpus distillation (deferred).** Per-cultivar "Observed Across My Corpus" subsections in `varieties.md` for ≥3-brew cultivars (Gesha 22, 74158 4, Sidra 3). Requires per-cultivar synthesis review and writing in Chris's voice. Fires when Chris has focused authoring time; not a Claude-driven sprint.

**Sub-sprint 1d.1 — Region structural port (✅ shipped 2026-04-22).** Mirror of Variety 1a.1. `docs/taxonomies/regions.md` authored as authoritative content (121 canonical macros across 38 countries; 127 country-scoped entries — some macros like Lake Kivu Highlands span multiple countries). `lib/terroir-registry.ts` refactored from 3 flat string-bundles (countries / macros / mesos) to a rich `TerroirEntry[]` shape with country / admin_region / macro_terroir per row, plus derived `TERROIR_COUNTRIES` / `TERROIR_MACROS` legacy exports + `getTerroirEntry(country, macro)` / `resolveTerroirMacro(macro)` helpers (mirrors cultivar-registry). 12 structural aliases (7 rename drift + 5 diacritic-free forms). `lib/brew-import.ts` `TERROIR_REGISTRY` retired — dual-registry drift killed, same pattern as Variety. Migration 023 applied 11 DB-row renames / reclassifications preserving all 55 brew FKs: Acatenango Volcanic → Central Volcanic; Costa Rican Central Volcanic → Central Volcanic (country prefix dropped); Huehuetenango → Western Dry; Marcala → Central Honduras; Sierra Sur → Oaxaca Southern; Cauca Southern Andean Cordillera → Western; Antioquia Western → Central; Peru + Ecuador Northern Andean Cordillera → Northern Andean Highlands; Yunnan Monsoonal → Yunnan Central (CN default given generic admin); Burundi Lake Kivu → Mumirwa Escarpment. **Meso / micro demoted from canonical registry to free-text** — column retained in DB schema but no validation, no autocomplete, no aggregation (every behavioral attribute is macro-scoped; producer-level locality is the right home for farm detail). SYNC.md validator table row 5 updated to pass-through. 1d.2 (content backfill to DB columns) and 1d.3 (CanonicalTextInput enforcement on /add + /brews/[id]/edit) queued.

**Sub-sprint 1d.2 — Region content backfill (✅ shipped 2026-04-22).** Mirror of Variety 1a.2. Migration 024 populates 11 macro-level attribute content columns on all 22 existing terroir rows from `docs/taxonomies/regions.md`. Overwrite mode — migration 009 stopgap superseded. `climate_stress` shifts from one-word enum (cool/temperate/warm) to free-text Climate Regime (e.g. "warm, distinct dry season, moderate rainfall") since the column is already `text`, not a DB enum, and richer signal feeds future synthesis. `typical_processing` Title Case mapped via `lib/process-registry.ts` canonical so /processes cross-linking stays coherent. `dominant_varieties` preserves regions.md wording verbatim (macro-level text, not FK to cultivars). `meso_terroir` untouched (row-level free-text per 1d.1 demotion). Zero schema / code / FK change; 55 brew FKs intact. Pre-sprint audit found zero reclassifications needed — the 1d.1 exhaustive cross-check stuck. See `memory/project_region_taxonomy_content_backfill.md` for full retro.

**Sub-sprint 1d.3 — Region enforcement (✅ shipped 2026-04-22).** Mirror of Variety 1b. `CanonicalTextInput` swapped in on `/add` purchased review step 6 + `/brews/[id]/edit` terroir inputs, backed by `TERROIR_MACRO_LOOKUP` (121 canonicals + 12 aliases) + `TERROIR_COUNTRY_LOOKUP` (38 countries). PATCH `/api/brews/[id]` accepts `terroir_name` + `country`, resolves to `terroir_id` via new `findOrCreateTerroir` helper with `admin_region` auto-populated from `getTerroirEntry()` on create. `findOrCreateCultivar` + `findOrCreateTerroir` helpers extracted into `lib/brew-import.ts`, collapsing ~55 lines of inline PATCH code that Variety 1b introduced. Meso stays free-text pass-through. Admin_region drift on 6 existing DB rows (DB = "Kayanza Province" etc. vs registry grouping "Kayanza / Muramvya / Mwaro") left untouched — `matchTerroir` ignores admin in its primary filter, so no duplicate-creation risk. Code-only sprint, no migration. See `memory/project_region_taxonomy_enforcement.md` for full retro.

**Region slice Claude-driven work fully shipped** (1d.1 structural + 1d.2 content + 1d.3 enforcement). Remaining Region piece: per-macro "Observed Across My Corpus" distillation for ≥3-brew macros (Volcán Barú 13, Huila 9, Sidama 4, Guji 3, EC Northern Andean 3) — Chris-authored voice pass, mirror of Variety 1c, deferred.

**Sub-sprint 1e.1 — Process structural port (✅ shipped 2026-04-23).** First **Phylum A2** port. Chris's CSV revealed Process is a **composable taxonomy** (base + subprocess + 4 modifier axes + signature + decaf), not a flat canonical list like Variety + Region. `docs/taxonomies/processes.md` authored + `lib/process-families.ts` renamed/refactored to `lib/process-registry.ts` (4 bases + 7 Honey subprocesses + 13 fermentation / 5 drying / 7 intervention / 4 experimental / 4 decaf modifiers + 3 signature methods + ~70 aliases across axes + `composeProcess` / `decomposeProcess` helpers + `LEGACY_DECOMPOSITIONS` covering all 20 current `brews.process` values). Back-compat preserved for `PROCESS_FAMILIES` + `getProcessFamily` + `getFamilyColor`. Zero DB change, zero UI change. 4 consumer import sites updated. See `memory/project_process_taxonomy_adoption.md` for full retro.

**Sub-sprint 1e.2 — Process schema migration + data decomposition (✅ shipped 2026-04-23).** Migration 025 adds 8 structured columns to `brews` (`base_process`, `subprocess`, `fermentation_modifiers`, `drying_modifiers`, `intervention_modifiers`, `experimental_modifiers`, `decaf_modifier`, `signature_method`) and batch-UPDATEs all 55 rows from `LEGACY_DECOMPOSITIONS`. `base_process` locked with NOT NULL + CHECK + index; modifier arrays default `'{}'`; scalar columns NULL when absent. Post-migration base distribution: Washed 31 / Natural 19 / Honey 5 / Wet-hulled 0. Four interpretive cells from 1e.1 resolved via pre-sprint DB audit: Anaerobic Honey → Generic Honey subprocess; both Double Anaerobic Thermal Shock + Double Fermentation Thermal Shock → base:Washed with `[Double Anaerobic, Thermal Shock, Yeast Inoculated]` (El Paraiso house protocol under two English labels — they merge in 1e.4). Initial Moonshadow Washed reclassification as plain Washed was wrong — Chris confirmed post-ship it's a legitimate rare Washed variant of Moonshadow (MSW1 Airworks x Shoebox x Alo collab lot, same drying signature on a washed ferment); migration 026 reinstated the signature. Legacy `brews.process` text column untouched (zero UI change); dropped in 1e.4 when /processes is redesigned. See `memory/project_process_schema_migration.md` for full retro.

**Sub-sprint 1e.3 — Process enforcement (✅ shipped 2026-04-23).** New shared `components/ProcessPicker.tsx` wired into `/brews/[id]/edit` + `/add` purchased review step 6 + `/add` self-roasted save path. Picker shape: base select (4 options, required) + conditional Honey subprocess dropdown (7 options, renders only when base=Honey) + 4 chip inputs (fermentation 13 / drying 5 / intervention 7 / experimental 4 canonicals, each with alias-aware autocomplete + amber "did you mean" warning via `findClosest`) + decaf single-select (4 options) + signature `CanonicalTextInput` (3 canonicals, typeahead) + live "Saved as:" preview via `composeProcess`. Save path: PATCH `/api/brews/[id]` + `persistBrew` both populate all 8 structured columns AND write `composeProcess(structured)` to legacy `brews.process` so `/processes` + `/brews` filter continue reading the flat string unchanged. Save-gate: `isProcessResolvable` checks base is canonical + modifier chips are canonical + signature resolves via alias. Signature hint ("Moonshadow is typically Natural at Alo Coffee") renders when a signature resolves but does **not** auto-fill base — honors the 1e.2 Moonshadow Washed correction that rare base variants are legitimate. Pre-sprint audit confirmed all 55 brews round-trip cleanly through `LEGACY_DECOMPOSITIONS`. Helpers `structuredProcessColumns(s)` + `isProcessResolvable(s)` live in `lib/process-registry.ts` (kills 5-site spread duplication + 3-site validation duplication). `seedStructuredProcess(payload)` in `lib/brew-import.ts` bridges legacy `process` strings to `StructuredProcess` for mount-time form seeding. Build-hygiene side-quest: `tsconfig.tsbuildinfo` added to `.gitignore` (1e.2 retro follow-up). See `memory/project_process_enforcement.md` for full retro.

**Reframed 2026-04-24 — "all taxonomies first, then V2 brainstorm + build":** Chris's clarified sequencing for the umbrella: **finish every canonical registry that an `/add` form field or external-Claude write payload needs, then convene the candidate #2 V2 architecture brainstorm.** Once every input field on `/add` is backed by a canonical registry, the external-Claude write payload reduces to registry picks + structured recipe + free-text prose — zero unknown validation surface, so the V2 design conversation can focus on architecture (MCP/HTTP, auth, write-back semantics) rather than re-litigating enforcement shape. The remaining taxonomies map 1:1 to the `/add` field inventory:

| `/add` field | Canonical registry | Status | Sub-sprint |
|---|---|---|---|
| `terroir` (country + macro) | `lib/terroir-registry.ts` | ✅ 121 macros / 38 countries | 1d.1/1d.2/1d.3 shipped |
| `cultivar_name` | `lib/cultivar-registry.ts` | ✅ 63 canonicals + 48 aliases | 1a.1/1a.2/1b shipped |
| `process` (composable) | `lib/process-registry.ts` | ✅ 4 bases + 7 subs + 4 axes + decaf + signature | 1e.1/1e.2/1e.3 shipped |
| `roaster` | `lib/roaster-registry.ts` | ✅ 70 canonicals + adoption shipped (with override escape hatch) | 1h.1 + 1h.2 shipped |
| `producer` | `lib/producer-registry.ts` | 🔶 49 canonicals exist (migration 018); rich content research pending | **1l** |
| `flavor_notes` | `lib/flavor-registry.ts` | 🔶 132 canonicals (migration 013) + family classifier; Chris-led content extension in flight | **1g** |
| `brewer` + `filter` | `lib/brewer-registry.ts` + `lib/filter-registry.ts` (both new) | ❌ no registry; research pending | **1f (rescoped)** |
| `grinder` + `grind` | `lib/grinder-registry.ts` (new) | ❌ grind is free-text mixing grinder + setting; Chris's EG-1 research done, others pending | **1k** |
| `roast_level` | `lib/roast-level-registry.ts` | ✅ 8 Agtron-anchored canonical buckets + 22 aliases | 1m shipped |
| `dose_g` / `water_g` / `temp_c` / etc. | structured columns | ✅ no canonical needed — numeric / free-text | — |
| `bloom` / `pour_structure` / `total_time` | structured columns | ✅ free-text, no canonical (descriptive) | — |
| sensory fields (aroma/attack/.../finish) | — | ✅ free-text prose (intentional) | — |
| learnings (key_takeaways / what_i_learned) | — | ✅ free-text prose (intentional) | — |

**Remaining umbrella sub-sprints** (in Chris's priority order for Claude work, post-2026-04-24 reframe):

- **Sub-sprint 1i — `/add` SR canonical rebuild (✅ shipped 2026-04-24).** Mirror of Variety 1b + Region 1d.3 applied to SR. SR step 7 (terroir) + step 8 (cultivar) rebuilt from generic paste-textareas to structured `CanonicalTextInput`-backed forms; admin_region auto-populates from registry; species/family/lineage RESOLVED block renders from `resolveCultivar()`. `handleSaveSelfRoasted` now calls `findOrCreateTerroir` + `findOrCreateCultivar` in parallel via `Promise.all` (replacing ~65 lines of inline find-or-create). Step 9 save-gate + inline error list. Green-bean origin + variety surfaced as read-only `<GreenBeanHint>` above the pickers. Pre-sprint audit: 4 existing SR brews had populated FKs from the historical path; `parsedTerroir` / `parsedCultivar` state was never assigned in the pre-sprint code — save would no-op. `parsedExperiments` / `parsedCuppings` / `parsedLearnings` same-pattern-broken — flagged for follow-up "SR steps 4-6 parser rebuild" sprint. See `memory/project_add_sr_canonical_rebuild.md` for full retro.
- **Sub-sprint 1h.1 — Roaster taxonomy structural port (✅ shipped 2026-04-24).** Mirror of Variety 1a.1 / Region 1d.1 / Process 1e.1 structural port. **70 canonical roasters** (64 from Chris's authored CSV + 5 currently-brewed extras: TM/Colibri/Olympia/Rose/Noma + Latent self-roasted) across **6 families** — added **SYSTEM** as a 6th family per Chris + ChatGPT review (control-loop-identity roasters: Subtext, Picky Chemist, Ona, Rose Coffee, Noma Coffee — orthogonal to Clarity/Balanced/Full extraction-level framing). Strategy tags collapse to families via `STRATEGY_TAG_FAMILY` (10 strategy tags + SELF-ROASTED → 6 families). Refactored [lib/roaster-registry.ts](lib/roaster-registry.ts) flat → rich `RoasterEntry[]` with 29 CSV fields per entry + optional `displayName` (short-form for tight UI surfaces) + `bmrHouseStyle` / `bmrNotes` (authored prose preserved verbatim from prior 21-entry registry). Authored [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md) (1730 lines) as authoritative content. Migration 027 renamed 20 short-form `brews.roaster` values to canonical full names (Moonwake → Moonwake Coffee Roasters etc.); 4 strategy reclassifications: Rose / Noma / Picky Chemist → SYSTEM, TM Coffee → CLARITY-FIRST. 24 short-form / structural-drift aliases preserve resolvability. `/brews` covers + `/roasters` index swap to `displayName ?? name` to keep visual brevity post-migration. CanonicalTextInput on `/brews/[id]/edit` continues working unchanged with the expanded 70-canonical lookup. See `memory/project_roaster_taxonomy_adoption.md` for full retro.
- **Sub-sprint 1m + 1h.2 — Roast level taxonomy + roaster /add enforcement (✅ shipped 2026-04-24, bundled).** Both touched `/add` purchased step 6 so they shipped in one PR. **1m:** 8 Agtron-anchored canonical buckets (Extremely Light 91-130 / Very Light 81-90 / Light 71-80 / Medium Light 61-70 / Medium 51-60 / Moderately Dark 41-50 / Dark 31-40 / Very Dark 0-30) + 22 aliases (5 marketing tags Nordic / Ultra / Specialty / Modern / Omni Light + 17 drift variants). Lean per-bucket fields: `{ name, agtronWholeBean: [min, max] }` only — sensory prose, ground Agtron, dev-time ratio explicitly scoped out. Marketing tags resolve to objective buckets (Nordic Light → Very Light etc.) — they're not first-class canonical, semantic home is `roaster.roastStyle` (follow-up 1h.3). New `roastLevelFromAgtron(n)` utility maps a CM200 reading to bucket. New `docs/taxonomies/roast-levels.md`. Migration 028 backfilled 4 drift values (`Light roast` → `Light`, `light to medium` / `Light-medium` → `Medium Light`, legacy parser-misroute `Balanced Intensity` on Finca La Reserva Gesha → `Light`). **1h.2:** `CanonicalTextInput` extended with `allowOverride` / `overridden` / `onOverrideChange` props — inline "Use anyway" link below amber warning, click flips to green-acknowledged "Using non-canonical value — will save verbatim." Used only on roaster (text-only column with no FK). `findOrCreateRoaster(supabase, userId, raw, { allowOverride })` extracted to `lib/brew-import.ts` for parity with cultivar/terroir; validate-and-normalize only (no DB write). POST `/api/brews/import` + PATCH `/api/brews/[id]` accept `roaster_override: true` for legitimately new roasters. **Foundational addition:** `canonicalize(input)` method on `CanonicalLookup` returns title-case canonical form for write paths — fixes a latent case-drift bug across all 5 registries (`findClosest('light')` returned null due to canonical short-circuit, causing `findClosest(v) ?? v` to persist lowercase verbatim). PersistBrew + PATCH route now use `canonicalize()` directly; DB rows never drift in case. **Shared primitive:** `components/SaveGateWarning.tsx` extracted from /simplify pass — de-dupes amber CANNOT SAVE YET block between /add and /edit. **Surprise:** MCP supabase write turns out NOT to be permission-blocked (briefing's premise was stale from 1h.1 retro) — UPDATEs ran fine; migration 028 applied directly without a Chris-step. See `memory/project_roast_level_taxonomy_adoption.md` for full retro.
- **Sub-sprint 1l — Producer taxonomy adoption.** Chris flagged "not done, not done with research" — the existing 49-canonical [lib/producer-registry.ts](lib/producer-registry.ts) (post migration 018) has names only, no rich content. Full A1-style port: research pass produces `docs/taxonomies/producers.md` with per-producer rich fields (country / admin_region / people / farm_name / altitude / typical_cultivars / typical_processes / signature_lots / roaster_relationships / philosophy). Refactor registry to rich `ProducerEntry[]`. Likely surfaces new DB columns (currently `brews.producer` is free-text, no FK to a `producers` table). Structural vs content migration split per usual (same Variety 1a.1 vs 1a.2 shape). Blocks on Chris's research CSV. Bigger sprint than Roaster because of FK/column decisions.
- **Sub-sprint 1f — Brewer + filter taxonomy (rescoped from Dripper 2026-04-24).** Previously scoped as "Dripper" (8-10 drippers). Expanded to cover filters too, since they're a separate canonical axis often paired with brewers (certain filters only fit certain brewers). Likely 2 registries: `lib/brewer-registry.ts` (V60 / Origami / Kalita Wave / UFO Ceramic / Tricolate / Chemex / etc.) + `lib/filter-registry.ts` (Sibarist UFO Fast Cone / Cafec Abaca / Kalita Wave 185 / etc.). Brewer entries may carry `compatible_filters` cross-refs. Authored doc: `docs/taxonomies/brewers.md` covers both axes. Blocks on Chris's research.
- **Sub-sprint 1k — Grinder + grind size taxonomy** (new, scoped 2026-04-24). `brews.grind` is currently a free-text string mixing grinder + setting (e.g. `"EG-1 6.8"`). Canonical split: `lib/grinder-registry.ts` (EG-1 / Ode 2 / Comandante / ZP6 / etc.) with per-grinder canonical setting ranges + scale units (EG-1 uses decimal dial; Comandante uses click counts). Possible schema split: `brews.grinder` + `brews.grind_setting` as separate columns, with the legacy `brews.grind` kept as denormalized display (same 1e.3 pattern). Chris's EG-1 research is done — that's the canonical per-setting content for the EG-1 entry. Other grinders need research. **Absorbs the existing side-quest "Port EG-1 grind-size analysis into BREWING.md"** — the grind-size analysis becomes the content for the EG-1 registry entry instead of a standalone BREWING.md section.
- **Sub-sprint 1g — Flavor extension** (A2, loose bar, family-level content, extends existing `lib/flavor-registry.ts`). **Chris is authoring this in parallel outside Claude sessions.** When his draft lands, the Claude sprint collapses to port + enforcement rather than research.
- **Sub-sprint 1e.4 — /processes page redesign** (deferrable; Chris-flagged as "good to do soon, less urgent while data model works"). Faceted by base + modifier axis. The existing flat "/processes/[slug]" string-equality page keeps working via `composeProcess()` denormalizing into `brews.process`. Drops `brews.process` text column when it ships. Runs after the taxonomy batch is done, before or in parallel with V2 build.
- **Sub-sprint 1e-content — Process reference content backfill** (Chris-authored, parallel). Mirror of Variety 1c shape.

**Sizing:** 1a.2 is a half-sprint (content SQL). 1b is one sprint (two form surfaces). 1d.1 was one sprint (structural port); 1d.2 half-sprint, 1d.3 one sprint. 1e-g similar shape. **Feature-doc entry-count estimates are calibrated to ~17-28% of the actual canonical count** — Variety estimate 20 → actual 63 (3.6×); Region estimate 21 → actual 121 (5.8×). Don't downsize the sprint off the original feature-doc number once the research CSV arrives. See [attribution § Retro (from Phylum A1 ports)](docs/features/reference-taxonomies-attribution.md#retro-from-phylum-a1-ports-variety--region-shipped-2026-04-22).

**Scope notes (see attribution doc for full coverage):**
- Citations are bottom-of-page `## Sources` blocks, no inline markers.
- Tested vs untested claims use voice-only signal (no badges, no schema separation).
- External claims never graduate to "Chris's tested" — stay cited forever; Chris's observations live alongside as separate sections.
- No source whitelist; Chris curates per-claim at authoring time.
- Enforcement bar varies: strict for Region / Variety / Process / Dripper; loose for Flavor.

### 2. Claude ↔ app sync pipeline (originally scoped 2026-04-21 as SYNC V1-brews; rescoped 2026-04-24)

**Vision (rescoped 2026-04-24):** all brewing + roasting info across the two workflow paths stays in one place and stays current. When Chris finishes a coffee inside a `claude.ai` project (brewing-side) or inside a future roasting project, that session pushes the resolution to the app directly — no paste step, no Claude Code intermediary — and the app becomes the single source of truth. `BREWING.md` + `ROASTING.md` are served by the app for external Claude sessions to read (so they see current house-method + per-roaster brewing guides + roaster reference content when reasoning about a brew), and external Claude can write back to them too (new learnings from a resolved brew append to BREWING.md archive pattern / roaster card edits / etc.).

This is the architectural evolution of the candidate originally scoped as "Claude Code paste-driven V1-brews sync" (2026-04-21, memory/project_sync_playbook.md). Step (c) shipped the validator-table playbook; step (d) dog-food never ran because Chris's vision clarified to external-Claude-direct-push instead of paste-into-Claude-Code. **The Claude Code paste path is preserved as a fallback / pre-V2-bootstrap channel** — useful when the app's write API isn't reachable or for backlog migrations.

**Taxonomy work that substantially changed the pre-reqs since original V1 scope (2026-04-21 → 2026-04-24):**
- **Variety 1a.1 + 1a.2 + 1b (shipped 2026-04-22).** 63-canonical registry + rich attributes + strict `CanonicalTextInput` enforcement on `/add` + `/brews/[id]/edit`. `findOrCreateCultivar` extracted to `lib/brew-import.ts`.
- **Region 1d.1 + 1d.2 + 1d.3 (shipped 2026-04-22).** 121-canonical macro registry + 38 countries + rich attributes + meso/micro demoted to free-text pass-through + `findOrCreateTerroir` with `admin_region` auto-populate.
- **Process 1e.1 + 1e.2 + 1e.3 (shipped 2026-04-23).** Composable taxonomy — 4 bases + 7 Honey subprocesses + 4 stackable modifier axes + decaf + signature. 8 structured columns on `brews` (NOT NULL + CHECK on `base_process`). `ProcessPicker` + `composeProcess` + `decomposeProcess` + `seedStructuredProcess` + `isProcessResolvable` + `structuredProcessColumns`. Write-path always populates both structured columns AND `composeProcess(structured)` to `brews.process` for back-compat.
- **Roaster 1h (pending, 64 canonicals + richer fields authored 2026-04-23).** When 1h ships, 4/4 canonical entity registries are enforced at write, alias-resolvable, and have `findOrCreate*` helpers or equivalent.
- **`/add` SR canonical rebuild 1i (shipped 2026-04-24).** SR step 7 + 8 rebuilt to canonical pickers; `handleSaveSelfRoasted` now routes terroir + cultivar through the shared `findOrCreate*` helpers in parallel. The `/add` UI is fully canonical-enforced post-1i.
- **`LABEL_ALIASES` extension** flagged in original step (c) dry-run is now mostly irrelevant — external Claude pushes structured JSON, not pasted labeled text. Only matters if the Claude Code paste fallback is kept.

**Sub-sprint shape (rescoped 2026-04-24):**

**Sub-sprint 2.1 — V1-brews dog-food via Claude Code paste (dog-food the write path end-to-end).** Still worth running even though V2 supersedes it architecturally. Proves the `persistBrew` + `findOrCreateCultivar` + `findOrCreateTerroir` + structured-process write stack handles a real backlog brew cleanly. Flushes out friction the speculative design missed. 1 sprint. Pre-req: 1i SR rebuild if the dog-food brew is self-roasted (unlikely — backlog is purchased); purchased path is ready.

**Sub-sprint 2.2 — Scope expansion: all entity types, not just brews.** V1 was brews-only. V2 covers brews + green_beans + roasts + experiments + cuppings + roast_learnings + reference_roasts. For each entity, define: (a) canonical registries involved on write, (b) validator table row shape, (c) find-or-create helpers needed, (d) structural migrations if the entity has free-text fields that should be canonical. Likely 1-2 sprints to scope all 7 entities; actual adoption sprints thereafter (one per entity type if non-trivial, bundled if trivial).

**Sub-sprint 2.3 — External-Claude write path (the MCP-or-HTTP question).** Decision: external `claude.ai` project → how does it push? Two paths:
- **(a) Remote MCP server** hosted on Vercel alongside the app. Claude Code + `claude.ai` projects both connect via standard MCP. Auth via token (Chris's Supabase auth or a separate API key). Writes go through the same `persistBrew` + `findOrCreate*` path the `/add` UI uses, so canonical enforcement is free.
- **(b) Authenticated HTTP POST to app API** (`/api/brews`, `/api/green-beans`, etc.) with service-token auth. Lower friction (no MCP plumbing), but requires Chris to paste/call a curl or equivalent from within the Claude project — and current `claude.ai` tool-use for direct HTTP is less ergonomic than MCP.
- Recommend starting with (a) MCP — matches the "deferred until V1 runs on 2+ real coffees" note in original scope. Re-decide if MCP plumbing proves heavier than expected.

**Sub-sprint 2.4 — `/api/reference/brewing` + `/api/reference/roasting` — app-served living docs.** External Claude needs to read current `BREWING.md` + `ROASTING.md` content at reasoning time. Simplest shape: Next.js API routes that serve the file content (plain markdown text). Auth-gated if the content is sensitive; open if not. Write-back is the harder half — see 2.5.

**Sub-sprint 2.5 — Write-back to `BREWING.md` / `ROASTING.md` from external Claude.** When a brew resolution teaches something new (new archive pattern, roaster-card edit, extraction note), external Claude writes back. Options:
- **(a) Direct commit via GitHub API** — external Claude opens a branch + commits the diff + opens a PR. Chris reviews + merges. Preserves git history. Works with existing repo tooling. Downside: round-trip is slow (PR + review + merge).
- **(b) Write to a `brewing_md_overlay` table** — runtime overlay the app reads on top of the committed repo copy. Faster write path, but now the repo file diverges from the served content. Drift is bad.
- **(c) Direct commit + auto-merge for specific change classes** (append-only archive pattern additions; roaster-card field updates). Higher-risk change classes (big restructures) still go through PR review. Reduces round-trip for low-risk writes.
- Recommend (a) with appetite for (c) after ~5 real writes prove the tooling.

**Sub-sprint 2.6 — Roasting-side parallel: `ROASTING.md` + roasting Claude project integration.** V1 deferred all roasting work to sub-sprint 2 (now candidate #7). Post-2026-04-24 rescope, roasting is a first-class V2 concern, not a follow-on. Still fires after a brewing V2 coffee has gone through cleanly (the "prove V1 before V2-roasting" sequencing stays) but the scope is now integrated with 2.3/2.4/2.5 rather than a separate SYNC sub-sprint. Replaces candidate #7 contents; candidate #7 may be removed once 2.6 is in-flight.

**V2 explicitly out of scope:** EA replacement, Sheets API polling, auto-scraping of terroir/cultivar metadata, bespoke `/sync` UI for humans (the app itself + external Claude are the UIs). **Schema additions for dropped source data** (candidate #4) may need to land alongside 2.2 if the entity-write scoping surfaces new fields that dropped data would otherwise go to.

**Sizing:** hard to estimate cleanly given the architectural unknowns in 2.3/2.5. Approximate: 2.1 = 1 sprint; 2.2 = 1-2 sprints; 2.3 = 2-3 sprints (MCP server + auth + write endpoints for all entities); 2.4 = 1 sprint; 2.5 = 1-2 sprints; 2.6 = 1-2 sprints. Total rough: 8-12 sprints. The candidate is multi-phase; individual sub-sprints ship incrementally.

**Pre-reqs:**
- 1h (Roaster taxonomy adoption) — 64-canonical registry + rich fields available at write. Must precede 2.2/2.3 for roaster field write-validation to have a canonical surface.
- ~~1i (`/add` SR canonical rebuild)~~ ✅ shipped 2026-04-24. SR path's canonical enforcement now matches purchased + edit.
- Optional: candidate #4 (schema additions for dropped source data) — if 2.2 scoping surfaces that external-Claude pushes would otherwise drop fields, land #4 first.

**Near-term action:** run 2.1 (V1-brews dog-food paste path) as the concrete next step after 1h to prove the write stack end-to-end on a real brew. Then scope 2.2 with fresh empirical data. 1i shipped 2026-04-24.

**Planned brainstorming session (flagged 2026-04-24):** Chris wants a dedicated brainstorming pass on V2 architecture before 2.3+ commit to specific decisions (MCP vs HTTP, auth shape, write-back semantics for the living docs, entity-write API surface). Chris noted he "started working on it but made so many changes to the taxonomies" that prior thread's work may be stale or partially overlapping with what shipped 2026-04-22/23. **Pre-brainstorm audit worth running:** (a) `git log --all --oneline` filtered for sync/MCP/api-related commits since 2026-04-21; (b) check any uncommitted work on prior branches (e.g. `git branch -a | grep -i sync`); (c) re-read `SYNC.md` in its current state + any prototype API routes under `app/api/` that may have been scaffolded. Output a 1-page "what's here, what's stale, what's missing" doc before the brainstorm convenes.

**Chris's MVP mental model for the Claude-upload-a-brew payload (captured 2026-04-24):** when an external `claude.ai` project finishes a brew resolution, the single write call from Claude to the app should map 1:1 onto the structured surfaces that already exist:
- **Recipe** — already structured (dose/water/temp/grind/bloom/pour structure/total time/extraction strategy). Claude sends the structured form directly.
- **Roaster** — pick from `lib/roaster-registry.ts` (64 canonicals post 1h). Alias-resolvable via `findClosest`.
- **Cultivar** — pick from `lib/cultivar-registry.ts` (63 canonicals). Alias-resolvable. Rich fields auto-populate via `getCultivarEntry` on find-or-create.
- **Terroir** — pick from `lib/terroir-registry.ts` (121 macros × 38 countries). Alias-resolvable. Admin_region auto-populates via `getTerroirEntry`. Meso/micro are free-text pass-through.
- **Process** — structured form (base + optional Honey subprocess + 4 modifier axes + decaf + signature), all canonical per 1e.1-1e.3. `composeProcess` derives the legacy display string; `structuredProcessColumns` spreads to DB shape.
- **"Rest of coffee info" (TBD in brainstorm):** coffee_name, producer (canonical via `lib/producer-registry.ts`), flavor_notes (canonical via `lib/flavor-registry.ts`, array), roast_level, elevation, classification, key_takeaways, sensory fields (aroma/attack/mid_palate/body/finish/temperature_evolution/peak_expression), learnings (what_i_learned/terroir_connection/cultivar_connection). These are the fields NOT covered by a canonical-registry taxonomy — some canonical (producer, flavor_notes), some free-text (sensory prose). The brainstorm should decide what's required vs optional at write-time + how Claude distinguishes "I confidently know this" from "I'm guessing" (e.g. confidence flags, partial-save semantics).

**Why this matters for the brainstorm:** with 5/5 canonical registries (roaster 1h pending) strictly enforced + find-or-create helpers + the structured process write path all landed, the MVP write API's *validation surface* is mostly free — it's the same surface the `/add` UI uses. The brainstorm can focus on the unresolved design questions (MCP vs HTTP, auth, atomicity for multi-entity writes, write-back to living docs) rather than re-litigating canonical enforcement.

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

### 7. Claude-authored sync — roasting slice (absorbed into candidate #2 sub-sprint 2.6 on 2026-04-24)

**Rescoped:** the roasting half of the sync pipeline is no longer a separate candidate. Post-2026-04-24 V2 rescope, roasting is a first-class concern handled in candidate #2 sub-sprint 2.6 alongside the brewing-side write path. Sequencing rule stays: fires only after a brewing resolution has gone through the V2 pipe cleanly (2.1 dog-food at minimum, ideally 2.2/2.3 landed). See candidate #2 for full scope.

### 8. Event-driven bean uploads (not a sprint, recurring task)

Now that the /add flow works end-to-end (PR #25), this is ergonomic: Chris pastes each bean's 9 tabs through the wizard on resolution. Mandela XO + Sudan Rume Hybrid Washed expected ~Apr-May 2026. Each is a one-sitting upload, no sprint needed. Will move to the V2 sync path once candidate #2 sub-sprint 2.6 (roasting-side) ships.

### Blocked / parked

- **A: Claude-Design-led redesign** — waiting on Chris's Claude Design (claude.ai/design) output. Current design is "pretty good" in the meantime. Anything shipped in self-roasted sprints must stay modular enough for the eventual redesign to re-skin (route through SectionCard, Tag, TagLinkList, .label; no new tokens / colors / spacing unless a canonical registry requires it). **Scope note:** when this fires, explicitly re-examine desktop vs. mobile as a first-class design consideration — current rule is "desktop-first with mobile spot-check", and the redesign is the right moment to revisit whether that's still the correct balance given how the app is actually used.

### Side-quests (logged, do not auto-queue)

- **Split `brews.producer` into `producer_name` + `farm_name`** — the "Person, Farm" convention is locked, a clean comma-parse. Valuable for roasting-side Instagram outreach. Fires when the use case fires, not before.
- **Edit-form mobile polish** — `/brews/[id]/edit` grid-cols-2 truncates longer canonical values at 375px. Own sprint, post-redesign probably.
- **Roaster/producer conflation cleanup (flagged 2026-04-21)** — on at least one brew Chris noticed Hydrangea (a roaster) in the producer column. Small data-cleanup audit — query for all rows where `brews.producer` matches a value in `lib/roaster-registry.ts`, review, correct. While we're in there, check whether any other registry cross-contamination exists (e.g. roaster values in other canonical-registry columns, or vice versa). Post-migration-018 the registries are canonical but the data still has some pre-canonical rows with wrong-column values.
- **Producers aggregation starting point** — the mechanical 1-day "copy the /roasters pattern" sprint that would be the foundation of the "Producers as a first-class citizen" Medium-term feature. See Future Directions § Medium-term for the full framing. Unblock when 2+ producers have 3+ brews each.
- **Port EG-1 grind-size analysis into BREWING.md** — **absorbed into sub-sprint 1k (Grinder + grind size taxonomy) on 2026-04-24.** Chris's EG-1 analysis becomes the content for the EG-1 registry entry in `lib/grinder-registry.ts` + `docs/taxonomies/grinders.md`, rather than a standalone BREWING.md section. Deleting from Side-quests when 1k kicks off.
- **Commit taxonomy-port generator scripts to `scripts/taxonomy-ports/` (surfaced 2026-04-22 during Region 1d.1)** — Variety + Region ports both used small Python scripts to template `docs/taxonomies/*.md` + `lib/*-registry.ts` from the CSV research (127 × 14 cells for Region; 72 × 18 for Variety). Scripts currently live in `/tmp/terroir-sprint/gen_*.py` — ephemeral. If Process / Dripper / Flavor ports follow the same CSV-research shape (all three are queued), moving the Region + Variety scripts into `scripts/taxonomy-ports/` preserves the regeneration path for re-edits to the source CSV + serves as a template for the remaining A1/A2 ports. ~30-min task; fires when Chris wants deterministic re-porting or when the first of Process/Dripper/Flavor kicks off.

### How to apply (operational hints for future sessions)

- **Chris's default next task:** candidate #1 sub-sprint 1c (Variety Observed corpus distillation, deferred) or Region Observed distillation (same pattern, per-macro for ≥3-brew macros: Volcán Barú 13, Huila 9, Sidama 4, Guji 3, EC Northern Andean 3). Both are Chris-driven authoring passes with Claude vetting. Chris is also separately authoring **Flavor taxonomy (1g)** outside Claude sessions. Roaster taxonomy authoring complete 2026-04-23 — now slotted as Claude sub-sprint 1h.
- **Claude's default next task (recommended):** **sub-sprint 1h — Roaster taxonomy adoption**. Mirror of Variety 1a.1 / Region 1d.1 / Process 1e.1 structural port, but against an existing registry (current 21 canonicals in `lib/roaster-registry.ts`) rather than greenfield. Port Chris's 64-canonical authored CSV → `docs/taxonomies/roasters.md`; refactor `lib/roaster-registry.ts` to rich `RoasterEntry[]`; update `/roasters` + `/roasters/[id]` consumers; decide structural vs content migration split. 1i shipped 2026-04-24.
- **Claude's taxonomy batch (pre-V2, per 2026-04-24 reframe):** after 1i, run the remaining registry sub-sprints in this order: **1h Roaster → 1m Roast level → 1k Grinder + grind size → 1l Producer → 1f Brewer + filter**. 1h + 1m have zero research gating (authored CSVs / straightforward). 1k + 1l + 1f block on Chris's research CSVs for the non-EG-1 / non-Chris-written entries. **1g Flavor extension** runs in parallel (Chris-authored). Completing this batch gives every `/add` field + every external-Claude write payload field a canonical registry to validate against.
- **Claude's near-term task (post-taxonomy-batch):** **candidate #2 sub-sprint 2.1 — V1-brews dog-food** (the originally-scoped step (d)). Proves the write stack end-to-end before V2 architecture decisions are made. With the full taxonomy batch shipped, every field in the dog-food payload validates through an enforced canonical surface. Pre-reqs: Mokka ✅ resolved; Producer `warn` → `block` promotion becomes a trivial decision once 1l lands.
- **V2 brainstorm (after 2.1 flushes friction):** convene the candidate #2 architecture brainstorm flagged 2026-04-24 — MCP-vs-HTTP push path, auth shape, atomicity, write-back semantics for `BREWING.md` + `ROASTING.md`. Running the brainstorm *after* 2.1 produces a concrete write-path trace to reason against, rather than designing against speculation.
- **General lesson for remaining A1/A2 ports (Process / Dripper / Flavor):** see [docs/features/reference-taxonomies-attribution.md § Retro (from Phylum A1 ports)](docs/features/reference-taxonomies-attribution.md#retro-from-phylum-a1-ports-variety--region-shipped-2026-04-22). Key load-bearing lessons: feature-doc scope runs at ~17-28% of final canonical count; pre-sprint dual-registry audit is mandatory; exhaustive DB-cross-check before rename tables; structural vs content migrations always split; Python generators for CSV → markdown + TS scale past ~50×12 cells.
- **Candidate #2 sub-sprint 2.1** — dog-food surfaces real friction. Don't short-circuit: the point is finding what the speculative design missed. Also the empirical-feedback step before V2 architecture (2.2-2.6) commits to specific choices around MCP-vs-HTTP push, write-back semantics for living docs, and entity-scope expansion.
- **Candidate #3** is plan-mode territory when it fires — don't start without a real bean loaded for preview verification.
- **Candidate #2 sub-sprint 2.6 (roasting-side V2)** — fires strictly after brewing-side V2 has a resolved coffee going through cleanly. Don't short-circuit the sequencing. Absorbs what used to be candidate #7.
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
| 2026-04-24 | Roast level taxonomy + roaster /add enforcement (Reference Taxonomies sub-sprints 1m + 1h.2, bundled) | New `lib/roast-level-registry.ts` (8 Agtron-anchored canonical buckets + 22 aliases) + `docs/taxonomies/roast-levels.md`. Migration 028 backfilled 4 drift values on `brews.roast_level`. Marketing tags (Nordic / Ultra / Specialty / Modern / Omni Light) are aliases-only — semantic home is `roaster.roastStyle` (1h.3 follow-up). 1h.2: `CanonicalTextInput` extended with `allowOverride` + inline "Use anyway" link + green-acknowledged hint, used only on roaster (text-only column with no FK). `findOrCreateRoaster` extracted to `lib/brew-import.ts` for parity with cultivar/terroir. Foundational addition: `canonicalize(input)` method on `CanonicalLookup` returns title-case canonical for write paths — fixes a latent case-drift bug across all 5 registries. Shared primitive `components/SaveGateWarning.tsx` extracted from /simplify pass. MCP supabase write turns out NOT to be permission-blocked (briefing's premise was stale). |
| 2026-04-24 | Roaster taxonomy structural port (Reference Taxonomies sub-sprint 1h.1) | [PR #52](https://github.com/chrismccann-dev/latent-coffee/pull/52) — 70 canonical roasters across 6 families (added SYSTEM as 6th). Migration 027 renamed 20 short-form DB values to canonical full names. Rich `RoasterEntry` shape with 29 CSV fields per entry + optional `displayName`. `bmrHouseStyle` / `bmrNotes` preserved verbatim from prior 21-entry registry. 4 strategy reclassifications: Rose / Noma / Picky Chemist → SYSTEM, TM Coffee → CLARITY-FIRST. |
| 2026-04-24 | `/add` SR canonical rebuild (Reference Taxonomies sub-sprint 1i) | SR steps 7 (terroir) + 8 (cultivar) rebuilt from generic paste-textareas to structured `CanonicalTextInput`-backed forms. Admin_region auto-populates from `getTerroirEntry()`; species/family/lineage RESOLVED block renders from `resolveCultivar()`. `handleSaveSelfRoasted` refactored to `findOrCreateTerroir` + `findOrCreateCultivar` calls in parallel via `Promise.all` (replaces ~65 lines of inline find-or-create). Step 9 save-gate + inline "Cannot save yet" error list. Green-bean origin + variety surfaced as read-only `<GreenBeanHint>` above the pickers. Pre-sprint DB audit confirmed all 4 existing SR brews have populated FKs (historical path); `parsedTerroir` / `parsedCultivar` state was never assigned in the pre-sprint code — save would have no-op'd. `parsedExperiments` / `parsedCuppings` / `parsedLearnings` same-pattern-broken — flagged for follow-up "SR steps 4-6 parser rebuild" sprint. Zero schema change. |
| 2026-04-23 | Process enforcement (Reference Taxonomies sub-sprint 1e.3) | [PR #46](https://github.com/chrismccann-dev/latent-coffee/pull/46) — new shared `components/ProcessPicker.tsx` wired into `/brews/[id]/edit` + `/add` purchased step 6 + `/add` SR insert. Base select + conditional Honey subprocess + 4 modifier chip inputs + decaf + signature + live composeProcess preview. Save path populates all 8 structured columns AND `composeProcess(structured)` to legacy `brews.process`. Helpers `structuredProcessColumns` + `isProcessResolvable` in process-registry.ts kill 5-site + 3-site duplications. Pre-sprint audit surfaced `/add` was latent-broken since 1e.2 (base_process NOT NULL with no insert path populated it); 1e.3 doubles as the fix. `tsconfig.tsbuildinfo` gitignored. |
| 2026-04-23 | Process schema migration + data decomposition (Reference Taxonomies sub-sprint 1e.2) | Migration 025 — adds 8 structured columns to `brews` (`base_process` + `subprocess` + 4 modifier arrays + `decaf_modifier` + `signature_method`), batch-UPDATE populates all 55 rows from `LEGACY_DECOMPOSITIONS`. `base_process` locked NOT NULL + CHECK + index. 4 interpretive cells from 1e.1 resolved via pre-sprint DB audit; both Double*Thermal Shock variants merge to same El Paraiso house protocol. Migration 026 (post-ship correction) reinstated the Moonshadow Washed signature after Chris confirmed it's a legitimate MSW1 Airworks x Shoebox x Alo collab lot, not a mis-label. `brews.process` untouched. Zero UI change. |
| 2026-04-23 | Process structural port (Reference Taxonomies sub-sprint 1e.1) | First Phylum A2 port — composable taxonomy design pivot. `docs/taxonomies/processes.md` + `lib/process-registry.ts` (renamed from `lib/process-families.ts`): 4 bases + 7 Honey subprocesses + 13 fermentation / 5 drying / 7 intervention / 4 experimental / 4 decaf modifiers + 3 signature methods + ~70 aliases + `composeProcess` / `decomposeProcess` + `LEGACY_DECOMPOSITIONS` for the 20 current DB values. Back-compat preserved; zero DB / UI / data change. |
| 2026-04-22 | Region enforcement (Reference Taxonomies sub-sprint 1d.3) | CanonicalTextInput on `/add` + `/brews/[id]/edit` bound to `TERROIR_MACRO_LOOKUP` + `TERROIR_COUNTRY_LOOKUP`. PATCH resolves `terroir_name` + `country` → `terroir_id` via new `findOrCreateTerroir`; admin_region auto-populates from `getTerroirEntry()`. `findOrCreateCultivar` + `findOrCreateTerroir` extracted into `lib/brew-import.ts`. Code-only, no migration. |
| 2026-04-22 | Region content backfill (Reference Taxonomies sub-sprint 1d.2) | Migration 024 — 22 UPDATEs populating 11 macro-level content columns per row from `docs/taxonomies/regions.md`. Overwrites migration 009 (superseded). `climate_stress` → free-text; `typical_processing` Title Case. Zero schema / code / FK change. |
| 2026-04-22 | Region structural port (Reference Taxonomies sub-sprint 1d.1) | `docs/taxonomies/regions.md` + rich `lib/terroir-registry.ts` (121 canonical macros / 38 countries / 127 country-scoped entries / 12 aliases) + migration 023 (11 DB-row renames preserving 55 brew FKs). Meso / micro demoted to free-text. Dual-registry drift killed. |
| 2026-04-22 | Variety enforcement (Reference Taxonomies sub-sprint 1b) | CanonicalTextInput on `/add` purchased review + `/brews/[id]/edit`. Edit picker flips from 26-DB-rows to 63-canonical registry with lazy find-or-create; aliases resolve on save; `isResolvable` added to `makeCanonicalLookup`. |
| 2026-04-22 | Variety content backfill (Reference Taxonomies sub-sprint 1a.2) | PR #36 + migration 022 — 26 existing DB cultivar rows populated with 18 attribute fields from `varieties.md`. 13 previously-sparse rows now complete. |
| 2026-04-22 | Variety taxonomy adoption (Reference Taxonomies sub-sprint 1a.1) | PR #34 + migration 021 — `docs/taxonomies/varieties.md` + rich `lib/cultivar-registry.ts` (63 canonicals / 20 lineages / 48 aliases). Dual-registry drift killed. Mokka pre-req for SYNC V1 resolved. |
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
| 015 | Guatemala terroir reclassification: `Huehuetenango Highlands` + `Acatenango Volcanic Highlands` split out from foreign-country macros. |
| 016 | Cultivar canonicalization: Gesha 5→1 collapse; JARC blend lineage rename; Garnica → Modern Hybrids; Pacas × Maragogype lineage suffix. |
| 017 | Cultivar extended-field backfill across 9 lineages (typical_origins, limiting_factors, common_processing_methods, typical_flavor_notes, common_pitfalls). |
| 018 | Producer canonicalization: 2 drifted clusters collapsed, 5 verbose strings normalized to "Person, Farm" shape. 52→49 distinct producers. |
| 019 | Experiments import: 18 rows from Coffee Roasting Spreadsheet via `jsonb_to_recordset`. Idempotent on `(user_id, green_bean_id, experiment_id)` unique. |
| 020 | Self-roasted audit findings: schema + data integrity fixes discovered during the /add flow end-to-end audit. |
| 021 | Variety taxonomy reconciliation: 4 structural renames (Bourbon Aruzi → Aruzi; Catimor Group → Catimor (group); 74110/74112 → Ethiopian Landrace Blend (74110/74112); Laurina lineage Bourbon (classic) → Bourbon mutation lineage). 56/56 brew FKs preserved. |
| 022 | Variety content backfill: 26 UPDATEs populating 18 attribute columns per row (13 text + 5 array) from docs/taxonomies/varieties.md. Overwrites prior content from migrations 010/017 (superseded). Zero schema change. |
| 023 | Terroir registry reconciliation (Region sprint 1d.1): 11 macro_terroir renames / reclassifications aligning existing rows with `docs/taxonomies/regions.md`. All 55 brew FKs preserved. Structural only — content backfill deferred to 1d.2. Supersedes the single Guatemala reclassification in migration 015 (2 rows touched again). |
| 024 | Terroir content backfill (Region sprint 1d.2): 22 UPDATEs populating 11 macro-level content columns per row (8 text + 2 int elevation + 2 array) from docs/taxonomies/regions.md. Overwrites prior content from migration 009 (superseded). climate_stress shifts from one-word enum values to free-text Climate Regime. Zero schema change, zero code change, zero FK change. |
| 025 | Process registry decomposition (Process sprint 1e.2): adds 8 structured columns to `brews` (`base_process` + `subprocess` + 4 modifier `text[]` arrays + `decaf_modifier` + `signature_method`); 20 UPDATEs populate them from `LEGACY_DECOMPOSITIONS` for all 55 rows. `base_process` locked with NOT NULL + CHECK (4 bases) + index. Legacy `brews.process` text column untouched (dropped in 1e.4 when /processes is redesigned). Post-migration base distribution: Washed 31, Natural 19, Honey 5, Wet-hulled 0. |
| 026 | Moonshadow Washed correction (post-ship 1e.2 fix): 025's pre-sprint audit over-read "Moonshadow Washed" as a full mis-label (plain Washed); Chris confirmed post-ship it's a legitimate rare Washed variant of Moonshadow — MSW1 Airworks x Shoebox x Alo special-release collab lot, same drying signature applied to a washed ferment. Single-row UPDATE reinstates `drying:[Dark Room Dried, Slow Dry] + signature:Moonshadow` (base stays Washed). No schema change. |
