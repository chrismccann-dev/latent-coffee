# Latent Coffee Research — Product Document

*Last updated: 2026-05-07*

---

## What This Is

Latent Coffee Research is a personal coffee research journal that compounds brewing and roasting knowledge over time. It serves two distinct workflows:

**Brewing is archive-driven.** The 5-10 brew attempts to dial in a recipe happen in claude.ai using the Brewing Master Reference; only the final best brew lands in the app, with recipe, sensory profile, and learnings.

**Roasting is iterative.** Because each lot takes weeks to resolve and the Roest API is integrated, every roast log, experiment, and cupping flows into the app as the work happens. The app accumulates the journey in real time, then closes with a reference roast and a per-bean roast_learnings synthesis when the lot is done.

The result is the same in both cases: a structured, queryable record that the next coffee can build on — instead of starting from scratch every time.

The goal is two things:

1. **Training for World Brewer's Cup level mastery** — building a deep, structured understanding of how cultivars, terroirs, processes, and extraction strategies interact to create the best possible cup expression.
2. **Compounding a knowledge base** — so that when a new green bean or roasted coffee arrives, there's a solid foundation of prior learnings to start from instead of starting from scratch every time.

---

## Who It's For

Chris McCann. Single user. The app uses Supabase Auth with Row Level Security, but there is one user and no plans for multi-tenancy.

---

## Core Workflows

There are two parallel paths that both end in the same archive:

### Path 1: Purchased (Roasted) Beans

```
Buy specialty coffee
    → Use Claude project + Brewing Master Reference to iterate brew recipes
    → Find best brew expression
    → Archive in app via push_brew MCP Tool: recipe, sensory notes, terroir, cultivar, extraction strategy, what I learned
```

The Brewing Master Reference (a living document) drives the iteration. It contains:
- A structured **brew prompt** that Claude uses to design recipes (Coffee Brief → Strategy Confirmation → Recipe → Iteration Loop)
- Six **extraction strategies** post-v8.4: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid (with 5 hybrid sub-forms)
- Three **modifiers**: Output Selection / Inverted Temperature Staging / Aroma Capture (Immersion absorbed into Hybrid in v8.4)
- **Roaster reference cards** with house style tags per roaster (split to `docs/brewing/roasters.md` in Sprint 2.4)
- **Archive patterns** — strategy-level learnings organized by process, variety, and cooling behavior

The app does NOT store iterations. Only the final best brew.

### Path 2: Self-Roasted (Green Beans)

```
Source green beans (importers, farm direct)
    → Onboard via push_green_bean + push_inventory + push_roast_profile (Roest API write)
    → Roast in sets of 3 as experiments (vary one variable per set)
    → Pull roast logs via pull_roest_log + push_roast per batch
    → Cup each roast at Day 7 → push_cupping
    → Push experiment record per set → push_experiment (UPSERT as iteration progresses)
    → Iterate until reference roast candidate confirmed
    → Treat reference roast like a purchased bean → optimize brew recipe via BREWING.md flow
    → Lot close-out via closed-bean-full-fill prompt: push_roast_learnings + push_brew (SR reference brew) + propose ROASTING.md close-out narrative
```

Roasting iterates incrementally — each roast session and cupping session syncs to the app via MCP Tools as the work happens, not at lot close. claude.ai uses the `in-process-bean-incremental-sync.md` prompt for mid-iteration syncs and the `closed-bean-full-fill.md` prompt for close-out (which bundles the SR reference brew push).

Key roasting principles (see ROASTING.md for the full reference):
- **Express on whichever layer fits the coffee** — Chris controls both roast and brew, so a loud roast (Mandela XO) can be controlled with heavy-suppression brewing, or a restrained roast can be pushed with Full Expression
- Experiments are structured A/B/C tests with a single variable changed per set
- The roast_learnings record captures what was learned at the bean level: aromatic behavior, structural behavior, primary levers, failure signals, cultivar-specific takeaways

### Equipment Context

- **Grinder:** Weber EG-1 (one at home, one at office) — large flat burr, tight particle distribution. Grind range 6.0-6.8 is the operating window; below 6.0 hits diminishing returns. Full setting taxonomy in [docs/taxonomies/grinders.md](docs/taxonomies/grinders.md).
- **Brewers (owned):** Orea v4, April Brewer, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper (valve-controlled contact time), UFO Ceramic, Hario V60, Hario Switch, Weber Bird, xBloom, Chemex Funnex, Sibarist Brewing System, Oxo Rapid Brewer. Full taxonomy + per-entry specs in [docs/taxonomies/brewers.md](docs/taxonomies/brewers.md).
- **Roaster:** Roest L200 Ultra (counterflow mode, 100g batches). Roest API integration for push (profile design + inventory) and pull (roast logs).
- **Water:** Home uses distilled + remineralized (Third Wave Water Light Roast packs); office uses Palo Alto tap.
- **Filters:** Sibarist (FAST + B3 across cone/flat/wave/HALO sizes), xBloom Premium Paper (canonical office paper, sometimes legacy-named "Espro Bloom"), Cafec (Abaca+ + T-90/T-92/T-83), Hario, others per brewer. Full taxonomy in [docs/taxonomies/filters.md](docs/taxonomies/filters.md).

---

## Data Model

### Entities and Record Counts (snapshot baseline)

Record counts move as Chris syncs new work. Treat the baseline below as "what shipped through April 2026"; query the DB for the current count when accuracy matters.

