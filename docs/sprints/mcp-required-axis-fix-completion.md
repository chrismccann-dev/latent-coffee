# Completion report — MCP schema-publication required-axis fix (#57) + patch_cupping key-field path

Executes [mcp-required-axis-fix-kickoff.md](docs/sprints/mcp-required-axis-fix-kickoff.md) (2026-07-15
plan-feedback pass). Code PR: [#578](https://github.com/chrismccann-dev/latent-coffee/pull/578),
squash-merged to main as `d66af0510fdc0e979ecea7a3f1db28ca6d9e1197` (`d66af05`). This report +
the backlog/shipped.md currency flips landed in the follow-up close-out PR (same day).

## 1. Plan (restated)

Every field-level patch Tool should publish only its true identity key as `required`
(root cause: `numField`/`boolField` in lib/mcp/coerce.ts wrapped `.optional().nullable()`
INSIDE `z.preprocess`, so optionality never reached the published object-level `required`
array — patch_green_bean published 6 required fields, forcing collateral writes + a
roast_priority null-clobber on a lot_status-only patch); patch_cupping should gain a
key-field update path (its composite-key fields were lookup-only — the same param was both
lookup value and written value, so it could only write back what it matched); close out with
the 2-row SPG eval_method data patch as live verification.

## 2. What shipped, per scope item

1. **coerce.ts wrap reorder (candidate shape 1a).** `.optional()` moved OUTSIDE the
   `z.preprocess(...)` wrap; `.nullable()` stays inside so explicit nulls pass through the
   preprocess untouched. Chose (a) over (b) (schema-compat `required` rewrite) because it
   fixes the schema at the source rather than patching the publication — and it verifiably
   fixed the published JSON schema on the first empirical test, with zero behavior change to
   coercion (see § 4). No schema-compat.ts change needed. Divergence from brief: none — (a)
   was the brief's first-listed candidate.
2. **Consumer audit.** `grep -rn "numField\|boolField" lib/mcp/` → only two consumers:
   [lib/mcp/push-green-bean.ts](lib/mcp/push-green-bean.ts) (price_per_kg, quantity_g,
   elevation_m, roest_inventory_id, is_one_shot) and
   [lib/mcp/patch-green-bean.ts](lib/mcp/patch-green-bean.ts) (price_per_kg,
   quantity_g, elevation_m, roast_priority, roest_inventory_id). The only other
   `z.preprocess` in lib/mcp/ is propose-doc-changes.ts's citation `op`→`operation`
   normalizer — a REQUIRED nested field inside a required array, not on this axis. All 38
   tools' published `required` arrays dumped through the in-memory client and confirmed to
   collapse to true key sets (full dump in § 4).
3. **check:mcp required-axis gate.** [scripts/check-mcp-tools.ts](scripts/check-mcp-tools.ts)
   assertion 4: for every tool, any key in the published `required` array whose zod source
   accepts `undefined` (`safeParse(undefined).success` — wrapper-agnostic, so a future
   preprocess/pipe/default re-wrap stays gated) is a failure; plus a canary asserting
   `patch_green_bean.required == ["green_bean_id"]`. Negative-tested by stashing the
   coerce.ts fix: the gate reported 11 problems (10 over-required fields + the canary).
4. **patch_cupping cupping_id path.** Recommended shape adopted verbatim: optional
   `cupping_id` (uuid) direct-PK lookup in both
   [lib/roast-import.ts](lib/roast-import.ts) `patchCupping` and the Tool schema in
   [lib/mcp/patch-cupping.ts](lib/mcp/patch-cupping.ts). When `cupping_id` is
   supplied, `cupping_date` / `eval_method` / `recipe_variant` become ordinary patchable
   fields (they were already in `CUPPING_PATCH_FIELDS`; only the lookup coupling blocked
   key changes). Tool description + SYNC_V2.md Cuppings row updated. Two deliberate
   additions beyond the brief's letter:
   - The composite-key lookup fields are now schema-OPTIONAL (required so the cupping_id
     path can omit them), so the handler enforces the contract server-side: `cupping_id` OR
     `roast_id` required, and composite mode requires all three non-roast_id key fields
     EXPLICITLY supplied (null allowed) — an omitted field must never silently NULL-match
     under NULLS NOT DISTINCT semantics (behavior-preserving: the old schema forced them
     present anyway).
   - The Cluster 2 date guard now reads `roast_id` from the looked-up row instead of the
     payload (required for cupping_id-mode patches to cupping_date/rest_days; identical in
     composite mode).
5. **SPG data patch — EXECUTED LIVE** (see § 4). Both rows → `eval_method='Simulated
   Pourover'`; `recipe_variant` (`real_pourover`) + all prose untouched per the
   conservative read of #48 (the SPG flag in `overall` stays).

## 3. PR + merge

- PR: https://github.com/chrismccann-dev/latent-coffee/pull/578
- Merge SHA (main): `d66af0510fdc0e979ecea7a3f1db28ca6d9e1197`
- Files: lib/mcp/coerce.ts · scripts/check-mcp-tools.ts · lib/roast-import.ts ·
  lib/mcp/patch-cupping.ts · SYNC_V2.md (+ this report / feedback-backlog.md /
  shipped.md in the close-out PR)

## 4. Actual verification output

**Published `required` arrays, before → after** (in-memory MCP client against the real
`tools/list` path, i.e. through the schema-compat wrap):

```
BEFORE  patch_green_bean.required = ["green_bean_id","price_per_kg","quantity_g","elevation_m","roast_priority","roest_inventory_id"]
BEFORE  push_green_bean.required  = ["lot_id","name","price_per_kg","quantity_g","elevation_m","roest_inventory_id","is_one_shot"]
BEFORE  patch_cupping.required    = ["roast_id","cupping_date","eval_method","recipe_variant"]

AFTER   patch_green_bean.required = ["green_bean_id"]
AFTER   push_green_bean.required  = ["lot_id","name"]
AFTER   patch_cupping.required    = (absent — both lookup modes optional at schema level, enforced server-side)
```

Full 38-tool `required` dump (all confirmed true key sets): get_bean_pipeline
["green_bean_id"] · get_brew ["brew_id"] · get_green_bean [] · list_canonicals [] ·
list_doc_proposals [] · list_doc_sections ["uri"] · list_docs [] · list_green_inventory [] ·
list_recent_brews [] · list_roest_inventory [] · list_roest_logs ["inventory_id"] ·
list_skeleton_entries [] · list_taxonomy_queue [] · patch_brew ["brew_id"] · patch_cupping
[] · patch_experiment ["experiment_pk"] · patch_green_bean ["green_bean_id"] ·
patch_inventory ["roest_inventory_id"] · patch_roast ["roast_id"] · patch_roast_learnings
["roast_learnings_id"] · patch_roast_recipe ["recipe_id"] · propose_canonical_addition
["axis","value"] · propose_doc_changes ["target_doc","source","citations","summary"] ·
pull_roest_log ["log_id"] · push_brew ["coffee_name","roaster","terroir","cultivar"] ·
push_cupping ["roast_id"] · push_experiment ["green_bean_id","experiment_id"] ·
push_green_bean ["lot_id","name"] · push_inventory ["name","initial_weight"] · push_roast
["green_bean_id","batch_id"] · push_roast_learnings ["green_bean_id"] · push_roast_profile
["name","preheat_temperature_c","temperature_bezier","fan_bezier","rpm_bezier","end_condition_value"]
· push_roast_recipe ["green_bean_id"] · read_canonical ["axis"] · read_doc ["uri"] ·
read_doc_section ["uri","anchor"] · resolve_doc_proposal ["proposal_id","status"] ·
resolve_queue_entry ["queue_id","action"].

**Coercion behavior preserved** (`numField(z.number().int())` / `boolField()` after the
reorder): `'42'` → 42 · `7` → 7 · `null` → null · `undefined` → success (absent) · `'abc'`
→ reject; `'true'` → true · `'false'` → false · `false` → false · `null` → null ·
`undefined` → success · `'yes'` → reject.

**check:mcp:** green — `TOTAL: 38 tools registered.` `Published-catalog type coverage
passed (no untyped properties, no bare unions, no optional-field-in-required; price_per_kg
+ patch_green_bean.required canaries OK).` Negative test (old coerce.ts stashed back in):
`Published-catalog type coverage FAILED (11 problem(s))` — the 5 patch_green_bean + 5
push_green_bean over-required fields plus the new canary.

**Build hygiene:** `npx tsc --noEmit` clean; full `npm run build` clean (node_modules
symlinked into the worktree per CLAUDE.md, removed before commit).

**Live SPG patch (executed post-deploy, this session):** Vercel production deploy of
`d66af05` confirmed (`state: success`) before patching. The session's cached catalog still
held the OLD patch_cupping schema (per the MCP catalog-cache rule), but the old schema
doesn't forbid extra properties — so each call supplied `cupping_id` + the composite fields
with the NEW eval_method value: on the new server the cupping_id path wins and eval_method
is a patch field; on a stale server the composite lookup with the new value would have
failed not_found (safe either way — no fresh session needed after all).

```
patch_cupping { cupping_id: a3946b27-…, eval_method: "Simulated Pourover", … }
  → { cupping_id: "a3946b27-6a9d-405f-b49c-c4920b85c0af", updated_fields: ["cupping_date","eval_method","recipe_variant"] }
patch_cupping { cupping_id: d8f814c8-…, eval_method: "Simulated Pourover", … }
  → { cupping_id: "d8f814c8-3976-4018-b93f-86c4240873b5", updated_fields: ["cupping_date","eval_method","recipe_variant"] }
```

(cupping_date + recipe_variant appear in updated_fields because they were supplied to
satisfy the cached client schema — written back with their current values, no data change.)

Re-read via `get_bean_pipeline(9f7e586d-…, since: 2026-07-15)`: both rows show
`eval_method: "Simulated Pourover"`, `recipe_variant: "real_pourover"`, all prose fields
intact, `updated_at` fresh (2026-07-15T20:41Z). This was patch_cupping's first-ever
key-field change and doubles as the live verification of both scope items 1 and 4.

## 5. Six-actor trace

- **Actor 4 (MCP):** patch_cupping schema + description document the cupping_id path;
  SYNC_V2.md Cuppings row updated. Tool count unchanged (38).
- **Actor 5 (Claude Code docs):** no CLAUDE.md change (count/auth unchanged, as the brief
  expected). This report + backlog/shipped currency are the substrate record.
- **Actor 2 (prompts):** grepped `patch_cupping` across docs/prompts/ + docs/skills/ — all
  references describe the composite key or generic correction use; none contradict the
  ADDITIVE cupping_id lookup (composite mode is fully preserved). No prompt edits (also
  explicitly out of scope — the parallel prompt-hygiene batch owns prompts; it merged as
  PR #579 during this sprint, rebased cleanly).
- **Actor 3 (claude.ai):** skip — surface deprecated; the account-level connector picks up
  the new schema on next fresh handshake.
- **Actor 6 (schema/UI):** skip — no migration, no UI change (data patch only touched row
  values already rendered).
- **Actor 1 (Chris):** /green Bukure NAT21 cupping rows now read the canonical
  `Simulated Pourover` eval_method.

## 6. Deferred / surprising / new

- **Surprising (useful precedent):** the MCP catalog-cache rule turned out to be softer
  than "fresh session required" for ADDITIVE schema changes — a stale client schema without
  `additionalProperties: false` accepts new optional params, so the live patch ran from
  this same session. Changed/removed params would still need the fresh handshake.
- **Behavior note (deliberate, documented in the Tool description):** composite-mode calls
  must now explicitly supply all three non-roast_id key fields. The old schema forced this
  anyway (they were `required`), so no caller breaks; but a hypothetical caller relying on
  omission-as-NULL-match would now get a validation error naming the missing fields.
- **Deferred:** nothing from this brief. The SPG-specific lifecycle state + the `overall`
  prose SPG flags stay with the parallel lifecycle/SPG grilling session (out of scope
  here by design).
- **New friction to route:** none observed worth filing.
