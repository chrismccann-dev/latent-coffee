# Sub Pages 6.7 — Track C: MCP + Prompts Drift Audit

**Scope:** `docs/prompts/*.md` (8 operational prompts) + `lib/mcp/*.ts` (~38 Tool definitions + helpers + Resource bodies).
**Audit date:** 2026-05-13.
**Reviewer:** /loop close-out automated pass + targeted grep verification.

## Methodology

1. Read all 8 operational prompts in full.
2. Grep across the entire `lib/mcp/` tree for known drift patterns: deprecated URLs (`/add`, `/edit`), stale field-count claims (`25 fields`, `22 fields`), legacy framing (`LegacyDetailRender`, `6-sub-sprint`, `purchased step 6`), schema-rename drift (`best_batch_id` without `best_roast_id`), and inlet/fan curve location drift (now on `roast_recipes`, kept on `roasts` for back-compat only).
3. Spot-read individual Tool files referenced by the grep hits for context.
4. Cross-check Tool descriptions against the schema additions in migrations 050 + 052.

Track C deliverable shape, per the kickoff decision: **Hybrid — report first, then PR for clear-cut.** Clear-cut items are auto-fix candidates; interpretive items get flagged here and Chris does the rewrite himself.

## Summary

| Bucket | Clear-cut | Interpretive | Total |
|---|---|---|---|
| A. Dead paths / deprecated URLs | 2 | 0 | 2 |
| B. Stale schema references | 1 | 0 | 1 |
| C. Stale page-shape references | 0 | 0 | 0 |
| D. Tool description ↔ schema | 0 | 0 | 0 |
| E. Workflow gaps | 0 | 0 | 0 |
| F. Other stale references | 1 | 0 | 1 |
| **Total** | **4** | **0** | **4** |

All 4 are clear-cut. Track C clear-cut PR ships all 4 fixes; no interpretive bucket to leave for Chris.

## A. Dead paths / deprecated URLs

### A.1 — `lib/mcp/push-green-bean.ts` line 73

**Current text** (verbatim in the description):

```
... (use the app /add or /edit UI to update fields on an existing lot). On a fresh insert, ...
```

**Drift:** Stale post Sub Pages 6.6 (2026-05-13). The `/add?type=self-roasted` wizard was deleted; `green_beans` is now MCP-only per CLAUDE.md and `feedback_mcp_only_input.md`. There is no app surface for updating green_bean rows.

**Suggested fix:** Replace the parenthetical with a pointer to `patch_green_bean`.

```
... (use patch_green_bean to update fields on an existing lot). On a fresh insert, ...
```

**Bucket:** Clear-cut.

### A.2 — `lib/mcp/push-cupping.ts` line 36

**Current text:**

```
... (use the app /add or /edit UI to update notes on an existing cupping). The optional recipe_variant field ...
```

**Drift:** Doubly stale. (1) No `/add` flow ever wrote cuppings — cuppings have always been MCP-side or back-end-only. (2) Even if the wording meant the legacy SR wizard, that wizard is gone post 6.6.

**Suggested fix:** Replace the parenthetical with a pointer to `patch_cupping`.

```
... (use patch_cupping to update notes on an existing cupping). The optional recipe_variant field ...
```

**Bucket:** Clear-cut.

## B. Stale schema references

### B.1 — `docs/prompts/closed-bean-full-fill.md` line 135

**Current text:**

```
STAGE 6 - push_roast_learnings (one row per closed bean):
- All 17 fields from "Overall Lessons (Per Bean)": best_batch_id,
  why_this_roast_won, aromatic_behavior, structural_behavior, elasticity,
  ...
```

**Drift:** `best_batch_id` is the legacy free-text field; Sub Pages 6.1 (migration 052, 2026-05-13) introduced `best_roast_id` (typed UUID FK to `roasts.id`) and the MCP Tool descriptions for `push_roast_learnings` / `patch_roast_learnings` explicitly mark it preferred over `best_batch_id`. The prompt has not been updated to reflect the preferred field.

**Suggested fix:** Lead with `best_roast_id`; demote `best_batch_id` to legacy back-compat noted parenthetically.

```
STAGE 6 - push_roast_learnings (one row per closed bean):
- All 17 fields from "Overall Lessons (Per Bean)": best_roast_id (Sub Pages 6.1
  typed FK to roasts.id; preferred), best_batch_id (legacy free-text, back-compat
  through Phase 3), why_this_roast_won, aromatic_behavior, structural_behavior,
  elasticity,
  ...
```