| Entity | Baseline (April 2026) | Description |
|--------|---------|-------------|
| **brews** | 55 (51 purchased, 4 self-roasted) | Best brew archives. Grew through Sprint 2.1+ dog-food rounds (Picolot Emerald, Janson Green-Tip Gesha, Mandela XO SR brew, Dongzhe HLE 5th brew, etc.) |
| **terroirs** | 22 | Geographic/ecological zones |
| **cultivars** | 30 | Coffee varieties with genetic taxonomy. Grows when net-new cultivars resolve (e.g. Mokka instantiated in Sprint 2.1) |
| **green_beans** | 4 (CGLE Sudan Rume Hybrid Washed + 3 others) | Raw coffee lots. Grew through Sprint 2.5+ (CGLE Mandela XO + active 5-lot rotation per ROASTING.md) |
| **roasts** | 61 | Individual roast logs per green bean. Grows continuously via push_roast |
| **cuppings** | 17 | Cupping evaluations per roast. Grows continuously via push_cupping |
| **experiments** | 18 imported (migration 019) | Structured A/B/C roast experiments. UPSERTs as iteration progresses |
| **roast_learnings** | 4 | Per-bean synthesis. One row per closed lot |
| **process_syntheses** | cache | AI synthesis keyed on (user_id, process), populated on-demand from /processes/[slug] pages |
| **roaster_syntheses** | cache | AI synthesis keyed on (user_id, roaster), populated on-demand from /roasters/[slug] pages |
| **doc_proposals** | queue | Pending prose-doc-change proposals (Sprint 2.4, migration 037). Walked by arbiter. |
| **taxonomy_overrides_queue** | queue | Pending canonical-promotion entries across 7 axes (Phase 3, migration 045). Walked by arbiter. |
| **api_keys** | 1 | MCP bearer-token auth (Sprint 2.3, migration 036) |
| **oauth_authorization_codes** | transient | OAuth 2.1 + PKCE codes for claude.ai web MCP (Sprint 3.0, migration 043) |

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

### Canonical Registries — full index

The data model enforces canonical naming through 8 registries (one per `/add` data axis), each backed by a **3-layer authoring pattern**:

1. **Authored markdown** in `docs/taxonomies/<axis>.md` (or `lib/<axis>-registry.ts` source comments where no .md exists yet) — Chris's source of truth, hand-edited.
2. **Validation registry** in `lib/<axis>-registry.ts` — TypeScript mirror, exports a `CanonicalLookup` bundle via [`makeCanonicalLookup`](lib/canonical-registry.ts).
3. **DB column or FK** on `brews` (or `green_beans`) — text-only for some axes, FK for cultivar/terroir.

`CanonicalLookup` exposes 5 methods used identically across every registry: `isCanonical(input)`, `findClosest(input)`, `isResolvable(input)` (canonical OR alias-resolvable; gates the save button), `canonicalize(input)` (returns the title-case canonical form for write paths — fixes case-drift), and `list` (the canonical name array, for `<datalist>` autocomplete).

| Axis | Authored content | Validation registry | DB shape | Canonicals + aliases | Sprint |
|---|---|---|---|---|---|
| **Variety / Cultivar** | [docs/taxonomies/varieties.md](docs/taxonomies/varieties.md) | [lib/cultivar-registry.ts](lib/cultivar-registry.ts) | FK `brews.cultivar_id` → `cultivars` table | 63 canonicals + 48 aliases | 1a.1 / 1a.2 / 1b ✅ |
| **Region / Terroir** | [docs/taxonomies/regions.md](docs/taxonomies/regions.md) | [lib/terroir-registry.ts](lib/terroir-registry.ts) | FK `brews.terroir_id` → `terroirs` table | 121 macros across 38 countries + 12 aliases | 1d.1 / 1d.2 / 1d.3 ✅ |
| **Process** | [docs/taxonomies/processes.md](docs/taxonomies/processes.md) | [lib/process-registry.ts](lib/process-registry.ts) | 8 structured columns on `brews` (base + subprocess + 4 modifier arrays + decaf + signature) + legacy `process` text | Composable: 4 bases + 7 honey subs + 13 fermentation + 5 drying + 7 intervention + 4 experimental + 4 decaf + 3 signature + ~70 aliases | 1e.1 / 1e.2 / 1e.3 ✅ |
| **Roaster** | [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md) | [lib/roaster-registry.ts](lib/roaster-registry.ts) | text `brews.roaster` (no FK) | 70 canonicals across 6 families + 24 aliases | 1h.1 / 1h.2 ✅ |
| **Roast Level** | [docs/taxonomies/roast-levels.md](docs/taxonomies/roast-levels.md) | [lib/roast-level-registry.ts](lib/roast-level-registry.ts) | text `brews.roast_level` (no FK) | 8 Agtron-anchored buckets + 22 aliases (5 marketing tags + 17 drift) | 1m ✅ |
| **Grinder + Grind Setting** | [docs/taxonomies/grinders.md](docs/taxonomies/grinders.md) | [lib/grinder-registry.ts](lib/grinder-registry.ts) | text `brews.grinder` + `brews.grind_setting` (no FK) | 1 canonical (EG-1) + 51 enumerated settings (16 with rich content) + 7 aliases | 1k ✅ |
| **Producer** | [docs/taxonomies/producers.md](docs/taxonomies/producers.md) | [lib/producer-registry.ts](lib/producer-registry.ts) | text `brews.producer` (no FK) | 120 canonicals across 6 producer systems + 64 aliases | 1l ✅ |
| **Flavor notes** | [docs/taxonomies/flavors.md](docs/taxonomies/flavors.md) | [lib/flavor-registry.ts](lib/flavor-registry.ts) | `jsonb` `brews.flavors` (array of `{base, modifiers[]}`) + `text[]` `brews.structure_tags` + `text[]` `brews.flavor_notes` (denormalized display) | 3-axis composable: 181 base flavors across 12 categories + 43 modifiers across 10 categories + 29 structure descriptors across 7 axes + 112 aliases | 1g ✅ |
| **Brewer + Filter** | [docs/taxonomies/brewers.md](docs/taxonomies/brewers.md) + [docs/taxonomies/filters.md](docs/taxonomies/filters.md) | [lib/brewer-registry.ts](lib/brewer-registry.ts) + [lib/filter-registry.ts](lib/filter-registry.ts) | text `brews.brewer` + `brews.filter` (no FK) | 46 brewers (12 owned) + 64 filters (22 owned) + 24 brewer aliases + 34 filter aliases | 1f ✅ |

