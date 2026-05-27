# Roest API parity Phase 3 — pull-side audit + /datapoints/ unlock

**Status**: SHIPPED via Sprint 3.5 (2026-05-26). Sub-sprint 1 of the [Writing-path surface polish series](../sprints/writing-path-surface-polish-series-2026-05-26.md).

Scoping doc reshaped at sprint ship time to reflect the actual shipped scope. Pre-audit scope was 7 items + cross-ref to Sprint 3.4 breach-record (the latter was killed during the Sprint R roadmap re-session). Post-audit scope was 6 items + 1 new discovery (RoR tracking fields). Mid-sprint, the audit surfaced a major Roest API endpoint that hadn't been documented anywhere in the Roest Knowledge cluster: `/datapoints/?log={log_id}` exposes the raw bt / inlet_temp / drum_temp time-series. That unlock collapsed 3 of the 6 audit items from "documented as manual augmentation" into "server-side computable" — see § Discovery below.

## Context

Phase 1 + Phase 2 of the Roest API write integration shipped 2026-05-06 (PR #110) — `push_roast_profile` + `push_inventory` + `patch_inventory`. Tool count 29 → 32. The write side reached steady state.

The pull side — `pull_roest_log` + Roest-to-DB field mapping inside `push_roast` — had accumulated 7 schema gaps from Batch 18 of `feedback_v2_mcp_feedback_log.md` (first heavy roasting dogfood, 16 sessions across 6 beans). None of the 7 re-bit the iterations, but several were silent-data-loss bugs (R65 timezone-drift the worst). Sprint 3.5 closed pull-side parity.

## Discovery (mid-sprint, 2026-05-26)

Fetched the Roest OpenAPI schema from `https://raw.githubusercontent.com/Kaffebrenner/roest-api-example/main/schema.yml` for the "quick check" Chris asked for on RoR availability. Found `/datapoints/?log={log_id}` — paginated endpoint returning `Datapoint` rows with:

- `data_type` enum: `0` = event marker, `1` = sensor reading
- `event_type` enum 0-8 including **auto-detected** FC=6 / Dryend=7 / Drop=8 (richer than `RoestLog.events[]`)
- `bt` (bean temp), `et`, `inlet_temp`, `drum_temp`, plus RTD/thermocouple channels, `target`, `fan`, `heat`, `rpm`
- `msec` offset since charge

This is the time-series the Roest UI graphs but `/logs/{id}/` summary doesn't carry. **Surfaced none of the prior Sprint 2.5 / 2.7.5 / Phase 1+2 audit work** because the read-surface cluster doc was operator-stubbed (placeholder) and the sprint dogfood paths didn't probe the OpenAPI schema. Standing risk for future audits — pulling the OpenAPI schema cheap-and-early should be table stakes for any API-coverage audit.

The Sprint 3.5 scope expanded from "describe wording fixes" to "ship server-side compute for everything /datapoints/ unlocks" per Chris audio-confirm at scope discovery.

## Shipped — per-item

### R57 — Roest UI Notes routing → `color_description` ✓ SHIPPED

**Before**: `pull_roest_log.roest_notes` populated from `log.first_comment.comment`; `push_roast.roest_notes` wrote to `roasts.roest_notes` column (added migration 044).

**After**: `pull_roest_log` payload field renamed to `color_description`. `push_roast.roest_notes` deprecated but still accepts input for back-compat. Migration 070 backfills historical `roasts.roest_notes` data into `color_description` where the latter was NULL. `roasts.roest_notes` column kept in place; future cleanup sprint may drop it.

**Why**: Chris uses the Roest Notes field to record the actual color descriptor after CM200 measurement. Routing it to `color_description` matches the semantic; the prior `roest_notes` pass-through treated it as generic operator prose.

### R59 — `hopper_load_temp` not exposed by Roest API ✓ DOCUMENTED

Confirmed via OpenAPI audit: `hopper_load_temp` is not on `/logs/{id}/`, not on `/profiles/{id}/`, not derivable from `/datapoints/` (the bt series starts at charge, not hopper-load). `RoestProfile.preheat_temperature` is the air-preheat target (~210°C), a DIFFERENT signal. `pull_roest_log` returns null with an inference hint; `pull_roest_log` Tool describe + `push_roast.hopper_load_temp` describe now state explicitly that caller must augment from session memory (V4 standard 125°C).

### R60 — TP + `yellowing_temp` server-side compute ✓ SHIPPED

**Before**: documented as required manual augmentation (the assumption was that the Roest API didn't expose temperature time-series).

**After**: `pull_roest_log` computes both fields from `/datapoints/` bt curve. `tp_time` + `tp_temp` = (msec, bt) of the local min within the first half of the roast (cap: 180s). `yellowing_temp` = bt interpolated at `log.dryend_event_msec`. Populates the existing `roasts.tp_time` + `roasts.tp_temp` + `roasts.yellowing_temp` columns (added migration 039, NULL-only until now).

### R64 — As-recorded inlet curve ✓ SHIPPED

**Before**: `pull_roest_log.inlet_curve` sourced from `RoestProfile.temperature_bezier` (as-designed template); describe noted that mid-roast operator overrides weren't exposed.

**After**: new `inlet_curve_recorded` field on the payload + new `roasts.inlet_curve_recorded` column (migration 070). Sampled from `/datapoints/` `inlet_temp` series at the same msec keys as the as-designed bezier so the two display strings line up for visual diffing. Falls back to 30-second uniform sampling when no designed bezier is supplied.

**Verification (2026-05-26)**: Rwanda Nova Bukure V2 batches 193/194/195 (log_ids 3750995 / 3750998 / 3751001) pulled via `pull_roest_log` and cross-checked against connect.roestcoffee.com Log screenshots. All discrete anchors (TP / yellowing / FC / drop / charge / dev / RoR) reconcile within Roest's own rounding. `inlet_curve_recorded` matches the recorded green-line inlet curve on all three screenshots. `color_description` matches Roest UI Notes verbatim ("light color - whole bean") on all three — confirms R57 wiring works end-to-end. Two real sampling tells surfaced (both artifacts, not bugs) — documented in [docs/skills/roest-knowledge/cluster/api/read-surface.md § Sampling tells](../skills/roest-knowledge/cluster/api/read-surface.md). The as-designed `inlet_curve` leg was not separately verified against the Roest Profiles template view — skipped intentionally because the bezier is sourced directly from `RoestProfile.temperature_bezier` (not re-derived from /datapoints/) so there is no sampling path that could drift. **Practice note discovered during verification**: Chris has never manually overridden the inlet curve mid-roast; the divergence-detection code path between `inlet_curve` and `inlet_curve_recorded` exists as a tripwire but will not fire on Chris's data. See [project-roasting-intervention-surface memory](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_roasting_intervention_surface.md) for the standing fact.

### R65 — UTC date drift ✓ ALREADY MITIGATED (pre-sprint)

`pull_roest_log` already converted UTC to local timezone via `ROEST_USER_TIMEZONE` env var (added pre-Sprint-3.5). Default `'America/Los_Angeles'` matches Chris's PT. `.env.local` does not pin the env var; the default fires + an inference hint surfaces. No action needed.

### R66 — Orphan reconciliation warning ✓ ALREADY SHIPPED (pre-sprint)

`persistRoast` at [lib/roast-import.ts:493-512](../../lib/roast-import.ts) emits a warning when `roest_log_id` is supplied AND parent `green_bean.roest_inventory_id` is NULL. No auto-mutate per the `external_drift_ok_latent_canonical_required` standing rule. No code change required this sprint.

### R61 — `fc_total_cracks` ✓ ALREADY SHIPPED (Phase 2 / migration 044)

`roasts.fc_total_cracks` column + `push_roast.fc_total_cracks` input shipped Phase 2. Roest API doesn't expose the count (visible in Roest UI only); operator-augmented.

### NEW — RoR tracking fields ✓ SHIPPED

Three explicit `roasts` columns via migration 070:

- `ror_at_2_30` — drying-handoff check, 30s window centered on 2:30
- `ror_at_4_00` — approach-to-FC check, 30s window centered on 4:00
- `ror_at_fc_minus_30s` — cross-lot comparable anchor, 30s window centered on FC-30s

Per Chris audio-confirm 2026-05-26: 3 explicit columns rather than a `rate_of_rise jsonb` (queryable directly without jsonb extraction; matches the Yunnan livestream Δ2 framing). All computed server-side from `/datapoints/` bt curve. NULL when the window straddles charge / runs past drop / FC isn't marked.

## Out of scope (intentional)

- Retroactive backfill of historical `roasts` rows from Roest API (would require re-pulling all historical batches; net-new forward only)
- Roest write-side enhancements (Phase 4 candidate if appetite emerges)
- New MCP Tools beyond `pull_roest_log` + `push_roast` extensions (Tool count 35 unchanged)
- Schema describe audit beyond Phase 3 fields
- `/green/[id]` UI surfacing of new fields (Read-path Sub-sprint 4a Green-bean polish absorbs)
- Sprint 3.4's breach-record substrate (sprint killed)

## Files modified

- `supabase/migrations/070_roest_datapoints_parity.sql` — new
- `lib/roest-client.ts` — `RoestDatapoint` type, `getRoestDatapoints` fetcher, time-series compute helpers, `NormalizedRoastPayload` 7 new fields, `roestLogToPushRoastPayload` rewrite to consume datapoints
- `lib/mcp/pull-roest-log.ts` — Tool describe rewrite + datapoints fetch wiring
- `lib/mcp/push-roast.ts` — 4 new Zod fields (`inlet_curve_recorded` + 3 RoR), `roest_notes` deprecation describe, `color_description` describe expansion, top-level describe rewrite
- `lib/roast-import.ts` — `RoastPayload` interface + insert + patch whitelist
- `docs/skills/roest-knowledge/cluster/api/read-surface.md` — full rewrite documenting `/datapoints/` shape + Sprint 3.5 server-side compute + R57 / R59 / R65 / R66 audit findings

## Verification

- `npx tsc --noEmit` exit 0 ✓
- `npm run check:mcp` exit 0, 35 tools unchanged ✓
- `npm run check:mcp-bundle` clean (no DOC_FILES additions) ✓
- `npm run check:migrations` — environment-limited (schema not exposed locally); manual SQL-Editor apply required for migration 070
- End-to-end verification gated on Chris applying migration 070 + running a real-lot dogfood pull. R64 verification gated on screenshot comparison.

## Sizing

Original kickoff sizing: ~1-2 days. Actual: ~3-4h (single session) — discovery shifted scope from "describe wording fixes" to "server-side compute" but the helpers were small and the migration was additive-only.

## Lessons learned

- **Pull the OpenAPI schema cheap-and-early on any API-coverage audit**. The /datapoints/ endpoint had been there the whole time; we documented its absence twice (Sprint 2.5 + Phase 2) without ever fetching the schema. Standing tripwire for future Roest audits — add to roest-api-worker SKILL.md if a second instance lands.
- **The original Phase 3 scoping doc held up well under the lighter scope** — even after the kickoff brief reshaped 4 of 7 items, the doc structure still mapped cleanly. Per-item recommendation + acceptance criteria scaffolding paid off.
- **Audit items that report as ALREADY-DONE during pre-flight** (R61 + R65 + R66 here) deserve cross-checking against feedback log Round entries — Round 14 / Round 15 / etc. — to make sure the framing in the audit doc didn't lag the actual code. Saved ~half-day on this sprint.
