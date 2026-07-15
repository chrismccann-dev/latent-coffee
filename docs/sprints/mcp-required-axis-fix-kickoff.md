# Kickoff brief — MCP schema-publication required-axis fix (#57) + patch_cupping key-field path [EXECUTION]

Emitted by the 2026-07-15 plan-feedback pass (Chris selected this cluster). Execution work -
the autonomy rule applies: implement, verify, commit + push + PR + merge, end with PR URL +
merge SHA.

## Problem

`patch_green_bean` publishes 5 unrelated fields as `required` (a `lot_status`-only patch
forces collateral writes + a `roast_priority` null-clobber the auto-mode classifier rightly
blocks), and `patch_cupping` cannot change its own composite-key fields at all - so the
long-queued SPG `eval_method` data patch has no MCP path.

## Goal

Every field-level patch Tool publishes only its true identity key as `required`, and
patch_cupping gains a key-field update path; close out with the 2-row SPG eval_method data
patch that has been waiting on it.

## Root cause (pinned 2026-07-15, code-verified)

The 5 over-required fields on patch_green_bean (`price_per_kg` / `quantity_g` / `elevation_m`
/ `roast_priority` / `roest_inventory_id`) are exactly the `numField(...)` fields: in
[lib/mcp/coerce.ts](../../lib/mcp/coerce.ts), `numField`/`boolField` wrap
`inner.optional().nullable()` INSIDE `z.preprocess(...)`, and the optionality does not
propagate to the published object-level `required` array. Sibling of shipped #52 (type-axis,
[lib/mcp/schema-compat.ts](../../lib/mcp/schema-compat.ts)); this is the required-axis that
fix didn't touch. Sub-issue (b) from the original filing (divergent `required` arrays across
two registrations) is MOOT - the 2026-07-10 connector canon removed the duplicate
registration.

## Scope

**In:**
1. Fix `numField`/`boolField` so preprocess-wrapped optional fields publish as optional.
   Candidate shapes (pick whichever verifiably fixes the published JSON schema):
   (a) reorder the wrap (`z.preprocess(...).optional().nullable()` at the outer level, or
   `z.union` with preprocess inside); (b) extend `schema-compat.ts` to strip
   preprocess-wrapped-optional properties from `required` at publication (mirrors the #52
   pattern - one global rewrite, no per-tool edits).
2. Audit EVERY Tool using `numField`/`boolField` (`grep -rn "numField\|boolField" lib/mcp/`)
   and any other preprocess-wrapped optional field - confirm the published `required` array
   for each affected Tool collapses to its true key set.
3. Extend the `check:mcp` gate to fail when a `.optional()` zod field appears in a published
   `required` array (the enforcement that keeps this class dead, mirroring #52's gate).
4. patch_cupping key-field update path: composite-key fields (`eval_method`,
   `recipe_variant`, `cupping_date`) are lookup-only today. Recommended shape: accept an
   optional `cupping_id` direct lookup (get_bean_pipeline already returns cupping ids); when
   `cupping_id` is supplied, the four composite-key params become ordinary patchable fields.
   Update the Tool description accordingly.
5. Run the queued SPG data patch as live verification: cuppings
   `a3946b27-6a9d-405f-b49c-c4920b85c0af` + `d8f814c8-3976-4018-b93f-86c4240873b5` (both
   Bukure RWA-NOVA-NAT21-RB-2026, cupping_date 2026-06-04, currently
   `eval_method='Pourover'` / `recipe_variant='real_pourover'`) → set
   `eval_method='Simulated Pourover'`. Leave `recipe_variant` + prose untouched (conservative
   read of backlog #48; the SPG flag in `overall` prose stays).

**Out:**
- Any lifecycle/SPG schema work (parallel grilling session owns it)
- Prompt edits (parallel prompt-hygiene batch owns them)
- Client-side questions about the old type-stripped registration (moot post connector canon)

## Entry surface

Spawned implementer sub-agent (this brief is its prompt), fresh branch off origin/main.

## Files likely to touch

- lib/mcp/coerce.ts and/or lib/mcp/schema-compat.ts
- lib/mcp/patch-cupping.ts (+ its registration in lib/mcp/server.ts if signatures move)
- scripts/ (the `check:mcp` gate)
- docs/product/feedback-backlog.md + docs/sprints/shipped.md (close-out currency)

## Verification plan

- `npm run check:mcp` (tool-count + the new required-axis assertion) green.
- Print/inspect the published JSON schema for patch_green_bean and assert
  `required == ["green_bean_id"]`; spot-check 2 other numField consumers.
- `npx tsc --noEmit` from the main repo dir (or node_modules symlink per CLAUDE.md) before
  push; `npm run build` if API routes were touched.
- Live SPG patch via the deployed Tool (NOTE the MCP catalog-cache rule: a schema change to
  an existing Tool isn't callable until a fresh session re-handshakes - do the live patch
  from a fresh session or verify via a direct server-side call/preview deployment), then
  re-read both rows and confirm `eval_method='Simulated Pourover'`.
- Six-actor trace: Actor 4 (Tool schemas + descriptions updated - patch_cupping's
  description must document the cupping_id path), Actor 5 (CLAUDE.md/SYNC_V2.md only if Tool
  count or auth surface changed - expected no), Actor 2 (log-cupping.md references the
  composite key - confirm no prompt contradicts the new lookup), Actor 6 (no schema/UI
  change expected). Skips explicit in the completion report.

## Open questions

- None blocking. If wrap-reorder (1a) breaks the coercion behavior the preprocess exists for
  (CC-bridge string scalars), fall back to the schema-compat rewrite (1b) - both are
  acceptable; correctness of coercion + published optionality are the two invariants.

## Completion handoff

When merged, write `docs/sprints/mcp-required-axis-fix-completion.md`: (1) restate the plan,
(2) what shipped per scope item incl. divergences + why, (3) PR URL + merge SHA, (4) actual
verification results (the printed `required` arrays, the check:mcp output, the two patched
cupping rows re-read), (5) anything deferred/surprising/new. Then flip backlog #57 + the SPG
data-patch entry `planned → shipped` (move to shipped.md) and `route-feedback` any new
friction.