**Shared infrastructure:**
- [`lib/canonical-registry.ts`](lib/canonical-registry.ts) — `makeCanonicalLookup(names, aliases?)` factory used by every registry above. 3-tier classifier (exact → alias → substring → 3-char prefix) + `canonicalize()` write-path method.
- [`components/CanonicalTextInput.tsx`](components/CanonicalTextInput.tsx) — single-value typeahead + `<datalist>` + amber "did you mean X?" warning + optional `allowOverride` "Use anyway" link. Used identically across `/add` purchased step 6 + `/brews/[id]/edit` for every text-based axis (cultivar / terroir / process / roaster / roast level / grinder / producer / brewer / filter).
- [`components/SaveGateWarning.tsx`](components/SaveGateWarning.tsx) — accepts `requirements: { met, message }[]` and renders the amber "CANNOT SAVE YET" block. Used on both /add and /edit.
- [`lib/brew-import.ts`](lib/brew-import.ts) — `findOrCreate*` helpers (`findOrCreateCultivar`, `findOrCreateTerroir` for FK-backed axes; `findOrCreateRoaster`, `findOrCreateProducer`, `findOrCreateGrinder`, `findOrCreateBrewer`, `findOrCreateFilter` for text-only-with-override-escape-hatch axes — all delegate to a shared `validateCanonicalText` helper extracted in the 1f /simplify pass; rule-of-five).
- [`lib/canonical-registry.ts`](lib/canonical-registry.ts) `isOverridableValid(value, lookup, overridden)` — save-gate validity for any `CanonicalTextInput` with `allowOverride`. Extracted in the 1f /simplify pass; rule-of-ten across /add + /edit.
- [`app/api/brews/[id]/route.ts`](app/api/brews/[id]/route.ts) PATCH — `canonicalizeOverridable(patch, body, field, lookup, overrideKey)` helper for the 5 text-only axes that share the `allowOverride` shape (roaster + producer + grinder + brewer + filter; extracted in 1l /simplify pass when rule-of-three hit).

**Discipline rules (apply to every registry):**
- Adding a new canonical entry is a 2-step deliberate edit: (1) `docs/taxonomies/<axis>.md` per-entry section, (2) `lib/<axis>-registry.ts` `<AXIS>` array. If an existing DB row needs renaming, add a 3rd step: a DB migration.
- Aliases are "we know what you mean — write the canonical form." `isCanonical` returns false on aliases; `findClosest` and `canonicalize` resolve them. Use aliases for accent / spelling drift, lot-vs-producer collapses, deprecated names → current names.
- For text-only-no-FK axes (roaster / producer / grinder), the `allowOverride` escape hatch on `CanonicalTextInput` lets users persist a verbatim string when a canonical doesn't yet exist. The override mode is opt-in per axis (cultivar / terroir / roast level stay strict-no-override).
- Migrations that rename DB values (e.g. `brews.roaster = 'Moonwake' → 'Moonwake Coffee Roasters'`) must also update any `<axis>_syntheses` cache table keyed on the same string. Currently only `roaster_syntheses` and `process_syntheses` exist.
- Macro must represent a true ecological system (elevation band + climate regime + soil base). New macros require validation: does it change extraction behavior? Would you roast differently? Meso terroirs (municipality/valley/ridge) are sub-units; admin regions are traceability-only, never ecological labels.

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
| **/add** | Built | Both flows shipped. Self-roasted: 9-step wizard. Purchased: review-step flow with canonical pickers (cultivar / terroir / process / roaster / producer / brewer / filter / grinder / roast level + flavor composer + structure tags + extraction modifiers). Most write traffic now flows through MCP `push_brew` from claude.ai instead of the UI. |

### What Works Well

- Terroir and cultivar pages aggregate learnings at the right level (macro terroir, lineage)
- AI synthesis provides useful first-person narrative summaries
- All FK relationships are solid — no broken links, no orphaned records
- Green bean detail pages show the full roasting journey (logs → experiments → cuppings → learnings)
- Data model supports both purchased and self-roasted workflows

### Recently shipped

Sprint-by-sprint shipped log moved to [docs/sprints/shipped.md](docs/sprints/shipped.md) as part of the May 2026 doc cleanup PR. Per-sprint retrospectives still live in `memory/project_*.md` (one file per sprint).

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

Chris's palate has widened substantially over time. The earlier framing (clarity-first, tea-structured, low-tolerance for naturals and ferments) no longer reflects the current preference set. The current profile is better described as **expression-seeking with a roast-character floor and a perfume ceiling**.

### What Chris looks for

The primary thing Chris is chasing is **expressiveness** — coffees with character, intent, and clarity of purpose, regardless of process category. A wide range of flavor profiles are actively enjoyed when the coffee is roasted and brewed well: fruity, tea-like, floral, wine-like, juicy, milk-tea-like, complex, loud, elegant, and well-executed savory notes all land. Delicate, quiet, soft styles are still appreciated, but no longer the default preference — naturals, honeys, and processed coffees are now genuinely enjoyed alongside washed lots when the underlying coffee has integrity.

