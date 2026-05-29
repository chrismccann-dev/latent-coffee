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
    → Lot close-out via close-lot.md prompt: patch_roast (is_reference: true) + push_roast_learnings + push_brew (SR reference brew) + propose ROASTING.md close-out narrative + patch_inventory (Roest archive)
```

Roasting iterates incrementally - each roast session and cupping session syncs to the app via MCP Tools as the work happens, not at lot close. The roasting workflow has two prompt families. V-set lots (5-10+ batches, comparative iteration) use 4 lifecycle-mapped operational prompts (one per lifecycle-state transition): `start-lot.md` (In inventory → Waiting for next roast), `log-roast.md` (Waiting for next roast → Waiting for next cupping), `log-cupping.md` (Waiting for next cupping → Waiting for next roast loop OR Resolved-pending), `close-lot.md` (Resolved-pending → Resolved; bundles the SR reference brew push). One-shot lots (single-batch samples ~100-120g, `green_beans.is_one_shot=true`, no iteration possible — auction-lot samples, farm-direct samples, rare allocations) use 2 prompts: `one-shot.md` (STAGES 1-4: intake + tolerance-anchored design + roast + Day 7 cupping) and `one-shot-closeout.md` (STAGE 5: optimized brew + constrained roast_learnings writes per migration 054 schema validation + ROASTING.md close-out + Roest archive).

Key roasting principles (see ROASTING.md for the full reference):
- **Express on whichever layer fits the coffee** — Chris controls both roast and brew, so a loud roast (Mandela XO) can be controlled with heavy-suppression brewing, or a restrained roast can be pushed with Full Expression
- Experiments are structured A/B/C tests with a single variable changed per set
- The roast_learnings record captures what was learned at the bean level: aromatic behavior, structural behavior, primary levers, failure signals, cultivar-specific takeaways

### Equipment Context

- **Grinder:** Weber EG-1 (one at home, one at office) — large flat burr, tight particle distribution. Grind range 6.0-6.8 is the operating window; below 6.0 hits diminishing returns. Full setting taxonomy in [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md).
- **Brewers (owned):** Orea v4, April Brewer, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper (valve-controlled contact time), UFO Ceramic, Hario V60, Hario Switch, Weber Bird, xBloom, Chemex Funnex, Sibarist Brewing System, Oxo Rapid Brewer. Full taxonomy + per-entry specs in [docs/skills/brewing-equipment-expert/cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md).
- **Roaster:** Roest L200 Ultra (counterflow mode, 100g batches). Roest API integration for push (profile design + inventory) and pull (roast logs).
- **Water:** Home uses distilled + remineralized (Third Wave Water Light Roast packs); office uses Palo Alto tap.
- **Filters:** Sibarist (FAST + B3 across cone/flat/wave/HALO sizes), xBloom Premium Paper (canonical office paper, sometimes legacy-named "Espro Bloom"), Cafec (Abaca+ + T-90/T-92/T-83), Hario, others per brewer. Full taxonomy in [docs/skills/brewing-equipment-expert/cluster/filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md).

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

The data model enforces canonical naming through 9 registries (one per MCP-validated data axis), each backed by a **3-layer authoring pattern**:

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
| **Grinder + Grind Setting** | [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) | [lib/grinder-registry.ts](lib/grinder-registry.ts) | text `brews.grinder` + `brews.grind_setting` (no FK) | 1 canonical (EG-1) + 51 enumerated settings (16 with rich content) + 7 aliases | 1k ✅ |
| **Producer** | [docs/taxonomies/producers.md](docs/taxonomies/producers.md) | [lib/producer-registry.ts](lib/producer-registry.ts) | text `brews.producer` (no FK) | 120 canonicals across 6 producer systems + 64 aliases | 1l ✅ |
| **Flavor notes** | [docs/taxonomies/flavors.md](docs/taxonomies/flavors.md) | [lib/flavor-registry.ts](lib/flavor-registry.ts) | `jsonb` `brews.flavors` (array of `{base, modifiers[]}`) + `text[]` `brews.structure_tags` + `text[]` `brews.flavor_notes` (denormalized display) | 3-axis composable: 181 base flavors across 12 categories + 43 modifiers across 10 categories + 29 structure descriptors across 7 axes + 112 aliases | 1g ✅ |
| **Brewer + Filter** | [docs/skills/brewing-equipment-expert/cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) + [docs/skills/brewing-equipment-expert/cluster/filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) | [lib/brewer-registry.ts](lib/brewer-registry.ts) + [lib/filter-registry.ts](lib/filter-registry.ts) | text `brews.brewer` + `brews.filter` (no FK) | 46 brewers (12 owned) + 64 filters (22 owned) + 24 brewer aliases + 34 filter aliases | 1f ✅ |

**Shared infrastructure:**
- [`lib/canonical-registry.ts`](lib/canonical-registry.ts) — `makeCanonicalLookup(names, aliases?)` factory used by every registry above. 3-tier classifier (exact → alias → substring → 3-char prefix) + `canonicalize()` write-path method.
- [`lib/brew-import.ts`](lib/brew-import.ts) — `findOrCreate*` helpers (`findOrCreateCultivar`, `findOrCreateTerroir` for FK-backed axes; `findOrCreateRoaster`, `findOrCreateProducer`, `findOrCreateGrinder`, `findOrCreateBrewer`, `findOrCreateFilter`, `findOrCreateSignatureMethod` for text-only-with-override-escape-hatch axes — all delegate to a shared `validateCanonicalText` helper).
- MCP write path consumes the helpers above via `lib/mcp/push-brew.ts` + `lib/mcp/patch-brew.ts` + `lib/mcp/canonicals.ts`. The `*_override` boolean flags on `push_brew` + `patch_brew` Zod schemas carry the same "use anyway" semantics the deleted `CanonicalTextInput` / `SaveGateWarning` form components used to surface, and trigger `taxonomy_overrides_queue` rows for arbitration. Form-side components + the `/api/brews/*` REST routes were deleted in Writing-path Sub-sprint 4 (2026-05-27).

**Discipline rules (apply to every registry):**
- Adding a new canonical entry is a 2-step deliberate edit: (1) `docs/taxonomies/<axis>.md` per-entry section, (2) `lib/<axis>-registry.ts` `<AXIS>` array. If an existing DB row needs renaming, add a 3rd step: a DB migration.
- Aliases are "we know what you mean — write the canonical form." `isCanonical` returns false on aliases; `findClosest` and `canonicalize` resolve them. Use aliases for accent / spelling drift, lot-vs-producer collapses, deprecated names → current names.
- For text-only-no-FK axes (roaster / producer / grinder / brewer / filter / signature_method), the `*_override` boolean flag on `push_brew` + `patch_brew` Zod schemas lets MCP callers persist a verbatim string when a canonical doesn't yet exist. The override mode is opt-in per axis (cultivar / terroir / roast level stay strict-no-override).
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
| **Brewing Master Reference** | Repo — `BREWING.md` (v7.1, living doc). Archival snapshot in Dropbox (`Coffee_Brewing_Master_Reference_v7.md`) for Claude projects. | Brew prompt for Claude, roaster reference cards, Cross-Coffee Insight Layer (renamed from `Archive Patterns` in Sprint 9 2026-05-19 to match ROASTING.md), equipment reference. Migrated into repo 2026-04-21 as the working copy for Claude-authored sync V1 — compounds edit-by-edit alongside `PRODUCT.md`. |
| **Terroir + Cultivar Ruleset** | Word doc | Data schemas, hierarchy rules, canonical registries, validation checklists |
| **Roasting Intent** | Word doc | Roasting philosophy — "roast for brewing tolerance, brew for intensity" (canonical post Sprint 10 / ADR-0007 rename; original Word-doc archival snapshot uses "elasticity") |
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

The brand voice is **quiet research notebook**: monospace labels, book-cover cards per brew, uppercase taxonomy, a restrained palette that lets coffee metadata do the talking. Code-level source of truth is `tailwind.config.ts` + `app/globals.css`. The Dropbox folder `Latent Coffee Design System/` is the **Claude Design skill workspace** (UI-kit prototypes, preview HTML, the mirrored `colors_and_type.css` reference) — it is not mirrored into this repo; the Tailwind config wins whenever they disagree.

**v2 re-skin (Redesign Sprint 0, 2026-05-29).** The palette moved from cool near-white + single sage to **warm paper** (`bg #F2F1EC` / `fg #0E0E0E`) with a 5-tone flavor-accent family + a formalized lifecycle-tile gradient, and a new `.ssp-*` "lab-document" primitive family (`components/Ssp.tsx`) landed alongside the legacy `SectionCard`/`Tag` chrome. Token *names* stay `latent-*` (zero JSX churn); only values changed + new families were added. v2's CSS-var names live in `:root` (`app/globals.css`) and back the `.ssp-*` classes. Governing principle: the claude.ai/design v2 system is a **source to pull from, not adopt carte blanche** — Latent's framework (Tailwind tokens, `lib/*` source-of-truth, RSC) wins on every naming/structure divergence. The semantic palettes in `lib/*` keep **Latent's** hues (not re-derived from v2). Per-surface layout re-skins follow in Sprints 1..N; Sprint 0 propagated the look via tokens + primitives with zero layout reorganization. Full scope: [docs/features/claude-design-redesign-scope-2026-05-29.md](docs/features/claude-design-redesign-scope-2026-05-29.md).

### Voice & casing

- **First-person research notebook.** Chris speaks as *"I"* — "What I learned", "My taste profile". Never *"you"* or *"we"*. No marketing copy, no CTAs beyond `+ ADD`, no hero headlines.
- **Taxonomic over marketing.** Coffees are classified, not sold. Numbers are labels, not features (`55 COFFEES`, never "55+ coffees tasted!").
- **Uppercase mono** for every label, nav item, badge, pill, section header, count chrome. **Title-case sans** for coffee names, terroir/cultivar names. **Sentence case prose** for the narrative content inside cards.

### Palette

- **Chrome (warm paper, post v2 re-skin):** `latent-bg #F2F1EC` (page), `latent-fg #0E0E0E` (ink), `latent-mid #6B6B66` (secondary text), `latent-subtle #B4B4AE` (tertiary), `latent-border #E0DFDA` (hairline), `latent-paper #FAFAF7` (tinted card surface), `latent-surface #FFFFFF` (pure-white surface / nav bar), `latent-hairline #EDEBE5` (in-card dividers), `latent-accent #2C4A35` (dark green, primary-button hover), `latent-accent-light #4A7C59` (focus ring, sage), `latent-highlight #EDF3EC` + `latent-highlight-border #C9DBC4` (tag/chip background).
- **Flavor accents (labels / chips / dots / swatches only):** `latent-acc-{green,coral,teal,amber,plum}` each with `-bg` + `-br` (green `#5B8A5A`, coral `#C77A5C`, teal `#5C8A8C`, amber `#A88037`, plum `#8E5A6E`). Consumed by the `Chip` primitive's 5 tones + the `SspFlavorAxis` 4-cell (teal/coral/amber/plum). Distinct from semantic chrome.
- **Semantic chrome (workflow-state roles):** `latent-roast-emphasis` (amber `#A88037` — design intent / drop rules / predictions), `latent-cup-emphasis` (lavender `#7A6E9E` — cupping hypothesis / reference signals; was plum), `latent-resolved-emphasis` (green `#4A7C59` — resolved lots / reference roast / peak), `latent-archive-emphasis` (grey `#6B6B66` — archive / read-once provenance, **new 4th role**). Each has `-surface` + `-br` variants. Named by meaning, not color.
- **Lifecycle tiles (green-coffee → roasted-coffee gradient):** `latent-tile-inventory` (grey `#B4B4AE`) → `latent-tile-next-roast` (sage `#4A7C59`) → `latent-tile-next-cupping` (olive-bronze `#6B5E3A`) → `latent-tile-resolved` (roasted brown `#3a2418`). The `/green` index binds states to these (resolved = brown per ratification #5, replacing the prior near-black `fg`); unresolved keeps neutral `mid` (outside the green-brown axis).
- **Semantic palettes (Latent's hues — kept, not re-derived from v2):**
  - Book-cover colors: `lib/brew-colors.ts` — process × flavor signals (sage for Gesha/washed, burgundy for anaerobic/wine, gold for honey, brown for natural, teal for floral, slate fallback).
  - Extraction-strategy pills: `lib/extraction-strategy.ts` — Clarity-First (sage), Balanced (ochre), Full (burgundy).
  - Process families: `lib/process-registry.ts` — 5 families × per-family hue (back-compat shape; post 1e.1 the file also exports the full composable process registry).
  - Flavor families: `lib/flavor-registry.ts` — 8 families × per-family hue, hue-separated not lightness-separated.
  - Roaster families: `lib/roaster-registry.ts` — 5 BMR-mirrored families + warm-neutral per-roaster swatches.
  - Country swatches: `lib/country-colors.ts` — 12 earth-toned hues, one per producing country.
  - Cultivar family swatches: `lib/cultivar-family-colors.ts` — 6 warm/cool hues, one per genetic family.
  - Process modifier-axis swatches: `lib/process-axis-colors.ts` — fermentation/drying/intervention/experimental + signature swatch + neutral fallback (centralized Sprint 0 from a map duplicated across two `/processes` pages).
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
| `text-sm` | 0.8125rem (13px) | Body prose, inputs (v2 body 13px) |
| `text-lg` | 1.125rem (18px) | Brand wordmark, mono card titles (ratification #2) |
| `text-xl` | 1.25rem (20px) | Wizard step titles |
| `text-2xl` | 1.375rem (22px) | Detail-page hero `<h1>`, sans (largest in-product) |

- **Quiet hierarchy.** The loudest sans text is a detail-page hero `<h1>` at 22px semibold. There is no display/hero type. Page titles are 11.5px mono uppercase labels.
- **Card titles go mono (ratification #2).** Index card variety/lot names use mono (brew-card 18px / lot-card 17px) — a deliberate change from the prior title-case-sans convention. Detail-page hero `<h1>` stays **sans** 22px. (Sprint 0 establishes the scale + builds `.ssp-name h1` sans; the index card-title flip lands per-surface.)
- **Letter-spacing:** `tracking-wide` (0.1em) for most mono uppercase, `tracking-widest` (0.15em) for the brand lockup.

### Spacing

Tailwind defaults, used densely on a narrow set: **1 / 1.5 / 2 / 3 / 4 / 5 / 6 / 8 / 12 / 16**. Page shell is `max-w-3xl` (768px) for detail pages, `max-w-[1200px]` for the /brews grid and header. Horizontal padding `px-6`, vertical `py-8`. Header height fixed `h-14` (56px). No arbitrary `p-[17px]` anywhere — if a size isn't on the scale, it's drift. The v2 `--s1..--s8` CSS-var scale (4/8/12/16/22/32/48/64) lives in `:root` for the `.ssp-*` family's internal padding.

**Responsive infra (Redesign Sprint 0, ratification #3): CSS container queries, two-point model.** The `.ssp-*` primitives are responsive via `@container ssppage (min-width: …)` (not `@media`) — wrap a page in `.ssp-page` (carries `container-type: inline-size`) to activate. Anchors are **390** (mobile) + **1024** (desktop); the hard 768 tablet breakpoint is dropped (tablet falls out of fluid container behavior + a spot-check). No new Tailwind plugin — raw CSS `@container` in `globals.css`.

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
- **`<Header>`** — sticky brand + nav + mobile hamburger. Re-skinned Sprint 0 to the v2 centered-destinations shape (white surface bar, balanced `nav-tail` spacer, 6 destinations; `+ ADD` gone since Writing-path Sub-sprint 4).

**`Ssp*` family (`components/Ssp.tsx`, Redesign Sprint 0).** The v2 "lab-document" primitive vocabulary, built as React server components driven by the `.ssp-*`/`.chip` CSS in `globals.css`. **Coexists with `SectionCard`/`Tag`/`TagLinkList` through the migration window** — each per-surface sprint swaps its page composition over; do not assume a missing `SectionCard` migration is a bug. Members: `Chip` (5 accent tones) · `SspTopBar` (black mono ID strip) · `SspNamePlate` (plum-edged plate, sans h1) · `SspShead` (hairline-prefixed section head) · `SspKVStrip` (dark mono key-value strip; alias `SspRecipeHead`) · `SspTimeline` (brew time/label/desc) · `SspModifier` (strategy + modifier chips + prose) · `SspFlavorAxis` (4-cell categorical) · `SspStructure` (label-row + chip-row) · `SspIdentGrid` (5-cell tabular metadata). Plus CSS-only `.blk`/`.blk.dark`, `.hero`, `details.ssp-coll`. Use, don't reimplement.

### Iconography

**Zero icon library.** No Lucide, no Heroicons, no SVG icon sprites. What's allowed:
- Unicode glyphs as chrome: `+ ADD`, `← Back to Brews`, `→` for hover-revealed affordance, `·` as metadata separator.
- Exactly four emoji used as category prefixes only: `🌍` (terroir), `🧬` (cultivar), `☕` (empty brew avatar), `🌱` (empty green-bean avatar). Never in buttons, never in badges, never decorating tags.
- Color swatches as visual identifiers: country swatches on terroir pages, family swatches on cultivar pages, full book-cover tiles for brews.
- The brand mark is typographic (`LATENT` + `RESEARCH` in bold mono / light mono) — not pictorial.

If a future surface genuinely needs a line-icon (e.g. a settings gear), use Lucide at `stroke-width: 1.5`, 12–16px, `currentColor` — and flag the addition. Don't sneak one in.

### Surfaces, motion, interaction

- **Flat surfaces.** Page `#F2F1EC` (warm paper), card `#FAFAF7` (paper) / `#FFF` (surface), dark-accent card `#0E0E0E`. No gradients, no textures, no hero imagery, no photography.
- **No shadows at rest.** The only shadow in the product is brew-card hover — `shadow-lg` + `-translate-y-1 scale-[1.01]`, the book-lifts-off-the-shelf moment. Focus ring is 2px sage `outline` + 2px offset.
- **Restrained motion.** Every transition is `transition-colors` or `transition-all duration-150` (buttons) / `duration-200` (brew-card hover). Default CSS ease. No bounces, springs, skeleton shimmer, page-load fades, or scroll-linked effects.
- **No transparency.** No frosted glass, no backdrop-blur. `text-white/75` on book covers (dimness hierarchy) and `hover:bg-latent-highlight/30` on list rows (pale sage wash) are the only opacity uses.
- **Selection / scrollbars.** Selection: sage-highlight bg on black text. Scrollbars: 6px, `#CCC` thumb, transparent track.

### Discipline

- **Adding a token = a deliberate decision.** Same energy as adding to the flavor-registry or roaster-registry. If a color / size / spacing isn't on the canonical list, it's drift, not creativity.
- **Desktop-primary default; named mobile-primary "workflow-companion" surfaces (Q3, 2026-05-29).** Default is desktop-primary + mobile-must-not-regress for reference/study surfaces (aggregation pages, indexes, resolved lots, archive reading). **Exception:** workflow-companion surfaces are mobile-primary — pages whose moment-of-use is physically at a station with phone in hand: `/brews/[id]` recipe (brew bench), `/green/[id]` waiting-for-cupping (cupping table), and (soft) `/green/[id]` waiting-for-roast. Defensible by job, not guess. Mobile pass folds into each surface's own per-surface sprint + a light closing regression sweep (not a separate big mobile sprint). Responsive infra is container queries + 390/1024 (no 768) per ratification #3.
- **When in doubt, match the document.** The Dropbox folder's `README.md` + `colors_and_type.css` are a high-fidelity mirror of the code. If the code disagrees with itself between two pages, the documented token wins.

---

## Roadmap

The full forward-looking work surface, structured by readiness + scope. Per-sprint retrospectives live in `memory/project_*.md`. Sprint-by-sprint shipped log is at [docs/sprints/shipped.md](docs/sprints/shipped.md).

**Last reorder:** 2026-05-26 (roadmap re-session — closes Sprint R Option 1 sequence; Sprints 3.4 / 3.6 / 3.7 killed; restructured into Writing-path + Read-path surface polish series + Brainstorms-to-schedule + Filter drawdown research closeout; Longer Term Items reordered per Chris audio). Prior reorder 2026-05-25 (Sprint R restructured the queue around Option 1 — audit → architecture → re-session). Prior reorder 2026-05-08 (post-v8.5 sweep).

### Active Sprints

The current ranked queue of scoped, sized sprints in flight or next up.

**Roadmap re-session restructured this queue 2026-05-26** (closing Sprint R's Option 1 sequence). Sprint 3.3 shipped 2026-05-25; Sprints 3.4 / 3.6 / 3.7 killed (3.4 demoted to Future Direction "Predicted vs Actual roast delta surface"; 3.6 + 3.7 audit found 5 of 6 items each already shipped via architecture Waves 2-4 + lifecycle prompt restructure). Remaining work organized into **two surface polish series** (writing-path first since the writing layer is mission-critical; read-path after) + 5 brainstorms-to-schedule (parallel to sprint work) + 1 incoming substrate event (Chris's filter drawdown research) + Longer Term Items (reordered).

#### 1. Architecture implementation — CLOSED (Waves 1-4 shipped 2026-05-26 / 2026-05-21)

4-wave composable sub-skills architecture per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) / [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) / [ADR-0013](docs/adr/0013-self-improvement-primitives.md). Cumulative master-doc shrink ~358KB (BREWING 213→3KB, ROASTING 147→6KB). Per-wave shipped detail in [shipped.md](docs/sprints/shipped.md); status snapshot in [docs/architecture/sub-skills-status.md](docs/architecture/sub-skills-status.md).

#### 2. Roadmap re-session — SHIPPING via this PR (2026-05-26)

Final phase of Sprint R's Option 1 sequence. Re-assessed every entry in the prior § Queued post-architecture + § Deferred candidates + § Side Quests against current substrate. Output: this restructure + a kickoff brief for Sprint 3.5. Per-sprint retrospective in [project_roadmap_re_session_2026-05-26.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_roadmap_re_session_2026-05-26.md).

#### 3. Writing-path surface polish series — CLOSED 2026-05-27

Mission-critical surface — the claude.ai → MCP → DB writing layer. Broken into sub-sprints that ship as separate PRs but are conceptually one surface area (per Chris-input 2026-05-26: "we should do one big sprint on all of the surface layers of the writing path"). All 4 sub-sprints shipped between 2026-05-26 and 2026-05-27; series closed with Sub-sprint 4's deletion of all in-app human-write surfaces. Per-sub-sprint detail in [docs/sprints/shipped.md](docs/sprints/shipped.md).

**Series umbrella doc:** [docs/sprints/writing-path-surface-polish-series-2026-05-26.md](docs/sprints/writing-path-surface-polish-series-2026-05-26.md) — session handoff between sub-sprints; carries lightweight inline kickoff scopes for Sub-sprints 2 / 3 / 4 and points at the dedicated kickoff brief for Sub-sprint 1.

##### Sub-sprint 1 — Sprint 3.5 — Roest pull-side audit + /datapoints/ unlock (SHIPPED)

Shipped 2026-05-26 in ~3-4h (vs ~1-2 day kickoff sizing). **Discovery mid-sprint** of the previously-undocumented `/datapoints/?log={log_id}` endpoint expanded scope from "audit-flavored describe wording fixes" to "ship server-side compute for everything /datapoints/ unlocks" per Chris audio-confirm. The Roest API exposes raw bt / inlet_temp time-series we'd documented as not-pullable in Sprint 2.5 + Phase 1+2 — never surfaced because no prior audit had pulled the OpenAPI schema.

- **R57** — Roest UI Notes routing → `color_description` ✓ — pull payload field renamed; `push_roast.roest_notes` deprecated for back-compat; migration 070 backfilled legacy roast.roest_notes content
- **R59** — `hopper_load_temp` not exposed by Roest API ✓ — confirmed via OpenAPI audit; documented in Tool describe + sub-skill read-surface.md
- **R60** — TP + `yellowing_temp` ✓ — server-side compute from /datapoints/ bt curve; populates existing `roasts.tp_time` + `roasts.tp_temp` + `roasts.yellowing_temp` columns (added migration 039, NULL-only until now)
- **R64** — Inlet curve as-recorded ✓ — new `roasts.inlet_curve_recorded` text column sampled from /datapoints/ inlet_temp series at same msec keys as as-designed bezier (R64 final verification gated on Chris's screenshot comparison — follow-up)
- **R65** — UTC date drift ✓ already mitigated pre-sprint via `ROEST_USER_TIMEZONE` env var; default `America/Los_Angeles` correct for Chris
- **R66** — Orphan reconciliation warning ✓ already shipped pre-sprint at `lib/roast-import.ts:493-512`
- **NEW** — 3 RoR columns ✓ — `ror_at_2_30` / `ror_at_4_00` / `ror_at_fc_minus_30s` (Chris audio-confirm: 3 explicit columns rather than jsonb); 30s window centered RoR via /datapoints/ bt curve
- **Cross-check** — roest-knowledge cluster `cluster/api/read-surface.md` rewritten with /datapoints/ shape + Sprint 3.5 compute + R57/R59/R65/R66 audit findings

**Migration 070** (additive only): 4 new columns on roasts + R57 data backfill. Tool count 35 unchanged. **Post-merge**: Chris applies migration 070 via Supabase SQL Editor before next dogfood pull.

**Scoping doc:** [docs/features/roest-api-parity-phase-3.md](docs/features/roest-api-parity-phase-3.md) reshaped at ship time with per-item resolution table + lessons learned.

##### Sub-sprint 2 — MCP ergonomics polish (Round 15 cluster)

~1-2h. From `feedback_mcp_continuous_log.md` Round 15 (2026-05-26). Items 15(b) + 17 + 18 + 19 — the Latent-side subset of the Round 15 friction (items 14 + 16 are claude.ai-client issues, stay in feedback log).

- **15(b)** — completion-prompt auto-split for multi-citation `propose_doc_changes` bundles. Confirmed trigger: aggregate payload above a client-side ceiling between largest-single and 3-citation-sum.
- **17** — `propose_doc_changes` response payload should warn when `target_doc` is a redirect stub (currently re-routes silently to migrated cluster doc).
- **18** — `list_doc_sections` on a redirect stub should return `redirect_to` field or pseudo-anchors (currently returns dead-end stub anchor).
- **19** — `log-cupping.md` STAGE 5 design-rule list should front-load operator-fixed constants (charge 117°C / hopper 125°C never varied per Item 25 / Group 5 audio-ratified constraint) before claude.ai conversationally floats an invalid lever.

**Sizing:** ~1-2h. **Scoping doc:** none — items are described inline in the feedback log.

##### Sub-sprint 3 — Brewing-completion prompt consolidation — SHIPPED 2026-05-26

~30 min. Chris audio 2026-05-26: doesn't use `log-brew.md` or `propose-doc-changes-from-brew.md` because `bundled-brewing-completion.md` covers the full path. Aligns with `feedback_mcp_only_input.md` direction — when a prompt has a lived-practice replacement, deprecate the dead path.

- ✓ Converted `docs/prompts/log-brew.md` → redirect stub pointing at `bundled-brewing-completion.md`.
- ✓ Converted `docs/prompts/propose-doc-changes-from-brew.md` → redirect stub same target.
- ✓ Updated `lib/mcp/docs.ts` DOC_DESCRIPTIONS for both (DEPRECATED prefix + back-pointer to bundled).
- ✓ Brew Recorder SKILL.md + Brewing Assistant SKILL.md + Brewing Assistant operational-guide.md + coordinator/operator-guide.md + coordinator/dispatch-rules.md + close-lot.md + one-shot-closeout.md + CLAUDE.md + BREWING.md + docs/architecture/sub-skills-status.md cross-refs all updated to reference `bundled-brewing-completion.md` (and note Phase 2 brew iteration is now in-thread, no per-iteration prompt).
- ✓ Grep pass clean — only the redirect stubs themselves + historical sprint docs + this PRODUCT.md row reference the deprecated paths.

##### Sub-sprint 4 — Human-write surface deprecation — SHIPPED 2026-05-27

Final sub-sprint in the writing-path polish series. Per Chris audio 2026-05-26: "the app should only be orchestrated by claude.ai... I do not edit anything in the app. I do not fill out a form. I do not write anything." Single canonical writing path = claude.ai → MCP → Claude Code arbitrates.

Surfaces deleted:
- `/add?type=purchased` flow + Step 5 review pages (`app/(app)/add/page.tsx`)
- `EditBrewForm.tsx` + PATCH route (`app/(app)/brews/[id]/edit/` + `app/api/brews/[id]/route.ts`)
- 3 form-fronting API routes (`/api/brews/parse`, `/api/brews/import`, `/api/brews/[id]`)
- Header `+ ADD` button — Right cluster on `<Header>` now carries only the mobile-sheet hamburger
- 8 form components — `ProcessPicker` / `FlavorComposer` / `StructureTagsPicker` / `ModifierComposer` / `GrindSettingInput` / `HybridSubformPicker` / `CanonicalTextInput` / `SaveGateWarning`
- Edit button on `/brews/[id]` detail header
- Empty-state CTA on `/brews` ("ADD YOUR FIRST BREW") swapped for MCP-routing prose
- `lib/brew-import.ts` surgically trimmed (2099 → 1419 lines): `parseFlavorList` + `parseSpreadsheetRow` + the `detectDrift` block (TerroirDrift / CultivarDrift / DriftReport / canonicalizeMacroTerroir / canonicalizeCultivar / normalizeForMatch) + `seedStructuredGrind` + `structuredGrindColumns` + legacy grind regexes. All `findOrCreate*` + `validateCanonicalText` + `persistBrew` / `patchBrew` / clean* / compose* helpers preserved (MCP write path).

Read pages untouched. All canonical registries (`lib/*-registry.ts`) preserved as the source of truth for MCP-side validation.

#### 4. Read-path surface polish series — COMPLETE 2026-05-28 (all 6 sub-sprints 4a-4f shipped)

Per-page-family UX cleanup + informational architecture audit. Runs BEFORE the Claude-Design redesign so the redesign has the right informational scaffolding to polish, not patch. Order per Chris audio 2026-05-26 ("which ones I actually view most often naturally on my own"):

##### Sub-sprint 4a — Green-bean polish bundle — SHIPPED 2026-05-27 (all 4 bundles)

3-phase audit (Phase 1 = Chris page-by-page audit + 2 mockups + voice memos; Phase 2 = Claude complementary pass with substrate cross-check + bug root-cause diagnosis; Phase 3 = 4-bundle implementation plan). Shipped via PRs #274 (Bundle A) + #275 (Bundle D) + #276 (Bundle B) + #277 (substrate docs) + Bundle C prompt patch (same-day).

**Bundle A — Unresolved lifecycle state + view shape + resolved-bug fix.** Collapsed two findings into one fix: the long-standing "Higuito + CGLE Sudan Rume Natural rendering as Resolved with placeholder verdict + Closed-without-reference disambiguator" bug + Chris's new Unresolved state framing. Discriminator: `roast_learnings exists AND why_this_roast_won IS NULL → unresolved` (whitespace-trim-aware). 6 lots (Higuito + SRN + Rancho Tio + GV Oma + GUA Libertad + GUA El Socorro) routed to the new state. New 5th view-shape `UnresolvedView` with "Reference → Leading" vocabulary rotation + verdict block dropped + carry-forward caution annotation + gray (`latent-mid`) tile per ratified design decision. ResolvedView's Sprint 3.2 #18 disambiguator card removed as dead code.

**Bundle B — V-set view reorders + Cupping Hypothesis + Roast Actuals rewrites.** Ships Chris's mockups #1 + #2 from Phase 1. WaitingForNextRoastView: Hypothesis row truncate-with-expander (pure-CSS via `<details>` + `group-open`); ExperimentFrame + RoastLogTable collapsed by default. WaitingForNextCuppingView: Cupping Hypothesis card body rewrite (2-row table Taste for / Predicted Cup; new `<CuppingReferenceBoxes>` inline Producer Notes + Previous Leading Slot Cup Notes; Anchor Cup dropped from foreground); Roast Actuals reformat (6 rows in new order, predicted → actual format every numeric cell, Maillard dropped); CrossBatchNotesBlock promoted to slot 4; ExperimentFrame + RoastLogTable collapsed.

**Bundle D — color_description + sweetness render adds.** `roasts.color_description` (R57 rewire from Sprint 3.5) surfaces as inline annotation on Resolved/UnresolvedView reference/leading roast cards. `cuppings.sweetness` (Sprint S3 schema) renders as own row when `overall` populated (parallel to temperature_behavior pattern). Both dormant when data null; light up when populated.

**Bundle C — log-roast.md STAGE 5 + log-cupping.md STAGE 0 taste_for prompt tightening — SHIPPED 2026-05-27 (same day).** Chris provided 11 example pairs (current verbose + preferred tight rewrite) across 4 lots (Mountain Harvest Mount Elgon / El Paraiso Red Plum Castillo / Bukure Natural Lot 21 / Gesha Clouds Forest) within hours of the deferral. Prompt patch replaces the pre-Bundle-C "1-3 sentences combining three reference points (producer notes + V_(n-1) memory + adjustment tested)" structured citation rule with a flat action-verb-led shape ("Listen for X" / "Check whether Y" / "Taste only to calibrate Z"). Key rules captured: don't re-state producer notes (on page in Producer Notes sub-card post Bundle B), don't use numbered citation structure, don't recap design intent (recipe row carries it), diagnostic framing on failure-mode batches captures the underdev/overdev/off-balance signature for future reference even when the cup isn't a candidate. 4 worked examples in the prompt drawn from Chris's rewrites. `observed_outcome_<slot>` parallel tightening NOT done (Chris only provided taste_for examples; observed_outcome has different semantics — post-cupping observation vs taste_for's pre-cupping prep — re-flag if verbosity surfaces).

**Deferred (per Phase 2 complementary pass § 8-§17):** Reference Roasts entity creation (own sub-sprint), POD-1 absorption (1.x of 4 triggers fired), run-off pourover `recipe_variant` schema split, rest-days drift surface, provenance UI (`canonicals_updated_at` / `*_provenance` render — dormant by lack of trigger), Sprint 3.5 RoR + inlet_curve_recorded render (mockup doesn't show them; data dormant), phone-scope mobile pass.

**Phase docs:** [kickoff](docs/sprints/sub-sprint-4a-green-bean-polish-kickoff-2026-05-27.md) (Phase 1) + [complementary pass](docs/sprints/sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md) (Phase 2).

##### Sub-sprint 4b — Roasters polish bundle — SHIPPED 2026-05-28 (Bundles A + B)

Per Chris audio: "I usually remember [a coffee] roaster first, so I usually go to the roasting page" — second most-visited surface. 3-phase audit (Phase 1 page-by-page audit + Phase 2 Claude complementary pass + Phase 3 plan-mode bundling) shipped via 2 PRs.

**Bundle A — Reference Brew Recipe IA polish + producer in coffees-list meta (SHIPPED PR #281).** Locked detail page's primary job as **index into brews** (not in-app brew prep). Renamed "GENERALIZED BREWING RECIPE FOR THIS ROASTER" → "Roasters Reference Brew Recipe"; promoted `doseG` + `waterG` into the Baseline Recipe inline composition + removed from Additional Information (no duplication); added producer to coffees-list meta line below variety / country / process for frozen-tube → "find this coffee" scannability. Six defended-stay decisions from Phase 1: coffees list position (#6), sort orders (created_at DESC detail / brewCount DESC index), BMR prefix rename (deferred per Chris PDF), `url` field cleanup (deferred per Chris PDF), index page changes (none — "honestly no feedback").

**Bundle B — brewGuideStatus 3-state substrate + render gate fix (SHIPPED PR #TBD).** New required `brewGuideStatus: 'official' | 'implied' | 'none'` field on `RoasterEntry`; all 73 entries classified (57 / 12 / 4) per ratified definitions. Replaces the `brewGuideLink ? … : "No official brew guide"` render gate at [app/(app)/roasters/[slug]/page.tsx](app/(app)/roasters/%5Bslug%5D/page.tsx) (14 false-negative entries today: Drop / Picolot / Center / Five Elephant / VWI / Shoebox / Oma / Dongzhe / etc.) with a 5-branch status switch. `brewGuideSource` + `brewGuideType` retained as provenance fields; only the page-front gate reads `brewGuideStatus`. Cross-cutting touches: [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md) (per-entry status row + new 3-state subsection); CLAUDE.md drift fixes (lines 99 / 148 / 150-151; 21→73 + 70→73 + 29→30 fields); [lib/synthesis/adapters/roaster.ts](lib/synthesis/adapters/roaster.ts) (anchor gains brew guide status line so synthesis weighs recipe baseline as roaster-verified vs community-derived). Classification audit trail at [docs/sprints/sub-sprint-4b-brew-guide-classifications-2026-05-28.md](docs/sprints/sub-sprint-4b-brew-guide-classifications-2026-05-28.md).

**Phase docs:** [kickoff brief](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md) + [complementary pass](docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-2026-05-28.md) + [Bundle B handoff](docs/sprints/sub-sprint-4b-bundle-b-handoff-2026-05-28.md).

**Deferred (per Phase 2 § Bucket G):** B1.b coffees-list section reorder; sort-order changes; BMR prefix rename; `url` field cleanup; synthesis card position; mobile full pass; per-roaster deep archive sub-view; family color tokens System vs Varies hue proximity; B2 richer Processes Explored cross-link block (punt to Sub-sprint 4f).

##### Sub-sprint 4c — Brews polish bundle — SHIPPED 2026-05-28 (Bundles A + B)

Third most-visited surface. Chris's Phase 1 audit reframed 4c from render-polish to **forward data-model design** — the pages are good as-is; the work is structuring recipe detail he already captures with no home, while avoiding over-build / future cleanup / write-surface churn. 3-phase audit (Phase 1 audit + 2 brainstorm docs; Phase 2 Claude complementary pass; Phase 3 plan-mode 2-bundle plan) shipped via 2 PRs.

**Bundle A — recipe-substrate fields (SHIPPED PR #286).** `water_recipe` free-text column (migration 071) rendered as a "Water Recipe:" line under the 6-var RecipeTable (distinct from RecipeTable's "Water" grams cell). New `equipment` modifier type (5th on `brews.modifiers`) for persistent/timed gear beyond brewer+filter ({name, scope?}, scope free-text) — reuses the `modifiers[]` infra, zero schema change. `inverted_temperature_staging` → `thermal_staging` rename (ALIAS-SAFE: legacy name accepted + normalized by `cleanModifiers` via `MODIFIER_TYPE_ALIASES`; now covers kettle thermal stance + active ramps). Pour-structure free-text convention documented in the brewing prompts + operational-guide as cheap prep for the deferred structured-pour migration. Six-actor trace: schema/render + push/patch Zod + canonicals read-surface + list-recent-brews select + CLAUDE.md + brew prompts + short-form synthesis vocab.

**Bundle B — collapse /brews filters to Strategy + by-roaster (SHIPPED PR #285).** Per Chris's audit (recalls coffees roaster-first, "that Picolot coffee", not by family): collapsed the 4 family-level dimension rows to two — kept the Strategy pills, replaced the roaster-FAMILY row with a by-INDIVIDUAL-roaster `FilterPopover` (multi-select of distinct canonical `brews.roaster` with ≥1 brew, displayed via `getDisplayName`, matched on canonical; "filter by Picolot" wasn't possible before). Removed Process-family + Origin (Lineage/Macro) rows (that slicing lives on `/processes` · `/terroirs` · `/cultivars`). `FilterPopover` gained an optional `formatOption` prop. Net −87 lines.

**Deferred (per Phase 2 § Bucket G):** structured `pour_structure` step-objects (Item 4 — its own future sprint; the free-text seam is already reserved in `lib/pour-structure.ts`; needs a dedicated grill on the valve enum-vs-free-text question, designed against accumulated real examples + heaviest write-surface impact); index pagination / infinite scroll (PRODUCT.md watch-item, not yet); phone-scope mobile full pass.

**Phase docs:** [kickoff brief](docs/sprints/sub-sprint-4c-brews-polish-kickoff-2026-05-28.md) + [complementary pass](docs/sprints/sub-sprint-4c-brews-polish-complementary-pass-2026-05-28.md).

##### Sub-sprint 4d — Cultivars polish bundle — SHIPPED 2026-05-28

Chris's Phase 1 audit framed `/cultivars/[id]` as a **reference/informational surface** (background + context to orient on a cultivar; "What I've Learned" is the most-referenced block but reads naturally where it is). The lightest bundle of the series — one ratified change, single PR, no migration.

**Bundle (single change) — index species-heading weight.** Pre-4d the index spine was inverted: the species header rendered `text-xxs` muted (smaller + quieter than the family header at `text-xs` bold dark + swatch). Bumped species to `text-lg` dark so it reads as the dominant spine tier (Species > Family > Lineage > Cultivar). Forward-looking for the multi-species future — every cultivar is Arabica today, but Liberica + Eugenioides roasted lots are coming.

**Resolved no-action (Phase 1 + Phase 2):** "What I've Learned" synthesis stays at section 6 (most-referenced but reads naturally there; `short_form_capsule` noted as the lever for the future bigger redesign, not touched now). `cultivar_notes` (28/32 populated) + `cultivar_confidence` (26/32) confirmed intentionally-internal — normalization/authoring guidance + registry genetic-classification confidence respectively, neither user-facing reference; documented in CLAUDE.md so the substrate is known.

**Phase docs:** [kickoff brief](docs/sprints/sub-sprint-4d-cultivars-polish-kickoff-2026-05-28.md) + [complementary pass](docs/sprints/sub-sprint-4d-cultivars-polish-complementary-pass-2026-05-28.md).

##### Sub-sprint 4e — Terroirs polish bundle — SHIPPED 2026-05-28

Chris's Phase 1 audit confirmed `/terroirs/[id]` as an **informational surface** (like cultivars) — §1–8 + §10 Confidence right as-is, index liked as-is. The lightest bundle of the series alongside 4d — one ratified change, single PR, no migration.

**Bundle (single change) — `CollapsibleBlock` collapse-by-default.** The component rendered a dual-tree: always-open on desktop (`hidden md:block`, no toggle), collapsed only on mobile (`md:hidden <details>`). Collapsed into a single native `<details>` closed by default at every breakpoint, so "Additional Information" collapses on desktop too. Per Chris's "we should always have that bar be collapsed." One component edit propagating to all 7 consumers (terroir / cultivar / roaster "Additional Information" + /brews/[id] "Full Brew Notes" + 3× /processes/* sub-pages) — also simplifies the component (children render once, no re-mount caveat).

**Resolved no-action (Phase 2):** render-path audit found NO 4d-style unrendered-column gap — every `Terroir` content column has a render path (the type is leaner than `Cultivar`; no `terroir_notes`/`terroir_confidence` analog). Macro+country merge logic drops nothing. Pre-existing synthesis-gate inconsistency noted (terroir shows at ≥1 brew, cultivar gates at ≥2) — flagged, no action.

**Deferred (Phase 1):** brew-list/card unification across terroir/cultivar/roaster/process pages → § Longer Term Items / Small-opportunistic (Chris-flagged low-priority, belongs to the broader Claude-Design redesign exercise).

**Phase docs:** [kickoff brief](docs/sprints/sub-sprint-4e-terroirs-polish-kickoff-2026-05-28.md) + [complementary pass](docs/sprints/sub-sprint-4e-terroirs-polish-complementary-pass-2026-05-28.md).

##### Sub-sprint 4f — Processes polish bundle — SHIPPED 2026-05-28 (closes the Read-path series)

Chris's Phase 1 audit confirmed the Sub Pages 4 information architecture **earns its keep — do not shrink.** Processes is genuinely multi-access (pure washed vs double anaerobic thermal shock yeast inoculated washed are different objects); the 3-tier nav + 5 sub-page kinds reflect the domain, not over-build. This closes the kickoff brief's central open question. Light bundle, single PR, no migration.

**Bundle (3 changes):**
- **B1** — `ProcessCoffeesList` truncates to first 10 + pure-CSS "Show N more" expander (shared component → uniform across all 6 page kinds). Keeps high-count hubs (Washed 43 / Natural 36) from growing unbounded.
- **B2** — honey-subprocess + modifier-combo pages wrap their cross-link blocks (flavor notes / cultivars / terroirs / roasters) in the collapsed `ADDITIONAL INFORMATION` `CollapsibleBlock`, matching base/modifier/signature pages (was rendering inline).
- **B3** — confidence-threshold doc alignment: code renders HIGH at `>= 5`, but comment + CLAUDE.md + kickoff brief said "3+." Aligned docs to the code (5+ = HIGH); code unchanged.

**Anoxic decision (Q4 — folded in from the old Side-Quests "Process qualifiers schema 1e.5"): Path 1 — leave it.** Anoxic stays a recorded `fermentation_qualifiers` annotation; aggregation correctly stays at the Anaerobic modifier per the locked T3/CR-5 convention. N=1 today (below the ≥3 aggregation floor the whole processes IA runs on). Revisit only if 3+ brews carry it. No schema change — 4f stayed code-only.

**Deferred (Phase 2):** F4 — no arbiter-queue reminder for unauthored process overviews (signature `overview`, base `summary`) + honey-subprocess description is a *missing field* not an unauthored one (Actor-4 / content-architecture work, out of light-series scope); `ProcessAdditionalInfo` extraction (the block is now inlined across 5 process pages — pre-existing per-page pattern). Both logged to [docs/grilling-queue.md](docs/grilling-queue.md). Producers polish DEFERRED until aggregation lands (trigger: 2+ producers at 3+ brews each; today only Pepe Jijon qualifies).

**Phase docs:** [kickoff brief](docs/sprints/sub-sprint-4f-processes-polish-kickoff-2026-05-28.md) + [complementary pass](docs/sprints/sub-sprint-4f-processes-polish-complementary-pass-2026-05-28.md).

**Read-path surface polish series (4a-4f) COMPLETE.** Redesign-brainstorm trigger condition #2 (§ 5 below) now met.

#### 5. Claude-Design-led redesign — ACTIVE (Sprint 0 Foundation shipped 2026-05-29; per-surface sprints next)

Chris has the design system ready via claude.ai/design (per Sprint R input #8). **Brainstorm ran 2026-05-29** — all three gates met; scope locked in [docs/features/claude-design-redesign-scope-2026-05-29.md](../features/claude-design-redesign-scope-2026-05-29.md). Decomposition = **Option 2 (foundation-first + per-surface, companion surfaces ordered first)**. The desktop-first rule is refined to **desktop-primary default + named mobile-primary "workflow-companion" surfaces** (pages used at a station, phone in hand). First arc re-skins existing surfaces only; `/producers` + `/experiments` + homepage deferred. Governing principle: **pull from the v2 system, don't adopt carte blanche.**

- **Sprint 0 — Foundation — SHIPPED 2026-05-29.** v2 warm-paper tokens (re-pointed `latent-*` + new flavor-accent / lifecycle-tile / `archive-emphasis` families, `--acc-*` aliases) + the new `Ssp*` / `.blk` / `.hero` primitive family (`components/Ssp.tsx`) + nav re-skin (centered, white surface) + raw-CSS `@container` infra (390/1024, no 768) + lifecycle-tile gradient on `/green` (resolved = roasted-brown, ratification #5) + centralized `lib/process-axis-colors.ts`. Zero layout reorganization — look propagated via tokens + primitives; every route verified at 390 + 1024. Semantic `lib/*` palettes kept Latent's hues (not re-derived). See [docs/sprints/shipped.md](../sprints/shipped.md).
- **Next: per-surface re-skins**, companion-first — brew detail + green lifecycle (mobile-primary), then roasters / cultivars / terroirs / processes, then the `/green` index — each its own plan-mode sprint, mirroring the 4a-4f cadence, on the now-stable token + primitive base.

**Triggers (all met):** (1) ✅ writing-path surface polish series complete (sub-sprints 1-4, closed 2026-05-27); (2) ✅ read-path surface polish series complete (4a-4f, closed 2026-05-28); (3) ✅ Claude-Design redesign brainstorm run 2026-05-29 → scope doc.

### Brainstorms to schedule (parallel to sprint work)

Per Chris audio 2026-05-26: "these could be good things to park as parallel items I can do concurrently — separate brainstorms that feed into plan that feed into roadmap." Each is its own session, sized small to medium, output is a scoping doc that feeds into a future sprint. Order is opportunistic — Chris triggers when bandwidth lines up. Treated as scoped brainstorm work, not sprint work.

- **Coffee brief / `brews.roaster_tasting_notes` scoping.** From Group B Round 2 audio. Roasting captures expected→actual at both stages (`roast_recipes` + `experiments.predicted_cup_*` → reality); brewing only captures actual. The Coffee Brief is the missing "expected" half. Right unit per Chris 2026-05-22: "experiment set of one" — plan + bag + final brew, three-point arc per coffee. Brainstorm outcome could be (a) full `brew_briefs` entity sprint, (b) column-only first sprint (`brews.roaster_tasting_notes` for bag notes), (c) deferred. Chris-stated: "I'm not sure I have a strong idea yet to do something with this... this could come to the conclusion that we don't need to do anything." Brainstorm shape.
- **Generic feedback-handoff queue formalization.** From Group B Round 2 audio. Partially handled today via the "WORKFLOW FEEDBACK INTAKE" prompt + `feedback_mcp_continuous_log.md`. Brainstorm: formalize as a real skill / sub-skill that takes any structured feedback from a workflow session and routes appropriately. Chris-framing: "more about relaying feedback from claude.ai... back into Claude code in a more continuous fashion. Again, we sort of do this already, but it's a little bit more about formalizing it."
- **WBC-mastery long-term feature direction.** From Group E Round 2 audio. Chris-framing: "I probably need to have a much larger brainstorming session around what is the long term feature direction on all of this with the goal in mind of, let's say, entering, competing, and winning the World Brewers Championship. What is the things I need to do to get me closer to that goal, not just how do I make the app a little bit nicer?" Strategic vision brainstorm. Outcome: longer-term roadmap themes prioritized against the mastery goal.
- ~~**Claude-Design redesign sprint planning.**~~ **RAN 2026-05-29** → [scope doc](../features/claude-design-redesign-scope-2026-05-29.md). Decided: Option 2 decomposition (foundation-first + per-surface), per-surface mobile (not global), desktop-primary default + mobile-primary workflow-companion surfaces, token-first migration. Redesign promoted to § Active Sprints #5 (Active); Sprint 0 (Foundation) is next.
- **Doc pruning mechanism.** From Group D Round 2 audio. Brainstorm: "we are adding cumulatively to all of these docs but there is no mechanism to consolidate, split, delete... real pruning exercises on specific docs and then figure out the mechanism to apply this to all doc surfaces and then have this be part of the ongoing autonomy process." Meta-process work that affects all substrate. Outcome: defined pruning protocol + cadence (analog to `consolidate-memory` skill but for `docs/` cluster files).

### Filter drawdown research experiment closeout — CLOSED 2026-05-27

Chris-driven research project (Sprint R deferred candidate). 4 tracks closed 2026-05-21 → 2026-05-26 (cone Project #1 / flat Project #2 / specialty cone Project #3 / paper-only V60 cohort RP4). The two channels both landed:

1. **Direct substrate**: filter-arc-driven schema decisions captured in [ADR-0015](docs/adr/0015-accessory-aware-flowrate-and-booster-registry.md) (`FilterEntry.flowRateContexts` + `BoosterEntry` registry — trigger condition met; implementation deferred to a future sprint) + [ADR-0016](docs/adr/0016-family-conditional-flow-rate-classification.md) (family-conditional flow-rate classification framework). Per-filter measured drawdown for the 8+ papers in scope landed in [docs/skills/brewing-equipment-expert/cluster/filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) at each project's close-out. **Step 3 (ADR-0015 + 0016 schema implementation sprint)** is now queued; trigger conditions fully met per ADR-0015 § Project #4 substrate updates.
2. **Meta-pattern**: closed 2026-05-27 by Research Assistant Step 2 scaffolding ship per [ADR-0017](docs/adr/0017-research-assistant-architecture.md). Research Coordinator + Research Assistant subsume the originally-scoped Learning Assistant + Learning Knowledge pair. See [docs/skills/research-coordinator/cluster/roadmap.md](docs/skills/research-coordinator/cluster/roadmap.md) § Closed for the canonical filter-arc archive pointer.

**Closed:** Both channels resolved. Step 3 schema implementation remains queued; the meta-pattern channel produced 9 new files + 1 new ADR + ADR-0011 amendment, hard-removed learning-assistant + learning-knowledge dirs, and re-routed the cross-system orphan references. **Next session (Chris-stated post-Step-2):** roadmap talk-through that populates [docs/skills/research-coordinator/cluster/roadmap.md](docs/skills/research-coordinator/cluster/roadmap.md) § Now / § Next / § Side quests.

### Workflow rule that bounds the sprint queue

Per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves (green bean → roasts → experiments → cuppings → lessons → reference roast → perfected brew). The mid-iteration beans not yet in the DB are NOT a backlog. They land event-driven when each bean finalizes. **Do not propose a "backfill the missing beans" sprint.**

### Quick audits (deferred candidates with "I thought we did this" signal)

Tiny verifications, ~30 min each, no separate sprint needed — ride along with the next writing-path sub-sprint:

- **DF-OPS2** — Historical `end_condition` backfill on roasts ≤ batch 169. Audit confirmed 2026-05-26: recipe rows themselves landed in migration 052 (116/116 historical roasts have a `roast_recipes` row, 103 marked `was_backfilled=true`), but `end_condition_type` is populated on only 6/116 (all `"manual"`) and `end_condition_target` is 0/116. The "I thought we did this" intuition matched the recipe-row backfill, not the end-condition fields. Net: ~110 historical roasts still need `end_condition_type` + `end_condition_target` populated. Chris-driven operator work; ride along with the next writing-path sub-sprint that touches `patch_roast_recipe`.

### Blocked and Parked

- **Split `brews.producer` into `producer_name` + `farm_name`** — demoted 2026-05-05. Less important now post-producer-taxonomy. If it comes back, it'll be inside the Producers-first-class-citizen brainstorm in Future Directions, not as a standalone sprint.

### Missing and Incomplete

(Relocated from the prior `Current App State § What's Missing` location during the May 2026 doc cleanup. Items here are "this exists but is broken or stub-state" — distinct from Longer Term Items, which are "this works but the surface is thin / not optimized.")

- **Experiments table — partially backfilled.** Schema supports structured A/B/C/D experiments with full hypothesis → outcome → insight flow. 18 experiments imported (migration 019) for the 4 green beans currently in the database. The roasting spreadsheet has 16 additional experiments tied to 5 CGLE / Forrest / Higuito beans whose green_beans rows have not been imported yet — these will land event-driven per the workflow rule above.
- **Cross-dimensional search — saved/named views missing.** Brews list filters across 5 dimensions (extraction strategy / process / roaster / lineage / macro) with multi-select within and intersection across. URL-driven state, shareable links, back-button works. Still missing: full-text search across `what_i_learned` narratives; saved / named views.
- ~~**Schema gaps from the May 2026 doc review:** `cuppings.sweetness` + `cuppings.temperature_behavior` columns missing from current schema.~~ ✅ Shipped via Sprint S3 (migration 046; columns reachable via MCP since 2026-05-18). Parser wiring + `/green/[id]` render still pending — folded into Read-path 4a Green-bean polish bundle above.

### Bugs and Issues

_None._

### Longer Term Items

Scoped, sized, and ready-to-launch when timing is right. Not currently in Active Sprints but represent committed near-future direction. Reordered 2026-05-26 per Chris audio (highest first within longer-term).

#### Highest within longer-term

- **Roasted-variant-of-same-green workflow modeling** (Chris-flagged Round 10 dog-food, 2026-05-22, promoted 2026-05-26). For ~25-30% of green-bean lots Chris also buys the roasted variant from the same source as an external-roaster calibration anchor. Today these two purchases are fully separate in the data model — green bean has its own row, roasted variant flows through claude.ai as an independent brew with `roaster: "<external roaster>"`, with no FK linking the pair. Chris's standing instinct: **keep separate** for now. Grilling-queue item 17 explores: (a) keep separate forever (current); (b) FK link on `green_beans` pointing at the external roasted brew's `brew_id`; (c) `peer_reference_brews` join table for broader external-roaster-as-calibration pattern. Roasting-side claude.ai sometimes suggests "brew the peer-roasted variant first as a gate before the next V-set" — currently coordinated in thread context. **Triggers when:** 3+ more roasted-variant pairs land + the grill clarifies whether the lifecycle wants formal modeling or stays operator-coordinated.

- **Pour-structure schema migration** (scoped 2026-05-09 follow-up to PR #131). Move `brews.pour_structure` from text → `brews.pours jsonb` array of `{n, label?, time?, amount_g?, method?, note?}` objects. `lib/pour-structure.ts` already extracts the shape; migration is mostly mechanical. Chris audio 2026-05-26: "more of a nice to have... future proofing... not huge surface area thing... less of a 'I need to work on this right now' kind of a thing." **Triggers when:** parse drift starts hurting render / downstream feature demands structured data / MCP write reliability becomes an issue. Full scope: [docs/features/pour-structure-schema-migration.md](docs/features/pour-structure-schema-migration.md).

- **Predicted vs Actual roast delta surface** (NEW 2026-05-26, replaces what Sprint 3.4 was pointing at). Chris audio: "a more interesting question for me would be when we write the expected roast, how far does that deviate from the actual roast, and is there anything we can do to get... closer? Because if we can get closer and closer to predicting how these things will go, then our cycle time for how they actually go will close in." Substrate exists — `roast_recipes.predicted_fc_temp` / `predicted_cup` / etc. vs. actual `roasts.fc_temp` + cupping reality. What's missing is the delta surface. Likely shape: a new section on `/green/[id]` or per-batch row in HypothesisTable showing "predicted X°C FC, got X+2.3°C; predicted cup Y, got Z; gap-closing notes." **Triggers when:** Chris has enough V-set cycles with predicted-vs-actual data to make the surface useful (rough threshold: 3+ completed V-sets with full predicted_cup_* + roast actuals + cupping actuals).

- **Experiments + Cupping History rework on `/green/[id]`** (Chris-flagged 2026-05-05, deferred 2026-05-26). Both `/green/[id]` sections need rethinking. Experiments: 6 schema fields render, 10 hidden — collapsible pattern or A/B/C/D side-by-side grid so `levels_tested` + `observed_outcome_*` surface. Cupping History: 27 rows flat is unreadable — group by batch or rest-day phase. Plan-mode interpretive sprint, 1 sprint after brainstorm. Bundle into Read-path 4a Green-bean polish bundle if shape becomes clear during that sprint.

#### Mid-tier

- **Auto-research on green bean upload** (Group D #5 from 2026-05-05 brainstorm). claude.ai already does auto-research when assembling Chris's inventory list; the open question is what should live in the app vs claude.ai. Likely a thin sub-sprint: surface what claude.ai produces in `/green/[id]` as a "research notes" block, structured + propose_doc_changes-able. **Triggers when:** Read-path 4a Green-bean polish bundle starts and the right shape becomes clear.

- **RoR tracking fields on `roasts`** (flagged 2026-05-17 Yunnan livestream Δ2). Three fixed-time RoR marks: `ror_at_2_30` / `ror_at_4_00` / `ror_at_fc_minus_30s`. Schema migration + `push_roast` + `patch_roast` input + `pull_roest_log` extraction + ROASTING.md prose. **Data-dependent** per Chris audio 2026-05-26 — confirm during Sprint 3.5 what Roest API actually exposes. If exposed → bundle into Sprint 3.5 follow-up. If not → defer further.

- **Homepage that isn't just a login button** (Chris-flagged 2026-05-05). Today the app's root surface is unauthenticated to login. Logged-in homepage gap. Likely shape: recent brews tile + recent green beans tile + a directed-synthesis tile. Chris audio 2026-05-26: "important one, but kind of a more nicer to have down the line... once I got all the core app working right, and it was more polishing and workflow and everything was good, this would be a fun one." Bundle with the Claude-Design redesign window.

- **Producers aggregation starting point** — mechanical 1-day "copy the /roasters pattern" sprint. **Trigger:** 2+ producers have 3+ brews each (today only Pepe Jijon qualifies).

#### Substrate / corpus

- **Filter drawdown comprehensive test** — Chris's in-flight research (separate § entry above). Substrate update ingests into `lib/filter-registry.ts` + Brewing Equipment Expert cluster.

- **Blend-cultivar schema modeling + future blending research framework** (Phase 2 Item 26 / 2026-05-24). Two substrate patterns currently coexist; no short-term sprint scope (Chris-confirmed: blends are "every so often"). The actual trigger is the **future WBC-inspired blending research project** — likely scope: `lot_compositions` join table or `green_beans.blend_composition jsonb` capturing structured blend metadata (cultivar + farm + roast-variant proportions) + brewing-side surface for "blend X vs single-origin A vs B" comparison. **Triggers**: Chris starts the WBC blending research project OR blend lots become >10% of inventory OR claude.ai friction breaks on a lived blend lot.

#### Small / opportunistic

- **Brew-list/card component unification** (Chris-flagged Sub-sprint 4e, 2026-05-28). The "coffees I've brewed" list renders differently on every aggregation page — terroir ("Coffees Brewed From This Region"), roaster ("Coffees I Have Brewed From This Roaster"), cultivar, and the /processes pages each re-implement the row markup + meta composition instead of importing one shared component. Chris: "instead of rendering it differently across each page… there should almost just be a BrewCard component so all of them pull from the same place." Low-priority — Chris flagged it as belonging to the **broader Claude-Design redesign exercise** (§5), not a standalone fix. **Triggers when:** the Claude-Design redesign window opens, OR the divergence starts causing maintenance friction.

- **Signature method "what I learned" synthesis variant** — flagged 2026-05-11. Per-signature-method synthesis variant with "what I learned from this signature" framing. **Trigger:** 2nd brew lands on any signature OR Chris wants the populated signature pages filled out.

- **Producer research subagent during arbiter** — flagged 2026-05-07. Arbiter spawns a research subagent that drafts a `ProducerEntry` shape per queued producer. **Trigger:** when manual cadence becomes onerous.

- **Brew-Reveals-Roast self-coaching question on Optimized Brew Session checklist** — light prompt addition. Ongoing skill gap.

- **Commit taxonomy-port generator scripts to `scripts/taxonomy-ports/`** — ~30-min task; fires when Chris wants deterministic re-porting from source CSV.

- **Backfill remaining `what_i_learned`** — ~19 brews still missing long-form learnings. Chris audio 2026-05-26: "small cleanup at some point." Bundle with the per-brew directed-prompt rework so Chris isn't writing generic prose.

- **BREWING.md Cross-Coffee Insight Layer structural pass** — flagged Sprint 9 kickoff 2026-05-19. May already be partially addressed via Brewing Historian cluster (Wave 2 PR 2). **Trigger:** brewing-side cross-coffee surface gets in the way of new-recipe design OR ARBITER.md CCIL consolidation pass extends to brewing side.

- **MEMORY.md consolidation** — index at 27.2KB / 24.4KB warning threshold. Chris audio 2026-05-26: "should make me do this soon." Standalone session, not bundled with sprints.

#### Removed from Longer Term

- ~~**Peer-roasted reference brew UI surface**~~ — REMOVED 2026-05-26 per Chris audio: "I don't know if I'd wanna put the peer-roasted reference lessons inside the app anywhere at all per se. To me, this feels like it lives in its own doc, in its own skill." Belongs in Peer-Learning Roasting Archivist sub-skill, not the app. Schema (migration 069 nullable FK `green_beans.peer_reference_brew_id`) preserved for future use; UI surface deprecated.
- ~~**Per-roaster archive page enhancement** (standalone)~~ — ABSORBED into Read-path 4b Roasters polish bundle.
- ~~**Brewing-side `/add` + `/edit` form deprecation** (standalone)~~ — ABSORBED into Writing-path Sub-sprint 4 (Human-write surface deprecation).
- ~~**Pour-over discriminator gate + optimized brew lifecycle states** (POD-1)~~ — ABSORBED into Read-path 4a Green-bean polish bundle (cupping-side simulated-pourover routing UI).

---

## Future Directions

Idea-stage work - not yet scoped, may never ship in current form. These are the "what could compound knowledge in the long run" thoughts.

### Compounding shape (Chris-framed 2026-05-05)

- **Recipe accelerator on new bean intake.** Long-term goal #1: "If I see a green bean or roasted bean, I can get to the end final cup much faster based on all accumulated knowledge." Today aggregation pages summarize but don't predict. Likely shape: given a new green bean's (cultivar + terroir + producer + process), surface "your data implies start at strategy X, ratio Y:Z, temp T" with confidence. **Reframed 2026-05-26 per Chris audio:** "not as important anymore with claude.ai sub-skill" — Brewing Assistant + Roasting Assistant sub-skills (Wave 3 PR 2) already compose Knowledge clusters into recipe recommendations at session-start. Re-evaluate if a dedicated in-app accelerator surface earns its keep over the in-thread sub-skill workflow.

- **Cross-pollination pushing.** Long-term goal #2: "Based on accumulated knowledge of me + sources outside of me (Brewers Cup champions), the app pushes me to do things I wouldn't normally think about." Concrete example: claude.ai recently helped Chris design a brew using Wölfl's 2024 WBrC champion Extraction Push + an additional aroma_capture flare. **Reframed 2026-05-26 per Chris audio:** "yeah I think CCIL does this now already" — Cross-Coffee Insight Layer (Wave 4 PR 4a, [docs/skills/ccil/](docs/skills/ccil/)) absorbs the substrate side. The Sudan Rume seed pattern (across-roasting-and-brewing.md) is the proof-of-pattern. Re-evaluate if a dedicated in-app push surface earns its keep over the in-thread CCIL workflow.

- **WBC champion recipe corpus expansion** (Chris-flagged 2026-05-05) - substrate that powers Cross-pollination pushing above. Today's corpus covers 2023 / 2024 / 2025 World Brewers Cup finalists (the source of the highest-leverage brewing ideas Chris has imported). Worth going further back in time to grow the corpus, plus adding sub-region winners (e.g. US Brewers Cup finalists for the past ~5 years). Lives in [BREWING.md](BREWING.md) § WBC Reference or a new `docs/brewing/champion-recipes.md` sub-doc. Authoring effort, not a code sprint. **Open question:** is there a roasting-side equivalent worth chasing? (Roasters Guild events, Coffee Roasters Guild championship, regional roaster competitions.) If yes, mirror this on the roasting substrate; if no, roasting compounding stays Chris-corpus + ROASTING.md cross-bean insights only.

### Brewing-side planning capture (Chris-framed 2026-05-22)

- **Coffee brief as a first-class entity.** Roasting captures expected→actual at both stages (`roast_recipes` design intent + `experiments.predicted_cup_per_slot` → `roasts` + `cuppings` reality). Brewing side only captures actual — the coffee brief that claude.ai generates before each brew (strategy decision + signal-flag reconciliation across process/variety + named considerations like cooling-curve discipline + WBC corpus check + vehicle-watch + risk-if-wrong analysis) is the missing "expected" half. The recipe already lives on `brews`; what gets discarded when the conversation closes is the **reasoning chain that produced it**. Right unit per Chris's 2026-05-22 framing is **"experiment set of one"** — capture plan + bag + final brew with actual tasting, three-point arc per coffee, NOT every iteration. Likely shape if ever built: a `brew_briefs` table written via MCP at brief-acceptance time (per [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md)), FK to the eventual `brews` row, structured fields for strategy + modifiers + process_signal_flag + variety_signal_flag + named_considerations[] + risk_if_wrong + roaster_brew_guide_check + cooling_curve_notes, plus free-text rationale. `/brews/[id]` surfaces "the plan" alongside "the result" so the gap between intention and reality is readable.

- **`brews.roaster_tasting_notes` adjacent gap** (Chris-confirmed 2026-05-22 — "a big field I have missing today"). For self-roasted brews we capture `green_beans.producer_tasting_notes` (the producer's expected cup); for purchased brews the **roaster's bag notes** just vanish into the conversation. Both are "expected-cup-from-someone-else" data. Either a new column on `brews` or a field on the eventual brew-brief entity above — pair naturally. **Could ship column-only first** as a sub-sprint if the full brief entity isn't yet scoped; if the full entity ships later the column folds into it. More urgent than the full brief because the bag notes friction is concrete today.

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

- **BREWING.md Cross-Coffee Insight Layer will balloon.** Today: ~16 entries under "Coffees That Confirmed Clarity-First." At 20× volume → 300+ entries per strategy. **Mitigation shipped 2026-05-26 (Wave 2 PR 2):** CCIL extracted into [docs/skills/brewing-historian/cluster/patterns/](docs/skills/brewing-historian/cluster/patterns/), with per-strategy / per-cultivar / per-coffee-family file structure already in place. Future scaling: per-strategy file can self-decompose into sub-files when it crosses the [ADR-0013](docs/adr/0013-self-improvement-primitives.md) 60KB sub-skill cluster threshold.
- **MCP Resources index size** — 21 docs registered today. At 100+ (if archive splits go deep), the `list_docs()` catalog scan cost grows. Mitigation: grouping pattern (`docs://brewing/*`) already in use; when adding more, use the `description` field added in the cleanup PR so claude.ai routes accurately.

### Standing tripwires (always monitor)

- **120KB threshold on any single root-level living doc.** When crossed, plan a split sprint per the CLAUDE.md sprint cadence rule. Post-architecture-arc (2026-05-21): BREWING.md ~3KB redirect stub, ROASTING.md ~6KB redirect stub, CLAUDE.md ~115KB, PRODUCT.md compacted under 120KB. **Architecture-level tripwires added per [ADR-0014](docs/adr/0014-pattern-f-threshold-tiers.md)** (supersedes ADR-0013's uniform threshold with pattern-aware tiers): coordinator catalog > 30KB → propose domain-shard re-introduction; non-Historian sub-skill cluster > 60KB → propose self-decomposition; Historian cluster raises to 80KB; total `docs/skills/` > 300KB → propose Wave 5 architectural retro.
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
