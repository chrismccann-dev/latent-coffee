# Latent Coffee Research — Product Document

*Last updated: 2026-06-03 (refactored into a product-system index; roadmap + issues split out).*

This is the **product-system map**, not the brewing or roasting instruction manual: workflows, data model, app surfaces, architecture, design-system pointers, roadmap pointer, scaling watch-items, and doc-governance. Brewing/roasting/equipment *theory* lives in the coordinator + CONTEXT docs (see [Product Boundaries](#product-boundaries)).

- **Roadmap** (current + future work): [docs/product/roadmap.md](docs/product/roadmap.md)
- **Issues** (bugs / incomplete substrate): [docs/product/issues.md](docs/product/issues.md)
- **Shipped log:** [docs/sprints/shipped.md](docs/sprints/shipped.md) · **Retros:** `memory/project_*.md`

---

## Purpose

**North Star.** Latent is the opinionated training and decision-compounding system whose job is to take Chris up the coffee-competition ladder to a World Brewers Cup win, earned full-stack and on his own accord.

**Single user, single goal.** Supabase Auth + Row Level Security exist for safety and deployment hygiene, not multi-tenancy. No plan for teams, public accounts, or shared workspaces. Latent is built for one person and one goal; it takes a pointed, opinionated view, not a neutral one. There are no external consumers to design for.

**Why.** This is for the love of the craft and the mastery of it, not a career or a commercial endeavor. The competition is a forcing function (the National Geographic Photographer of the Year 2016 pattern): a clarifying goal that forces every component piece into focus, and a third-party stamp proving the mastery is real, independently judged rather than self-asserted.

**Full-stack, own-accord.** Chris sources, roasts, and brews the cup himself. *Producing* (farm-level raw-material creation) is the single biggest lever on the cup but stays out of scope (too slow to experiment against, too operationally heavy, more than a full-time job), so he partners with a producer rather than operating one. Full-stack means **sourcing -> roasting -> brewing**; producing is a partnership. A deliberate inversion of the usual competition story: bring the *producer* forward, not the roaster.

**The ladder.** WBC is the pinnacle, a placeholder for the top rung. Owning the roast opens more rungs beneath it (World Roasting Championship, brand and manufacturer competitions). The goal is competition-winning mastery proved across the ladder, with WBC at the apex.

**The lever hierarchy.** What Chris wants at the end cup drives everything; the levers cascade down from it. In order of effect on the cup: production (partnered, out of his control) > sourcing > roasting > brewing. Sourcing is weighted equal-or-greater to roasting - the biggest lever Chris can actually touch.

**Taste target.** What the goal resolves to in the cup - the **apex** - is the *layered-evolving* cup: distinctive, multilayered, and it transforms across the temperature arc (hot/warm/cool) and the structural arc (attack/body/aftertaste); the anti-target is one-dimensional, whether clean or funky; clarity is the carrier, complexity made legible. It is what sourcing -> roasting -> brewing all resolve toward, and the three derived lever-philosophies cascade from it. Canonical home: [CONTEXT-taste.md](CONTEXT-taste.md).

**The mechanism (what the app is *for*).** Every roast, cupping, and brew becomes compounding evidence aimed at the table. The two foundational jobs - archive the best-known state of each coffee, and compound future decisions on prior evidence - are the *means*, not the end: interjecting champion knowledge and compounding lived results is the training method. That is why the WBC-champion reference corpus exists and why the archive matters. Concretely: purchased coffees store the final best brew; self-roasted lots store the full roast journey, then resolve into a reference roast, reference brew, and per-lot `roast_learnings` synthesis, so each new lot starts from accumulated evidence about cultivar, terroir, process, roaster style, equipment behavior, and prior extraction outcomes instead of from scratch.

**The human + AI hybrid system is the bet.** Most of the coffee world assumes roasting/brewing are irreducibly subjective - you need human taste, so you can't systematize or apply a data/AI-driven approach. Latent goes deliberately against that grain. The win is neither human-only nor AI-only but the *composed system*: Chris (the taster / human judgment), Claude (the builder/constructor of the system), and the data catalog itself - together producing a better, faster outcome than any single actor. This is the operating thesis above all three lever-philosophies, and it mirrors the producer-kinship in the sourcing filter (Chris is drawn to producers who apply the *same* engineering-minded, record-and-iterate systematization to their craft). The lever-philosophies it sits above live in [CONTEXT-taste.md](CONTEXT-taste.md).

**Phase.** Currently in *search space*: every purchased roasted coffee is a practice run for brewing exploration across many brewers and methods. The arc *scopes down* over time - lock the target cup, let the roast determine the brew. Horizon: ~2-3 years to competition-ready. Architect toward it now.

---

## Core Workflows

Two parallel paths, both ending in the same archive: a structured record another agent or surface can query later.

### Path 1: Purchased (roasted) beans — archive-driven

```text
Buy specialty coffee
  → Iterate the brew recipe in claude.ai (brewing coordinator / brewing expert skill)
  → Find the best cup expression
  → Archive only the final best brew via push_brew
  → Reuse it in future synthesis, retrieval, and cross-coffee learning
```

The app does **not** store iterations — that stays in claude.ai. It stores the final archive object: recipe, sensory profile, process, terroir, cultivar, extraction strategy, and what was learned. For brewing concepts, strategy definitions, extraction modifiers, and roaster cards, see the brewing coordinator / expert-skill docs — not this doc.

### Path 2: Self-roasted (green beans) — iterative

```text
Source green beans
  → push_green_bean + push_inventory + push_roast_profile (Roest API write)
  → Roast V-sets (vary one variable per set) or one-shot lots
  → pull_roest_log + push_roast per batch
  → Cup each roast → push_cupping
  → push_experiment per set (UPSERT as iteration progresses)
  → Resolve into a reference roast (or unresolved close-out)
  → Optimize the reference brew on the brewing side
  → Close the lot: push_roast_learnings + linked optimized brew + Roest archive state
```

Roasting iterates *inside* the app — each roast, cupping, and experiment syncs as it happens; close-out adds the synthesis layer without replacing the raw journey. Two prompt families: **V-set lots** use 4 lifecycle-mapped prompts (`start-lot` / `log-roast` / `log-cupping` / `close-lot`); **one-shot lots** (`is_one_shot=true`, single ~100-120g sample, no iteration) use 2 (`one-shot` + `one-shot-closeout`). Roasting operational concepts live in the roasting CONTEXT / coordinator docs — this doc points to them, it does not restate roasting theory.

### Equipment context

Equipment matters to the data model and recipe archive; detailed behavior lives in the equipment cluster docs.

| Domain | Product relevance | Canonical detail |
|---|---|---|
| Grinder | `brews.grinder` / `grind_setting`, recipe comparability | [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) (Weber EG-1) |
| Brewers | `brews.brewer`, filter compatibility | [brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) (Orea/April/Kalita/SWORKS/…) |
| Filters | `brews.filter`, drawdown / flow-rate | [filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) (Sibarist/xBloom/Cafec/…) |
| Roaster | Roest API integration, logs, recipes, inventory | Roest skill / API + roasting coordinator docs (Roest L200 Ultra, 100g counterflow) |
| Water | Brew-recipe context + future comparability | Brewing equipment / coordinator docs |

---

## Product Boundaries

**Belongs in this doc:** product purpose + operating model · core workflow shape · data model + relationship map · canonical-registry index + write-path discipline · current app surfaces · architecture + design-system pointers · roadmap pointer + governance · scaling watch-items · pointers to shipped history, retros, issues, and split-out docs.

**Does not belong here:** detailed brewing/roasting theory · equipment recipe behavior · taste-profile guidance that changes per coffee · spreadsheet-era source inventories · full sprint history · closed-sprint implementation detail · research-experiment roadmaps · bug narratives longer than a short pointer · stale lessons copied forward without synthesis.

---

## Data Model

Per-column schema histories + full per-FK detail live in [docs/architecture/data-model.md](docs/architecture/data-model.md). The roster below is the every-session shape. **Record counts move as work syncs — query the DB when a live count matters; this doc tracks meaning, not counts.**

### Entities

| Entity | Product meaning |
|---|---|
| `brews` | Final best-brew archives. Purchased + self-roasted reference brews share this table (`source` discriminates; self-roasted carry `roaster='Latent'`). |
| `terroirs` | Geographic/ecological zones. Country → Admin Region → Macro Terroir (macro = canonical/aggregation level). |
| `cultivars` | Varieties. Species → Genetic Family → Lineage → Cultivar (cultivar = canonical level). |
| `green_beans` | Raw self-roasted lots. Lifecycle state derived per row (5-state rules in [page-ia.md § Green](docs/architecture/page-ia.md)). |
| `roast_recipes` | Per-batch design intent (one row per Roest profile pushed). Curves + predictions + drop rules. |
| `roasts` | Per-batch execution. Links recipe via `recipe_id`; RoR + inlet-curve + tp/yellowing populated server-side by `pull_roest_log`. |
| `cuppings` | Per-tasting evals. `wb_agtron` + generated `wb_to_ground_delta`; prose axes (sweetness / temperature / aromatic / structural behavior). |
| `experiments` | V-set frames (41-field schema; 16 cross-batch fields drive the waiting-views). |
| `roast_learnings` | Per-lot synthesis. `best_roast_id` FK to the winning roast; `why_this_roast_won` is the resolved-vs-unresolved discriminator. |
| `process_syntheses` / `roaster_syntheses` | AI-synthesis caches keyed on `(user_id, process)` / `(user_id, roaster)`. |
| `doc_proposals` / `taxonomy_overrides_queue` | Arbiter staging: pending prose-doc changes / pending canonical promotions. |
| `api_keys` / `oauth_authorization_codes` | MCP bearer-token auth / OAuth 2.1 + PKCE codes for claude.ai web MCP. |

### Relationship map

```text
profiles (user)
  ├── brews ──────── terroir_id → terroirs · cultivar_id → cultivars
  │   │              green_bean_id → green_beans (self-roasted) · roast_id → roasts (self-roasted)
  │   └── source: purchased | self-roasted
  ├── terroirs ───── Country → Admin Region → Macro Terroir → Meso (synthesis per macro + country)
  ├── cultivars ──── Species → Genetic Family → Lineage → Cultivar (synthesis per lineage)
  ├── process_syntheses ── (user_id, process) PK (no FK; families in lib/process-registry.ts)
  └── green_beans ── terroir_id, cultivar_id
      ├── roasts (cascade) → cuppings
      ├── experiments (cascade)
      └── roast_learnings (one per bean, cascade) → best_roast_id → roasts
```

### FK integrity rules (FK joins, not text matching)

- Every brew sets `terroir_id` + `cultivar_id`; self-roasted also sets `green_bean_id`. Every green bean sets `terroir_id` + `cultivar_id`.
- `push_brew` handles both via `findOrCreateTerroir` + `findOrCreateCultivar` in [lib/brew-import.ts](lib/brew-import.ts). New write paths must preserve these invariants.

### Key brew fields

`coffee_name` · `source` (enum) · `roaster` (self-roasted = `Latent`) · `producer` (don't conflate with roaster) · `extraction_strategy` · `what_i_learned` + `key_takeaways[]` · `terroir_connection` / `cultivar_connection` · `extraction_confirmed` (plan-vs-taste audit trail) · recipe fields (brewer/filter/dose/water/grind/temp/bloom/`pours`/total time/`water_recipe`/`modifiers`) · sensory fields (aroma/attack/mid-palate/body/finish/temperature evolution/peak expression) · `flavors` jsonb + `structure_tags[]` + 9 structured process columns.

---

## Canonical Registries

The product enforces canonical naming through **9 registries** (covering 13 MCP-validated axes — process composes base/subprocess/modifier/decaf/signature; brewer+filter and grinder+grind-setting each pair). Full implementation rules (alias maps, write-time enforcement, the `makeCanonicalLookup` factory) live in [docs/architecture/registries.md](docs/architecture/registries.md). Each registry is a **3-layer pattern**:

1. **Authored markdown** in `docs/taxonomies/<axis>.md` (source of truth, hand-edited).
2. **Validation registry** in `lib/<axis>-registry.ts` (TS mirror via `makeCanonicalLookup`).
3. **DB column or FK** on `brews` / `green_beans` (FK for cultivar/terroir; text for the rest).

| Axis | Authored content | Validation registry | DB shape |
|---|---|---|---|
| Variety / Cultivar | [varieties.md](docs/taxonomies/varieties.md) | `cultivar-registry.ts` | FK `brews.cultivar_id` → `cultivars` |
| Region / Terroir | [regions.md](docs/taxonomies/regions.md) | `terroir-registry.ts` | FK `brews.terroir_id` → `terroirs` |
| Process | [processes.md](docs/taxonomies/processes.md) | `process-registry.ts` | 8 structured columns + legacy `process` text |
| Roaster | [roasters.md](docs/taxonomies/roasters.md) | `roaster-registry.ts` | text `brews.roaster` |
| Roast Level | [roast-levels.md](docs/taxonomies/roast-levels.md) | `roast-level-registry.ts` | text `brews.roast_level` |
| Grinder + Grind Setting | EG-1 equipment cluster | `grinder-registry.ts` | text `brews.grinder` / `grind_setting` |
| Producer | [producers.md](docs/taxonomies/producers.md) | `producer-registry.ts` | text `brews.producer` |
| Flavor notes | [flavors.md](docs/taxonomies/flavors.md) | `flavor-registry.ts` | `flavors` jsonb + `structure_tags[]` + `flavor_notes[]` |
| Brewer + Filter | equipment cluster docs | `brewer-registry.ts` / `filter-registry.ts` | text `brews.brewer` / `filter` |

**Discipline (condensed):** add a canonical via a deliberate 2-step edit (markdown + registry `.ts`); a 3rd step (migration) when renaming existing DB rows. Aliases mean "write the canonical form" (resolve spelling/accent/deprecated/trade-name drift). Text-only axes use `*_override` flags in the MCP write schemas → `taxonomy_overrides_queue`; cultivar / terroir / roast-level stay strict. Migrations renaming keyed text must also update matching synthesis caches. Macros must be real ecological systems, not traceability labels.

---

## AI Synthesis

A read-surface accelerator, not a source of truth. Terroir / cultivar / process / roaster detail pages each aggregate archived brew data (+ `roast_learnings` for the cross-source axes) at the right unit and distill patterns about cup expression, brewing behavior, process mechanics, and house style.

Pipeline detail (3-LLM-call raw → humanizer → mobile short-form, corpus-tier-aware paragraph/token budgets, per-entity adapters, resynthesize triggers) lives in [docs/reference/synthesis-pipeline.md](docs/reference/synthesis-pipeline.md) + the architecture summary in [CLAUDE.md § Architecture](CLAUDE.md). New aggregation surface = one new adapter, not a fifth inline prompt.

---

## Current App State

### Pages

| Page | Status | Product role |
|---|---|---|
| `/brews` · `/brews/[id]` | Built | Main archive list (filters: strategy + individual roaster) + full brew detail. |
| `/terroirs` · `/terroirs/[id]` | Built | Index by country/macro + macro-level aggregation (synthesis, flavor notes, coffees, confidence). |
| `/cultivars` · `/cultivars/[id]` | Built | Index by species/family/lineage + lineage-level aggregation. |
| `/processes` · `/processes/[slug]` | Built | Index by family + process-level aggregation (3-tier nav, 5 sub-page kinds). |
| `/roasters` · `/roasters/[slug]` | Built | Index by extraction-strategy family + roaster-level aggregation (Coffees list is primary; the roaster exception). |
| `/green` · `/green/[id]` | Built | Green-bean list with lifecycle state + full lot journey (inventory/roasts/cuppings/experiments/reference/learnings). |

**Write surfaces are deleted.** `/add` + `/brews/[id]/edit` + all form components + the form-fronting REST routes were removed in Writing-path Sub-sprint 4 (2026-05-27). **Single canonical write path: claude.ai → MCP → Claude Code arbitrates** (per [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md)). Read pages + `lib/*-registry.ts` (MCP-side validation) preserved.

### What works well

Terroir/cultivar pages aggregate at the right level · roaster pages match the roaster-first recall pattern · green-bean detail preserves the full roast journey · MCP write paths centralize validation/canonical handling · the data model supports both workflows without merging their operational shapes.

### Current product issues

Active bugs / missing states / incomplete substrate live in [docs/product/issues.md](docs/product/issues.md) so they don't bloat this overview.

---

## System References

| Reference | Role |
|---|---|
| brewing coordinator / `BREWING.md` redirect | Brewing workflow, strategy, extraction modifiers, recipe iteration, cross-coffee insight handling. |
| roasting coordinator / `ROASTING.md` redirect + CONTEXT-roasting | Roasting workflow, V-set logic, one-shot handling, lot close-out, roast concepts. |
| [CONTEXT-{roasting,brewing,shared}.md](CONTEXT.md) | Latent-specific glossary, zone-split. |
| `docs/skills/brewing-equipment-expert/cluster/*` | Grinder / brewer / filter / water behavior. |
| `docs/taxonomies/*` + `lib/*-registry.ts` | Authored canonical content + runtime validation mirrors. |
| [docs/design-system.md](docs/design-system.md) | Product design-system source of truth. |
| [docs/sprints/shipped.md](docs/sprints/shipped.md) + `memory/project_*.md` | Shipped log + per-sprint retros. |
| `supabase/migrations/*.sql` | Database migration source of truth. |

### Superseded source-data references (archived, not maintained here)

Spreadsheet-era and Word-doc sources predate the app and are no longer product-operating inputs. The current system relies on the DB, coordinator docs, taxonomy docs, and migration history. Archived as historical substrate: the Brewing/Roasting spreadsheets (now CONTEXT + coordinators), the Terroir/Cultivar Word-doc ruleset (now taxonomy docs + registries), the Roasting-Intent Word doc (now CONTEXT-roasting), and the spreadsheet bean counts (query the DB). The Dropbox originals (BMR / Roasting Master Reference / Terroir-Cultivar Ruleset) remain archival snapshots; the repo copies compound going forward.

---

## Architecture

- **Framework:** Next.js 14 App Router; server components by default, client only for interactivity.
- **Database:** Supabase Postgres + Row Level Security; queries scoped to the authenticated user.
- **Auth:** Supabase cookie-based via `@supabase/ssr`.
- **AI synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk` (3-call per-entity pipeline — see [§ AI Synthesis](#ai-synthesis)).
- **MCP write path:** claude.ai → MCP tools → validation helpers → Supabase.
- **Deployment:** Vercel, preview deployments per branch.
- **Dev note:** pass `ANTHROPIC_API_KEY` explicitly to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — Vercel serverless auto-detection fails.

---

## Design System

Full token map / palette / type scale / component primitives / UX conventions live in [docs/design-system.md](docs/design-system.md) (single source of truth, shared with [CLAUDE.md § Design / UX conventions](CLAUDE.md), which carries the code-level enforcement checklist). This doc points there rather than duplicating design rules.

---

## Roadmap

The roadmap is high-change and lives as its own document: **[docs/product/roadmap.md](docs/product/roadmap.md)** — current, on-deck, and future product work only.

- Shipped history → [docs/sprints/shipped.md](docs/sprints/shipped.md) (not the live roadmap).
- Per-sprint retros → `memory/project_*.md`. Research-project roadmaps → their research/coordinator domain. Bugs/incomplete → [docs/product/issues.md](docs/product/issues.md).
- **Roadmap hygiene:** when a sprint ships, append to shipped.md, file the retro, promote open follow-ups, and remove the completed body from the roadmap (full rule in the roadmap doc + [CLAUDE.md § Roadmap currency](CLAUDE.md)).

---

## Scaling Watch-Items

Pressure points for the 1,000-brew goal — product-architecture pressure, not sprint history, so they stay in this doc.

### Before 200+ brews

- **MCP Tool-count discoverability** — 38 Tools today; claude.ai's `tool_search` ranks opaquely. At 50+, consider consolidation (polymorphic `push_*`) or namespace grouping. Description-quality lever already pulled (PR #114).
- **`/brews` index unbounded render (~100-brew tripwire)** — renders every brew with no cap. Non-issue at ~89 (server-rendered). At ~100, a small "show first N + load more" mini-sprint on the *unfiltered* view only. (Tracked in [issues.md](docs/product/issues.md); per-roaster Coffees list already caps at 10.)
- **Full-text search** across `what_i_learned` + sensory fields, and saved/named views once lookup patterns stabilize.

### Before 1,000 brews

- **Cross-Coffee Insight Layer balloon** — at 20× volume, 300+ entries per strategy. Mitigated by extraction into the Brewing Historian cluster (per-strategy/cultivar/coffee-family files); future per-strategy files self-decompose at the ADR-0013 60KB threshold.
- **MCP Resources index** — `docs://` catalog scan cost grows past ~100 docs; use `description` fields + grouping (`docs://brewing/*`).
- **Text-only dimensions** — decide whether roaster/producer/process/brewer/filter need first-class tables; revisit synthesis-cache invalidation; consider denormalized search docs + MCP-write observability.

### Standing tripwires

The canonical loading-profile-aware tripwire table for all constantly-loaded docs lives in [docs/architecture/doc-tripwires.md](docs/architecture/doc-tripwires.md). Headlines: **120KB on any root living doc** (split-sprint trigger; pattern-aware cluster tiers per [ADR-0014](docs/adr/0014-pattern-f-threshold-tiers.md)) · **MEMORY.md** bloat (run `consolidate-memory` quarterly) · **registry↔taxonomy drift** (`check:registry-sync`) · **cross-doc reference rot** (sprint-cadence doc-touch check).

### Scales cleanly (no action)

DB tables · aggregation pages (they're queries) · canonical taxonomies (grow only on net-new entities) · the asymmetric write-trust model (Tools for entities, propose-then-apply for prose).

---

## Split / Archive Triggers

Split a section out of this doc when one is true: it changes every sprint · it holds closed-history rather than current truth · it belongs to a domain-expert doc · it needs detailed bug/implementation narrative · it becomes useful as a standalone input to another agent.

| Content | Target home |
|---|---|
| Live product roadmap | [docs/product/roadmap.md](docs/product/roadmap.md) |
| Product bugs / incomplete substrate | [docs/product/issues.md](docs/product/issues.md) |
| Shipped summaries | [docs/sprints/shipped.md](docs/sprints/shipped.md) |
| Sprint retros / handoffs | `memory/project_*.md` or `docs/sprints/<sprint>.md` |
| Lessons synthesis | Periodic synthesis from recent retros (archive: [lessons-learned-archive.md](docs/sprints/lessons-learned-archive.md)) |
| Brewing / roasting / equipment concepts | Coordinator + CONTEXT + equipment-cluster docs |
| Research projects | Research Coordinator roadmap |

---

## Where History Lives

- **Shipped log:** [docs/sprints/shipped.md](docs/sprints/shipped.md).
- **Per-sprint retros:** `memory/project_*.md`.
- **Migrations:** `supabase/migrations/*.sql` (filename + header = source of truth).
- **Lessons learned (archive):** [docs/sprints/lessons-learned-archive.md](docs/sprints/lessons-learned-archive.md) — frozen snapshot; the live source is the per-sprint retros, with a future synthesis-from-recent-retros digest.
- **Pruning cases:** [docs/sprints/pruning-cases/](docs/sprints/pruning-cases/).
