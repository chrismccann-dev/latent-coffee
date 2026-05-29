# Sub-sprint 4f — Processes polish bundle — kickoff 2026-05-28

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — **sixth and final sub-sprint**, opened after Sub-sprint 4e (Terroirs polish) closed 2026-05-28 ([PR #290](https://github.com/chrismccann-dev/latent-coffee/pull/290), main `79ef0d4`). Closing 4f **closes the Read-path series** → triggers the Claude-Design redesign brainstrom (PRODUCT.md § 5). Producers polish stays DEFERRED (trigger: 2+ producers at 3+ brews each; today only Pepe Jijon qualifies).

## Why processes is last

Per Chris's lived-frequency ordering (audio 2026-05-26): green beans → roasters → brews are the top three (shipped 4a/4b/4c); cultivars / terroirs / processes are the aggregation surfaces after. 4d (cultivars) + 4e (terroirs) both shipped as the **lightest bundles of the series** — Chris's read was that aggregation pages are **reference/informational by nature**. Carry that prior in, but with a caveat specific to processes:

**Processes is structurally different from cultivars/terroirs.** It is NOT a single detail page — Sub Pages 4 (2026-05-11) built a **3-tier composable architecture**: an index with 3 navigation surfaces + **five distinct sub-page kinds** (~21 live URLs). So this is the one aggregation surface where the audit's most likely finding isn't "tweak a section" but **"is this multi-page architecture earning its complexity for how I actually use it?"** Listen for over-build as much as for polish.

## ⚠️ NOT a planned-execution sprint

Same rule as 4a–4e: **default mode = LISTEN, DO NOT EXECUTE.** The autonomy rule does NOT apply until Chris's Phase 1 audit + Claude's complementary pass + a bundled plan + ratified open decisions. Grilling-shaped session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).

**Lessons worth carrying in:**
- **4c**: Chris's audit can reframe the sprint entirely (4c → forward data-model design).
- **4d/4e**: …or shrink it to one ratified change (4d → index typography; 4e → component collapse-default), or "fine as-is."
- Don't assume "polish" means a CSS sweep. For processes specifically, also don't assume the multi-page IA is sacred — it's the youngest and most elaborate of the aggregation surfaces.

## Process — 3 phases, strictly sequential

### Phase 1 — Chris's page-by-page audit (Chris-driven)

Processes has **six surface kinds** to walk, not one detail page. Sample at least one of each that has live data:

1. **`/processes` (index)** — [app/(app)/processes/page.tsx](app/%28app%29/processes/page.tsx). Three navigation surfaces: (a) **Core Process Portals** — 4 base hubs (Washed / Natural / Honey / Wet-hulled) sorted by brew count desc, 0-brew bases hidden; (b) **Modifier Index** — cross-base modifiers with ≥3 brews (8 entries today: Anaerobic 16 / Yeast Inoculated 9 / Dark Room Dried 6 / Cold Fermentation 4 / Raised Bed 4 / Slow Dry 4 / Double Anaerobic 3 / Thermal Shock 3); (c) **Signature Methods** — 15 canonicals, only those with ≥1 brew surface (2 today: Moonshadow / TyOxidator).
2. **`/processes/{base}`** — base hub (Washed / Natural / Honey populated). `aggregateBaseHub` → pure / modified / modifier-combos / honey-subprocesses / signatures breakdown.
3. **`/processes/honey/{subprocess}`** — Honey color tier (white / generic today). Rule 3 structural.
4. **`/processes/{base}/modifiers/{combo}`** — per-base modifier combo, ≥3 brews (Rule 1). 3 today (washed/anaerobic, natural/anaerobic, washed/double-anaerobic-thermal-shock-yeast-inoculated).
5. **`/processes/modifiers/{modifier}`** — cross-base modifier index page (8 today).
6. **`/processes/signatures/{name}`** — signature method page, always earns at ≥1 brew (Rule 2). 2 brewed today.

Page primitives: `<ProcessBreakdownRow>` / `<ProcessConfidenceCard>` / `<ProcessCoffeesList>` + `<CollapsibleBlock>` on base/modifier/signature sub-pages (**now collapse-by-default at all breakpoints post-4e** — confirm it reads right here). Tier B authored content: per-base `summary` + `brewArchetype`, per-modifier `overview`, per-signature `overview` + `observedCupProfile` ([lib/process-registry.ts](lib/process-registry.ts)); mini-pages (modifier-combo + honey-subprocess) render synthesized "What I Learned" only.

**For each surface, note:** info design · UX (front-and-center vs demote) · IA (does the 3-tier nav + 5 page kinds match how you actually navigate, or is it over-built?) · noise · missing (any populated registry field with no render path? check `BaseProcessEntry` / `ModifierEntry` / `SignatureEntry` in [lib/process-registry.ts](lib/process-registry.ts)) · mobile.

**Open questions to surface (mirroring the 4d/4e frame):**
1. **Primary job on the process surfaces?** This is the most abstract aggregation layer. Is it informational reference (like cultivars/terroirs turned out), a navigation-into-brews index (like roasters), or a surface you rarely visit at all? The answer scopes everything — and may legitimately be "I don't use these much, leave them."
2. **Does the 3-tier nav + 5-page-kind architecture earn its complexity?** Sub Pages 4 was an ambitious build. With the corpus at its current size (~21 pages, many at the 1-3 brew floor), does the eligibility-threshold machinery (Rules 1-3) read as useful structure or as scaffolding ahead of the data?
3. **Sub-page eligibility thresholds** — Rule 1 (≥3 brews for a modifier-combo page) / Rule 2 (signature always at ≥1) / Rule 3 (Honey tiers structural). Right cutoffs, or do they produce too-thin pages?
4. **Anoxic qualifier decision (folded in from the old Side-Quests "Process qualifiers schema 1e.5").** Does the processes aggregation need a structured `Anoxic` vs plain `Anaerobic` split, or does aggregation correctly stay at the modifier (Anaerobic) per the locked qualifier convention? This is the one open question that could pull 4f into schema territory — decide explicitly. (Today: `fermentation_qualifiers text[]` exists on `brews`, canonical `['Anoxic']`, deliberately excluded from the legacy display string + not an aggregation key.)
5. **CollapsibleBlock collapse-by-default** just landed in 4e — already applies to the base/modifier/signature sub-pages' "Additional Information". Confirm it reads right rather than re-deciding it.
6. **Mobile scope** — full pass or spot-check? (Aggregation surfaces have been desktop-primary across 4b–4e.)

**Handoff signal**: "OK that's my full audit pass." Do not advance until then.

### Phase 2 — Claude's complementary pass

Output: `docs/sprints/sub-sprint-4f-processes-polish-complementary-pass-<date>.md` (mirror of 4a–4e). Substrate cross-check across the wider-than-usual surface:
- Every populated registry field has a render path — check `BaseProcessEntry` (`summary` + 5-field `brewArchetype`), `ModifierEntry` (`overview`), `SignatureEntry` (`overview` + `observedCupProfile`) for the analog of the 4d unrendered-column catch (note these are authored-registry fields with deliberate empty-state messaging until Chris's Phase A authoring lands — distinguish "intentionally empty pending authoring" from "populated but unrendered").
- Routing determinism: [lib/process-routing.ts](lib/process-routing.ts) slug helpers + reverse parsers; `modifierComboSlug` alphabetization (same structural pattern → same slug).
- Aggregation correctness: [lib/process-aggregation.ts](lib/process-aggregation.ts) — signature brews excluded from modifier-combo aggregations but included in modifier-index; `composeProcessDisplay` dedupe (the legacy `"Anaerobic Anaerobic Slow Dry…"` render-bug fix) holds across representative rows.
- Synthesis dispatch: [lib/synthesis/adapters/process.ts](lib/synthesis/adapters/process.ts) `getProcessAdapter(kind)` (5 kinds) + `process_aggregation_syntheses` cache (migration 051, UNIQUE on `(user_id, aggregation_kind, aggregation_key)`) + the per-kind render gate.
- Confidence thresholds: [lib/process-confidence.ts](lib/process-confidence.ts) (3+ HIGH / 2 MEDIUM / 1 LOW per Rule 5).
- Render-gate audit mirroring the 4b `brewGuideLink` / 4c `Water:` / 4d species-weight / 4e collapse-default catches.

Note: no `execute_sql` exposed on this MCP server (PostgREST read tools only) — run the column-population check statically against the registries + render paths, as in 4e.

### Phase 3 — Plan-mode bundled implementation

Enter plan mode. Present bundle structure, ratify, ship. Files likely to touch: `app/(app)/processes/**`, [lib/process-registry.ts](lib/process-registry.ts) / [lib/process-aggregation.ts](lib/process-aggregation.ts) / [lib/process-routing.ts](lib/process-routing.ts) (if IA changes), [lib/synthesis/adapters/process.ts](lib/synthesis/adapters/process.ts) (if substrate-fold), `lib/types.ts` (if new field surfaces), `CLAUDE.md § Processes`, sprint-close housekeeping. **Series-close housekeeping**: 4f close should also move PRODUCT.md § Active Sprints #4 to a closed state + flag that the Read-path series is complete (redesign-brainstorm trigger condition #2 now met).

**Likely NOT in scope** (defer per Bucket G): the structured-pour migration (Item 39, separate); synthesis prompt rewrites; MCP Tool surface (process resolution stable). **Possibly in scope**: a schema change *only if* the Anoxic-qualifier decision (Q4) lands on "structured split" — in which case the migration-apply gap below is live.

## Locked decisions from prior sprints (do NOT re-litigate)
1. ✓ Desktop is the primary design target (phone-scope = separate sub-sprints)
2. ✓ 3-phase sequencing (Chris audit → Claude complementary pass → plan-mode bundle)
3. ✓ Single PR per bundle
4. ✓ MCP-only writes (forms deprecated)
5. ✓ Six-actor audit before every PR
6. ✓ `CollapsibleBlock` collapses by default at every breakpoint (4e) — applies to process sub-pages; don't re-open

## ⚠️ Migration-apply gap (learned in 4c, avoided in 4d/4e)
If the Anoxic decision (Q4) — or anything else — adds a DB column, apply the migration to Supabase BEFORE merge: the worktree has no DDL path (only PostgREST). 4d + 4e had no DB dependency and merged clean. If a column is genuinely needed, ship code on a branch + hand Chris the one-line migration + merge after `check-migrations` goes green. Sequence any non-DB bundle to merge independently.

## Reference
- [Sub-sprint 4e kickoff](sub-sprint-4e-terroirs-polish-kickoff-2026-05-28.md) + [complementary pass](sub-sprint-4e-terroirs-polish-complementary-pass-2026-05-28.md) — most recent precedent (the "informational surface → single component fix" lesson + the clean substrate cross-check)
- [Sub-sprint 4d kickoff](sub-sprint-4d-cultivars-polish-kickoff-2026-05-28.md) + [complementary pass](sub-sprint-4d-cultivars-polish-complementary-pass-2026-05-28.md) — the "informational → light bundle" + intentionally-internal-columns lessons
- [PRODUCT.md § Active Sprints #4](../../PRODUCT.md) — series-level scope (4f is the closer)
- [CLAUDE.md § Processes](../../CLAUDE.md) — post-Sub-Pages-4 3-tier architecture shape
- [docs/grilling-queue.md](../grilling-queue.md) — the Anoxic-qualifier question may already have a queue entry worth draining here