**Bucket:** Clear-cut.

## C. Stale page-shape references

**Status:** None found.

`LegacyDetailRender` / "flat green bean card grid" / "purchased step 6" all return 0 hits across both directories.

## D. Tool description ↔ schema consistency

**Status:** None found.

Spot-checked:

- `push_experiment` description (line 93) names all 4 temporal-moment field families added in migration 052 (`updated_cup_prediction_*`, `taste_for_*`, `delta_from_roast_*`, `delta_from_cup_*`). ✓
- `patch_experiment` lists each of the 16 new fields individually with per-field describe() text. ✓
- `push_roast_learnings` description and Zod schema both reference `best_roast_id` as preferred + `best_batch_id` as legacy. ✓ (The prompt's lag is the B.1 finding above, not a tool-side problem.)
- `push_roast_recipe` + `patch_roast_recipe` exist + have descriptions referencing migration 052. ✓
- `push_roast` schema includes `recipe_id` FK (line 93). ✓
- `roasts://by-bean/{green_bean_id}` Resource description (server.ts line 215) lists `roast_recipes[]` in the return shape; the `roast_recipes://by-experiment/{experiment_id}` template exists (line 247). ✓

All temporal phrasing in describe() text matches the Sub Pages 6.1 redesign-doc § 4.2 framing (which moment in the lifecycle each field is written at).

## E. Workflow gaps

**Status:** None found.

The 8 operational prompts cover:

- New bean intake → V1 design → roast → cup → synthesize → close-out.
- In-process incremental sync (mid-iteration recovery).
- Closed-bean full-fill (recovery write-path for a lot that finished outside the live workflow).
- Brew side: start-brew / log-brew / bundled-brewing-completion / propose-doc-changes-from-brew.

Every workflow stage referenced in a prompt has a backing Tool. No "this prompt asks me to call X but X doesn't exist" cases.

The brief specifically asked whether a `list_open_v_sets` Tool or a `patch_roast_recipe` for late-arriving Roest metadata might fill a gap:

- `patch_roast_recipe` already exists (added in 6.1). ✓
- `list_open_v_sets` is implicit via `get_bean_pipeline` + lifecycle-state derivation; prompts use that path. No gap.

## F. Other stale references

### F.1 — `lib/mcp/docs.ts` line 73

**Current text:**

```
'Use when implementing or extending the roasting-side data model / pages — series-level scope doc for the 6-sub-sprint roasting rebuild (Sub Pages 6.1-6.6, scoped 2026-05-13). ...'
```

**Drift:** Sub Pages 6.7 shipped 2026-05-13, making the series a 7-sub-sprint rebuild covering 6.1–6.7. The doc this description points at (`docs/roasting/redesign.md`) has not changed, but the description undercounts the shipped scope.

**Suggested fix:**

```
'Use when implementing or extending the roasting-side data model / pages — series-level scope doc for the 7-sub-sprint roasting rebuild (Sub Pages 6.1-6.7, scoped + shipped 2026-05-13). ...'
```

**Bucket:** Clear-cut.

## Tally per file

| File | Clear-cut | Interpretive |
|---|---|---|
| `docs/prompts/closed-bean-full-fill.md` | 1 | 0 |
| `lib/mcp/docs.ts` | 1 | 0 |
| `lib/mcp/push-green-bean.ts` | 1 | 0 |
| `lib/mcp/push-cupping.ts` | 1 | 0 |
| Everything else | 0 | 0 |

## Recommended next action

Open small PR with all 4 clear-cut fixes applied in-place. No interpretive bucket — Chris does not need to review anything further from this audit. Brewing-side prompts will need a parallel sweep when the brewing-side `/add?type=purchased` deprecation lands (future sprint per `feedback_mcp_only_input.md`), but until then they correctly reference the live `/add` flow.

## Coverage notes

- Prompts: 8/8 read in full.
- MCP files: targeted grep across all ~38 files for known drift patterns; spot-reads on every hit to confirm context. The initial Explore-agent pass under-sampled MCP at 39%; a follow-up verification grep caught 3 additional drift items the agent missed (the 2 stale `/add /edit UI` references and the `docs.ts` Sub-Pages-6 series description).
