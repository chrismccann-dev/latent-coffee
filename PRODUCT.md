# Latent Coffee Research — Product Document

*Last updated: April 16, 2026*

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
| **brews** | 56 | Best brew archives (52 purchased, 4 self-roasted) |
| **terroirs** | 22 | Geographic/ecological zones |
| **cultivars** | 30 | Coffee varieties with genetic taxonomy |
| **green_beans** | 4 | Raw coffee lots (self-roasted only) |
| **roasts** | 61 | Individual roast logs per green bean |
| **cuppings** | 17 | Cupping evaluations per roast |
| **experiments** | 0 | Structured A/B/C roast experiments (schema exists, not yet imported) |
| **roast_learnings** | 4 | Per-bean synthesis of what was learned from roasting |

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
| coffee_name | text | Full name of the coffee | 56/56 |
| source | enum | "purchased" or "self-roasted" | 56/56 |
| extraction_strategy | text | Clarity-First / Balanced Intensity / Full Expression | 56/56 |
| what_i_learned | text | Long-form narrative of key learnings from this coffee | 37/56 |
| key_takeaways | text[] | Bullet-point learnings (from import) | 56/56 |
| terroir_connection | text | How terroir expressed in the cup | ~16/56 |
| cultivar_connection | text | How cultivar expressed in the cup | ~20/56 |
| extraction_confirmed | text | Confirmed strategy tag | 13/56 |
| Recipe fields | various | brewer, filter, dose_g, water_g, grind, temp_c, bloom, pour_structure, total_time | 56/56 |
| Sensory fields | text | aroma, attack, mid_palate, body, finish, temperature_evolution, peak_expression | 56/56 |

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
| **/green** | Built | Green bean list and detail with roast logs, cuppings, experiments, learnings |
| **/add** | Built | Purchased flow: 4-paste wizard matching the archive spreadsheet tabs (Bean / Terroir / Cultivar / Best Brew) with registry validation, drift detection, and one-click auto-fix. Self-roasted flow: original 9-step tab-delimited paste wizard. |
| **POST /api/brews/import** | Built | Programmatic JSON endpoint for archiving a brew with the same validation/persist logic as the UI |
| **POST /api/brews/parse** | Built | Parses pasted text, falls back to Claude Sonnet 4.6 when deterministic parser can't recover required fields. Returns match + drift annotations. |

### What Works Well

- Terroir and cultivar pages aggregate learnings at the right level (macro terroir, lineage)
- AI synthesis provides useful first-person narrative summaries
- All FK relationships are solid — no broken links, no orphaned records
- Green bean detail pages show the full roasting journey (logs → experiments → cuppings → learnings)
- Data model supports both purchased and self-roasted workflows

### What's Missing or Incomplete

**Self-roasted add flow is still the original 9-step paste wizard**
- Works for the 4 existing self-roasted brews but the UX is paste-heavy and doesn't share the registry-validation / drift-detection / three-state-review polish that the purchased flow now has
- Doesn't use `lib/brew-import.ts` — duplicates terroir/cultivar lookup-or-create logic
- Next natural unification: refactor self-roasted flow to mirror the 4-paste purchased wizard (Green Bean tab / Terroir / Cultivar / Roast Logs + Best Brew), calling the same shared `parseAndMerge` + `persistBrew` infrastructure

**Fields not yet surfaced in UI**
- `what_i_learned` — exists in DB (37/56 populated) but not displayed on brew detail page
- `extraction_strategy` / `extraction_confirmed` — in DB (56/56) but not displayed
- Terroir extended fields (acidity_character, body_character, farming_model, dominant_varieties, typical_processing) — columns exist, not populated, not shown
- Cultivar extended fields (roast_behavior, resting_behavior, market_context) — columns exist, not populated, not shown

**Experiments table empty**
- Schema supports structured A/B/C experiments with full hypothesis → outcome → insight flow
- The roasting spreadsheet has experiment data (at least 2 sets) but they haven't been imported
- The add wizard has an experiments step but it depends on the self-roasted flow

**No search or filtering**
- Brews list is chronological only
- No way to filter by terroir, cultivar, process, extraction strategy
- No way to search across what_i_learned narratives

**No process-level aggregation**
- Terroirs aggregate by geography, cultivars by genetics
- No equivalent page for processes (Washed, Natural, Honey, Anaerobic, etc.)
- The Brewing Master Reference has rich process-level patterns (Archive Patterns section) that aren't in the app

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

- **Self-roasted add flow refactor** — port the 4-paste wizard pattern to self-roasted. Steps would map to the roasting spreadsheet tabs: Green Bean / Terroir / Cultivar / Roasts (multi-row) + Best Brew. Reuse `lib/brew-import.ts` for terroir/cultivar resolution; add analogous helpers for roasts + experiments + cuppings + roast_learnings.
- **Surface what_i_learned and extraction_strategy in UI** — these are the most valuable fields and they're invisible right now.
- **Backfill remaining what_i_learned** — 19 brews still missing long-form learnings.
- **Import experiment data** — the roasting spreadsheet has structured experiments that belong in the experiments table (0 records today).

### Medium-term (knowledge compounding)

- **Process-level aggregation** — a third dimension alongside terroirs and cultivars. The Brewing Master Reference already has rich process patterns (e.g., "honey lots benefit from bed exposure between pours", "anoxic natural processing overrides variety signals"). These could be surfaced as process pages with synthesis.
- **Extraction strategy patterns** — the three strategies (Clarity-First, Balanced Intensity, Full Expression) are a core part of the brewing framework. A view showing which coffees confirmed which strategy, organized by variety × process, would be directly useful for recipe design.
- **Cooling behavior tracking** — many brews have critical evaluation temperature thresholds (e.g., "do not evaluate before 50°C", "rose character only emerges near 40°C"). This is scattered in temperature_evolution and what_i_learned but not structured or searchable.
- **Roaster reference integration** — the Brewing Master Reference has cards for 30+ roasters with house style tags. These could live in the app and link to brews.

### Longer-term (workflow integration)

- **Claude project integration** — the iteration workspace (Claude projects) and the archive (this app) are currently disconnected. When a brew is finalized in a Claude project, there's a manual step to transcribe it into the spreadsheet and then into the app. Tighter integration could streamline this.
- **Green bean sourcing intelligence** — when Chris sources a new green bean, the app could surface relevant prior learnings: "You've roasted 2 other Gesha 1931 lots. Development time was the primary lever. Start near Batch 25 parameters."
- **Cross-dimensional queries** — "Show me all Clarity-First brews on Gesha from the Central Andean Cordillera" or "Which cultivars required Full Expression regardless of process?"

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
| PR #9 | Purchased coffee import flow — 4-paste wizard, shared validation/persist module, drift detection, multi-row terroir match fix |