A secondary thing Chris values is **craft signal in the brew** — evidence that the brewer understood the coffee's inherent character and shaped the extraction to show it off. A recipe that visibly suits the specific lot reads as a positive in itself, separate from the cup outcome.

### What Chris rejects

Three anti-patterns reliably break the experience:

- **Artificial perfume character.** The candy-shop, perfume-like, synthetic floral quality that sometimes shows up in heavily-processed coffees. The process itself isn't the problem; the perfume artifact is. This is a hard ceiling — no amount of clarity or sweetness redeems a perfume note.
- **Roast character bleeding into the cup.** Strong roast notes, dominant chocolate, smoky/toasty depth, and the medium-to-medium-dark profile in general. Chris brews and prefers light to ultra-light roasts; anything where the roast development overtakes the bean's origin character is a miss.
- **Bitterness and roast-driven heaviness.** Overly bitter cups, dry/astringent roast tails, and any cup where roast-derived bitterness is the dominant impression. This connects to the temperature-as-finishing-lever work in the rest of the system — bitter tails are usually solvable, but a cup that lands bitter is not enjoyed regardless of cause.

### What this means for the brew system

The framework (BREWING.md's two-axis model — extraction strategy + modifiers) still applies — all six strategies in the current framework serve coffees Chris now enjoys. The framework's job is no longer to filter coffees toward a narrow preference; it's to match strategy to the specific lot's signals so the coffee's intended character comes through cleanly. The constraint that does still narrow the field is roast level: Chris primarily buys light to ultra-light, so the brew system rarely needs to engage with medium-roast extraction problems.

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
- **`<FlavorComposer>`** — chip composer for the 3-axis flavor system. Single typeahead per chip (autocomplete mixes bases + aliases); click chip to expand 3-slot inline editor (base + 2 modifier dropdowns). Tea-base modifier expansion + allowOverride. Replaces the deprecated `<FlavorNotesInput>`.
- **`<StructureTagsPicker>`** — axis-grouped pickers for per-coffee structure descriptors (4 always-shown + 3 collapsible).
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

## Roadmap

The full forward-looking work surface, structured by readiness + scope. Per-sprint retrospectives live in `memory/project_*.md`. Sprint-by-sprint shipped log is at [docs/sprints/shipped.md](docs/sprints/shipped.md).

**Last reorder:** 2026-05-08 (post-v8.5 sweep — PRs #112 + #116 + #117 + #114 follow-up #115 moved to shipped.md; Newly queued subsection cleared since all 3 entries shipped same-week). Prior reorder same-day (PR #114). Prior reorder 2026-05-07 (May 2026 doc cleanup PR collapsed Active Sprint Queue + Long-term Roadmap + Future Directions + Current App State § What's Missing into a single 7-section Roadmap. Tool count 32 post-Roest write integration.)

### Active Sprints

The current ranked queue of scoped, sized sprints in flight or next up.

#### 1. Sprint 2.7.5 — Workflow walkthrough

Audit Chris's actual brewing + roasting workflow end-to-end on the v9 stack to surface friction points that only show up in real iteration. Brief lives at `SPRINT_2_7_5_BRIEF.md` (find via `find /Users/chrismccann/latent-coffee/.claude/worktrees -name "SPRINT_2_7_5_BRIEF.md"`).

**Iteration plan:** 5 brews end-to-end + 3 roasting sessions (intake / iteration / mid-loop, NOT full close-out cycles per the multi-week loop time). Phase B (brewing audit) ships once 4-5 brews are done; Phase C (roasting audit) covers steps 1-3 (intake / push_roast / cupping) and parks lot-close steps 4-5 for a later session. The two phases ship independently.

**Output:** punch list of friction points categorized as workflow tweaks (inline-fixable in the same PR) / MCP enhancements (queued to next feedback batch in `feedback_v2_mcp_feedback_log.md`) / architectural items (queued to Sprint 3.1).

**Sizing:** ~2-3h. Async-friendly because it's gated on iteration cadence, not Claude availability.

#### 2. Sprint 3.1 — Architectural-queue brainstorm

Same shape as Sprint 2.2 brainstorm: plan-mode design, no code, AskUserQuestion rounds. Pulls in:

- ~10 architectural-queue items pending in `feedback_v2_mcp_feedback_log.md` pre-Phase-3 (the cluster that didn't fit in Phases 1-3).
- Whatever 2.7.5's punch list flags as architectural (vs workflow / MCP enhancement).
- Phase 3 PR #105 deviations (backfill SQL skipped per substrate gap on `*_override` columns; SR `/add` direct-insert path retains DEFAULT canonical provenance; `/green/[id]` UI doesn't surface provenance / `canonicals_updated_at`).
- 3.0 OAuth retro follow-ups (Anthropic-style OAuth error wrapping; `.env.local` git-tracked hygiene fix).

**Triggers when:** 2.7.5 wraps. Brainstorm output is a scoped sprint queue, not code.

#### 3. General cleanup sprint — 3 tracks

Three independently-scopable cleanup tracks Chris flagged 2026-05-05 post-Phase-3. Bundle into one sprint or ship separately. Full scope in `memory/project_general_cleanup_sprint.md`.

- **Track 1 — Docs consolidation pass.** Shipped 2026-05-07 in the May 2026 doc cleanup PR (covers BREWING / ROASTING / docs/prompts / docs/taxonomies / SYNC_V2 / ARBITER / CLAUDE / PRODUCT / README + Documentation Indexes + SYNC.md + design-brief.md deletions + April Brewer registry fix + Documentation Index + Doc-touch sprint cadence rule + cuppings.sweetness + cuppings.temperature_behavior schema migration).
- **Track 2 — Data sanity audit.** Shipped 2026-05-08. `scripts/data-sanity-audit.ts` + dry-run report at `docs/audits/track-2-2026-05-08.md`. 159 findings across 7 dirty dimensions (process recompose, producer drift, terroir orphans, roast→cupping completeness, synthesis cache staleness, provenance markers). Bucket A fixes split to a follow-up PR; Bucket B items either queued as mini-sprints or bundled with Track 3.
- **Track 3 — Page-design refresh.** Bundle with future design sprint per Chris's call. Stale fields displayed, ordering drift, Phase 3 surfaces not yet rendered (provenance flags), mobile regressions, inconsistencies between aggregation detail pages. ~4-6h. Don't ship standalone; wait for the Claude-Design redesign window. Will also absorb the synthesis-cache-keyed-on-terroir_id architectural finding from Track 2 (see audit report § dim 12a).

**Recommended order:** Track 1 (shipped 2026-05-07) → Track 2 (shipped 2026-05-08) → Track 3 bundled with redesign.

#### 4. Per-entity directed synthesis

Promoted from Longer Term Items 2026-05-08 — the next non-blocked sized sprint slot, queued behind two side-quest sessions (`latentcoffee.com` HTTPS bug + MEMORY.md consolidation, both flagged elsewhere in the roadmap and being handled in dedicated sessions).

Today's `cultivar` / `terroir` / `processes` / `roasters` synthesis prompts are too generic — Chris's framing: "If it's about Volcán Barú Highlands where I had 24 coffees, the insight shouldn't be 'taste the coffee cooler', it should be more directed about that specific terroir." Per-entity prompt customization that uses brew count + dimension salience + entity-specific context (e.g. terroir's macro-level processing + variety mix; roaster's BMR strategy tag) to direct the synthesis.

**Sizing:** ~1-2 sprints; needs plan-mode brainstorm first since the prompt-engineering shape is interpretive. Touches `/api/{terroirs,cultivars,processes,roasters}/synthesize`.

**Compounds with:** the per-roaster archive page enhancement (Longer Term) — same prompt-customization machinery becomes the template for `/cultivars/[id]` + `/terroirs/[id]` + `/processes/[slug]` archive surfaces. Also compounds with `/brews/[id]` lessons rework. See `Longer Term Items § Per-entity directed synthesis` for the original framing.

**Triggers when:** the two side-quest sessions wrap, OR Chris pulls the trigger sooner.

### Side Quests

Logged but not auto-queued — promote when a trigger fires.

- **Edit-form mobile polish** — `/brews/[id]/edit` grid-cols-2 truncates longer canonical values at 375px. Bundle with the Claude-Design redesign sprint.
- **Producers aggregation starting point** — mechanical 1-day "copy the /roasters pattern" sprint. Unblock when 2+ producers have 3+ brews each. See [Future Directions § Producers as a first-class citizen](#future-directions) for the medium-term framing the brainstorm needs to precede.
- **Process qualifiers schema (Anoxic + future) — sub-sprint 1e.5.** `processes.md` defines the `Anoxic` qualifier on `[Anaerobic]` (sealed-container, no-headspace) but brew-row storage is pending. ~1 sprint when `/processes` aggregation needs the Anoxic vs plain Anaerobic split or when a 2nd Anoxic brew lands.
- **/processes page redesign (sub-sprint 1e.4)** — faceted by base + modifier axis. Drops `brews.process` text column. Defer unless `/processes` becomes blocking. Bundle with Track 3 of the cleanup sprint.
- **MEMORY.md consolidation** — index at 27.2KB / 24.4KB warning threshold. Index entries are too long; main fix is shrinking lines, not deleting memories. Run `consolidate-memory` skill in its own session; not blocking active sprints.
- **Commit taxonomy-port generator scripts to `scripts/taxonomy-ports/`** — ~30-min task; fires when Chris wants deterministic re-porting from the source CSV.
- **Producer research routine — option (b) auto-research subagent during arbiter** — flagged 2026-05-07 doc review. Today's arbiter manually researches each queued producer. Future enhancement: arbiter spawns a research subagent that drafts a `ProducerEntry` shape per queued producer, surfaces for Chris's sign-off. Reduces manual web-research time. Trigger: when manual cadence becomes onerous.
- **Brew-Reveals-Roast self-coaching question on Optimized Brew Session checklist** — light prompt addition: *"Before iterating on the brew recipe, ask: am I missing something the roast can already deliver that this evaluation recipe doesn't surface?"* Chris flagged this as an ongoing skill gap.

### Blocked and Parked

- **Claude-Design-led redesign** — moved to [Longer Term Items § Redesign](#longer-term-items). Chris has done his design side and the output is ready; waiting on app stability.
- **Split `brews.producer` into `producer_name` + `farm_name`** — demoted 2026-05-05. Less important now post-producer-taxonomy (the 120-canonical registry already covers most of the cases the split would have served). If it comes back, it'll be inside the Producers-first-class-citizen brainstorm in Future Directions, not as a standalone sprint.

### Missing and Incomplete

(Relocated from the prior `Current App State § What's Missing` location during the May 2026 doc cleanup. Items here are "this exists but is broken or stub-state" — distinct from Longer Term Items, which are "this works but the surface is thin / not optimized.")

- **Experiments table — partially backfilled.** Schema supports structured A/B/C/D experiments with full hypothesis → outcome → insight flow. 18 experiments imported (migration 019) for the 4 green beans currently in the database. The roasting spreadsheet has 16 additional experiments tied to 5 CGLE / Forrest / Higuito beans whose green_beans rows have not been imported yet — these will land event-driven per the workflow rule below.
- **Cross-dimensional search — saved/named views missing.** Brews list filters across 5 dimensions (extraction strategy / process / roaster / lineage / macro) with multi-select within and intersection across. URL-driven state, shareable links, back-button works. Still missing: full-text search across `what_i_learned` narratives; saved / named views.
- **Schema gaps from the May 2026 doc review:** `cuppings.sweetness` + `cuppings.temperature_behavior` columns missing from current schema. Tiny migration shipping in the same doc cleanup PR.

### Bugs and Issues

_None._

### Workflow rule that bounds the sprint queue

Per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves (green bean → roasts → experiments → cuppings → lessons → reference roast → perfected brew). The mid-iteration beans not yet in the DB (CGLE Mandela XO / Sudan Rume Washed / Sudan Rume Natural / Forrest Gesha Clouds / Higuito Anaerobic Bourbon / et al) are NOT a backlog. They land event-driven when each bean finalizes. **Do not propose a "backfill the missing beans" sprint.**

### Longer Term Items

Scoped, sized, and ready-to-launch when timing is right. Not currently ranked in Active Sprints but represent committed near-future direction. Promote into Active when triggered.

#### Surface polish (drives compounding)

- **Green-bean surface polish** (highest-priority surface per Chris, 2026-05-05). `/green/[id]` is the weakest detail surface today. Bundles three things:
  - **Schema additions for dropped source data** — most already shipped in migration 039 (elevation / producer_tasting_notes / exporter / tp_temp). Remaining additions are now just `cuppings.sweetness` + `cuppings.temperature_behavior` (shipping in the May 2026 doc cleanup migration). Update `/add` parsers + `handleSaveSelfRoasted` + `/green/[id]` render to surface these new cupping fields.
  - **Phase 3 provenance UI surface** — `terroir_provenance` / `cultivar_provenance` / `canonicals_updated_at` are queryable today but unrendered (deferred from PR #105 per design doc cross-system audit checklist). Render in GREEN BEAN DETAILS block; toggle filter on `/green` index for "auto-created vs canonical" terroirs.
  - **Reference Roasts entity** (was Active Queue #5, scoped 2026-04-21). New `reference_roasts` table replacing `roast_learnings.best_batch_id` + `roasts.is_reference`. One FK to canonical reference roast + array of replication FKs + `why_this_roast_won` prose moved from roast_learnings + nullable `brew_id`. Renders in BEST ROAST block enriched with FC/drop/dev/Agtron + replication batches + brew backlink. Sprint B of [docs/features/reference-roast-and-guide.md](docs/features/reference-roast-and-guide.md).
  Likely 1-2 stacked sprints. **Triggers when:** roasting parity becomes load-bearing, or after 2.7.5 surfaces specific green-bean friction.

- **Per-entity directed synthesis** (Chris-flagged 2026-05-05). Today's cultivar / terroir / processes / roasters synthesis prompts are too generic. Chris's framing: "If it's about Volcán Barú Highlands where I had 24 coffees, the insight shouldn't be 'taste the coffee cooler', it should be more directed about that specific terroir." Per-entity prompt customization that uses brew count + dimension salience + entity-specific context (e.g. terroir's macro-level processing + variety mix; roaster's BMR strategy tag) to direct the synthesis. Likely under-the-hood prompt-engineering more than UI; touches `/api/{terroirs,cultivars,processes,roasters}/synthesize`. ~1-2 sprints; needs plan-mode brainstorm. Compounds with the brews/[id] lessons rework below.

- **/brews/[id] detail rethinking** (Chris-flagged 2026-05-05). Detail page currently buries `what_i_learned` + lessons. Hero is good post-redesign-port; the lessons rendering needs rethink. Likely a structured-prose convention or per-brew directed-prompt approach mirroring the per-entity synthesis rework above. **Bundle with:** Claude-Design redesign or as standalone if Claude-Design is delayed.

- **Per-roaster archive page enhancement.** `/roasters/Hydrangea` exists but is thin. Adds "Your N brews from this roaster: pattern, top 3, where you drifted, what to try next." Half the substrate is already there (synthesis cache + brew list); adds a directed-prompt + UI rework. ~1 sprint. **Compounds with:** per-entity directed synthesis rework above. Becomes a template for the `/cultivars/[id]` + `/terroirs/[id]` + `/processes/[slug]` archive surfaces too.

- **Homepage that isn't just a login button** (Chris-flagged 2026-05-05). Today the app's root surface is unauthenticated to login. Logged-in homepage gap. Likely shape: recent brews tile + recent green beans tile + a directed-synthesis tile ("you've been brewing a lot of Sidamo lately - here's a pattern"). Bundle with the surface-polish wave or the Claude-Design redesign.

#### Workflow + sync

- **Experiments + Cupping History rework** (Chris-flagged 2026-05-05: scoped-but-needs-brainstorm). Both `/green/[id]` sections need rethinking. Experiments: 6 schema fields render, 10 hidden — introduce a collapsible pattern or A/B/C/D side-by-side grid so `levels_tested` + `observed_outcome_a/b/c/d` surface. Cupping History: 27 rows flat is unreadable — group by batch (collapsible) or by rest-day phase (Day 3-5 cupping vs Day 7+ pourover). Plan-mode interpretive sprint, 1 sprint after brainstorm. Depends on a populated real bean for preview verification.

- **Auto-research on green bean upload** (Group D #5 from 2026-05-05 brainstorm). claude.ai already does auto-research when assembling Chris's inventory list; the open question is what should live in the app vs claude.ai. Likely a thin sub-sprint: surface what claude.ai produces in `/green/[id]` (or `/inventory/[id]`) as a "research notes" block, structured + propose_doc_changes-able. Not a fully-scoped sprint yet. **Triggers when:** green-bean polish bundle starts and the right shape becomes clear.

#### Redesign

- **Claude-Design-led redesign.** Chris finished a redesign session with claude.ai/design 2026-04-25 and the output is ready-to-launch. Waiting on app stability (post-2.7.5 punch-list resolution + post-cleanup-sprint). Probably its own large sprint; scope re-examines desktop vs mobile as a first-class consideration since the current rule "desktop-first with mobile spot-check" was set before Chris's brewing surface fully shifted to mobile claude.ai. Anything shipped between now and the redesign must stay modular (route through `<SectionCard>` / `<Tag>` / `<TagLinkList>` / `.label`; no new tokens / colors / spacing unless a canonical registry requires it). **Triggers when:** Active Sprints clear + a stable surface window opens.

---

## Future Directions

Idea-stage work - not yet scoped, may never ship in current form. These are the "what could compound knowledge in the long run" thoughts.

### Compounding shape (Chris-framed 2026-05-05)

- **Recipe accelerator on new bean intake.** Long-term goal #1: "If I see a green bean or roasted bean, I can get to the end final cup much faster based on all accumulated knowledge." Today aggregation pages summarize but don't predict. Likely shape: given a new green bean's (cultivar + terroir + producer + process), surface "your data implies start at strategy X, ratio Y:Z, temp T" with confidence. Sister surface for purchased coffees uses (roaster + process + variety) to strategy default. Builds on per-entity directed synthesis (Long-term Roadmap). Risky framing; compelling endpoint.

- **Cross-pollination pushing.** Long-term goal #2: "Based on accumulated knowledge of me + sources outside of me (Brewers Cup champions), the app pushes me to do things I wouldn't normally think about." Concrete example: claude.ai recently helped Chris design a brew for an upcoming brew comp using Wölfl's 2024 WBrC champion Extraction Push + an additional aroma_capture flare. That kind of cross-domain prompt - combining Chris's corpus with championship-recipe canonicals - could become a first-class app surface (or at least an MCP-side directed-prompt path). Connects to [BREWING.md](BREWING.md) § WBC Reference (Section 4) substrate already in place.

- **WBC champion recipe corpus expansion** (Chris-flagged 2026-05-05) - substrate that powers Cross-pollination pushing above. Today's corpus covers 2023 / 2024 / 2025 World Brewers Cup finalists (the source of the highest-leverage brewing ideas Chris has imported). Worth going further back in time to grow the corpus, plus adding sub-region winners (e.g. US Brewers Cup finalists for the past ~5 years). Lives in [BREWING.md](BREWING.md) § WBC Reference or a new `docs/brewing/champion-recipes.md` sub-doc. Authoring effort, not a code sprint. **Open question:** is there a roasting-side equivalent worth chasing? (Roasters Guild events, Coffee Roasters Guild championship, regional roaster competitions.) If yes, mirror this on the roasting substrate; if no, roasting compounding stays Chris-corpus + ROASTING.md cross-bean insights only.

### Surfacing what's already queryable

- **Time-window compounding.** "Things you've learned in the last 30/60/90 days" surface, distinct from all-time aggregations. Recency matters; calibration drifts. Could be a new aggregation page or a filter on existing surfaces.

- **Cross-domain insight digest.** "Your reference roasts share X" or "Your highest-rated brews cluster on Y" - synthesis surface or weekly digest. AI-driven cross-cut. Connects with time-window compounding.

- **Recipe drift visualizer per roaster.** `strategy_notes` + `extraction_strategy` + `extraction_confirmed` capture the "started Balanced, drifted to Suppression after 3 iterations" pattern but it's invisible. Surface it as a per-roaster mini-timeline.

- **Cooling behavior tracking.** Many brews have critical evaluation temperature thresholds (e.g. "do not evaluate before 50°C", "rose character only emerges near 40°C"). Scattered in `temperature_evolution` and `what_i_learned`; structured + searchable would help.

- **Cross-dimensional queries.** "Show me all Clarity-First brews on Gesha from the Central Andean Cordillera" or "Which cultivars required Full Expression regardless of process?" Today's filter UI on `/brews` covers the basic axes; this is the cross-cut layer above.

### Producers + farms

- **Producers as a first-class citizen** (medium-term, needs dedicated brainstorm). Today producers are a canonical free-text column on brews (120 canonicals post-1l). Surface-level goal: treat producers the way `/roasters` and `/terroirs` and `/cultivars` are treated - index + detail + synthesis. Real question goes deeper: what does Chris fundamentally want from producers as a data dimension? Sourcing intelligence (which farms have I bought from, which importers represent them, what does this producer's other work taste like)? Farm-level lineage tracking (multiple lots from same farm over time)? Relationship-graph mapping (producer to farm to importer to roaster)? Brainstorm precedes any code; use the four-part interpretive session pattern (probes, reference artifacts, output = `docs/features/*.md` scoping doc). Mechanical starting point is the 1-day `/roasters` mirror sprint logged in Active Queue § Side-quests. Open thread: farm + importer as sub-dimensions; whether `brews.producer` stays flat or splits into `producer_name` + `farm_name` + `importer_id`. **Deferred until:** corpus has signal (currently only Pepe Jijon / Finca Soledad has 3+ brews).

### Public surface (Chris-framed 2026-05-05)

Chris's framing: the app is a **living memory + livable archive** of all brews + roasts. Public surface emerges as a side-effect of polishing personal surfaces, not as its own project. Audience stays personal (single-tenant); writes stay Chris-only.

- **Single-brew share link.** Each `/brews/[id]` page renderable as a public read-only page (gated by Chris's per-brew toggle). Side-effect, not a project. Low effort once `/brews/[id]` polish lands.

- **Single-coffee share-to-roaster link.** "Here's how I brewed your coffee" send-to-roaster link. Social/community value; opens conversations with producers + roasters whose coffee Chris has brewed. Could double as the substrate for the share-to-producer pathway too.

- **Use cases driving public surface:** (1) social-media coffee posts back-referenced to canonical app pages, (2) share pages for specific brews, (3) showing producers / roasters what Chris did with their coffees, (4) general livable archive document for varied use. Triggers when knowledge has visibly compounded (substrate done + friction gone + several months of dense logging).

### Workflow integration (low priority, mostly covered)

- **Voice input for brew lessons.** claude.ai already covers voice via Anthropic-side; app-side voice path is lower priority since claude.ai to MCP path already works. Defer unless app-side voice surfaces specific friction.
- **Mobile / voice MCP brew logging while brewing.** Same: already covered via claude.ai voice + push_brew. Defer unless friction surfaces.

### Backfills

- **Backfill remaining `what_i_learned`** - ~19 brews still missing long-form learnings. Bundle with the per-brew directed-prompt rework so Chris isn't writing generic prose.

### Substrate expansion (Chris-gated, future)

- **Filter drawdown comprehensive test** (Chris-driven, 2026-05-07 doc review). Empirical timing of every owned filter on real coffee beds. Output: per-filter measured drawdown adds to `BREWING.md § Filter System` table + possibly a new "measured flow rate (sec/100g)" column in `lib/filter-registry.ts`. Some filters labeled "slow" don't drain that slowly in practice — Chris wants precise data. Authoring effort, not a code sprint.
- **Water chemistry as 11th canonical taxonomy** (Chris-driven, 2026-05-07 doc review). New `lib/water-registry.ts` + `docs/taxonomies/water.md` mirror; new `brews.water` text-only canonical column; surface in BREWING.md as another `read_canonical(axis: "water")` lookup. Chris hasn't experimented with water chemistry yet but plans to. This is multi-week experimental work first, then a single comprehensive sprint when the canonical taxonomy is ready to author. **Triggers when:** Chris's water-chemistry experiments produce enough data to define canonical entries.

---

## Scaling Watch-Items

Tripwires for the 1,000-brew goal — what to watch as the corpus grows. Surfaced during the 2026-05-07 doc review's structural sanity check.

### Triggers that need action before 200+ brews

- **MCP Tool count discoverability** — currently 32 Tools; claude.ai's `tool_search` ranks opaquely. At 50+ Tools, consider Tool consolidation (merging related `push_*` into polymorphic) or better grouping (namespace prefix). Description-quality lever already pulled in PR #114 (MCP Tool descriptions audit); next mitigation is structural.

### Triggers that need action before 1,000 brews

- **BREWING.md Archive Patterns will balloon.** Today: ~16 entries under "Coffees That Confirmed Clarity-First." At 20× volume → 300+ entries per strategy. **Mitigation:** when BREWING.md crosses 250KB (currently 188KB; tripwire fires before 1,000), trigger an archive split sprint. Per-strategy subdoc pattern (`docs/brewing/archive-clarity-first.md` etc.). The 120KB tripwire on root-level living docs (added to CLAUDE.md sprint cadence) catches this category early.
- **MCP Resources index size** — 21 docs registered today. At 100+ (if archive splits go deep), the `list_docs()` catalog scan cost grows. Mitigation: grouping pattern (`docs://brewing/*`) already in use; when adding more, use the `description` field added in the cleanup PR so claude.ai routes accurately.

### Standing tripwires (always monitor)

- **120KB threshold on any single root-level living doc.** When crossed, plan a split sprint per the CLAUDE.md sprint cadence rule. Currently: PRODUCT.md ~143KB pre-cleanup (this PR drops it), BREWING.md 188KB, ROASTING.md 96KB. PRODUCT and BREWING already past it.
- **MEMORY.md index bloat.** Already at 27.2KB / 24.4KB warning threshold. Run `consolidate-memory` skill quarterly, not just when it warns. Index entries should be one line under ~150 chars each.
- **Drift between `lib/*-registry.ts` and `docs/taxonomies/*.md`.** No CI tooling enforces sync today; the planned `scripts/check-registry-md-sync.ts` (Active Sprints #4) is the permanent guard. Until then, manual discipline via the doc-touch sprint-cadence rule.
- **Cross-doc reference rot.** The Sprint cadence #4 ("Doc-touch check before PR") is the primary mitigation. Calendar-triggered monthly audit via `schedule` skill is the backstop.

### Things that scale cleanly (no action needed)

- DB tables (Postgres handles 1,000+ brews trivially)
- Aggregation pages (`/brews`, `/processes`, `/roasters`, `/terroirs`, `/cultivars` — they're queries)
- Canonical taxonomies (only grow when net-new entities appear; Phase 3 queue handles this gracefully)
- The asymmetric write-trust model (Tools for entities, propose-then-apply for prose) — load-bearing and proven across V2 dog-food rounds

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

## Where shipped sprint history lives

- **Sprint-by-sprint shipped log:** [docs/sprints/shipped.md](docs/sprints/shipped.md) — moved out of PRODUCT.md in the May 2026 doc cleanup.
- **Per-sprint retrospectives:** `memory/project_*.md` — one file per sprint, full narrative + lessons.
- **Migrations:** `supabase/migrations/*.sql` — each filename + header comment documents what changed. Authoritative source of truth; no need for a duplicated table here.
