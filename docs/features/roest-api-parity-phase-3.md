# Roest API parity Phase 3 — pull-side schema sweep

Sprint 3.5 scoping doc. Output of the Sprint 3.1 architectural-queue brainstorm (2026-05-12).

## Context

Phase 1 + Phase 2 of the Roest API write integration shipped 2026-05-06 (PR #110) — `push_roast_profile` + `push_inventory` + `patch_inventory`. Tool count 29 → 32. The write side is now in steady state.

The pull side — `pull_roest_log` + Roest-to-DB field mapping inside `push_roast` — has accumulated 7 schema gaps from Batch 18 of `feedback_v2_mcp_feedback_log.md` (first heavy roasting dogfood, 16 sessions across 6 beans). None of the 7 re-bit the iterations, but several are silent-data-loss bugs (R65 timezone-drift is the worst). Phase 3 closes pull-side parity with the write side.

This is **symmetric to Phase 1+2** — the same shape of work (Roest field surfacing + DB column additions + MCP Tool schema additions), just on the read path instead of the write path.

## Inputs (7 items + 1 cross-ref)

### #R57 — push_roast missing `notes` / `roest_notes` pass-through

`pull_roest_log` returns Roest's `notes` field (operator narrative — Bean 1 example: `"very light color - whole bean"`). `push_roast` has no field to persist this; Roest comments lost in round-trip.

**Two paths**:
- (a) auto-promote into `color_description` / `roast_curve_notes` if those fields are appropriate
- (b) add a `roest_notes` pass-through field on `push_roast` + `roasts.roest_notes` column

**Recommended**: Path (b). Preserves Roest's narrative as-is without inferring intent. Schema column `roasts.roest_notes text`.

### #R59 — `hopper_load_temp` not in `pull_roest_log`

`hopper_load_temp` is a primary control lever per ROASTING.md (the 125°C alert is machine-set). Theoretically derivable from the profile. Currently Chris adds it manually on every push.

**Two paths**:
- (a) pull from profile if available
- (b) document as required manual augmentation in `push_roast.describe()`

**Recommended**: Path (a) if Roest profile API exposes it; fall back to Path (b) explicit documentation if not. Note Round-5 fix during 2.7.5 already corrected `hopper_load_temp: null` (different signal from Roest's `preheat_temperature`) — Phase 3 should add a structured derivation, not re-introduce drift.

### #R60 — TP + yellowing temp not in `pull_roest_log`

`yellowing_time` is returned, no `yellowing_temp`. TP (turnaround point) fields not at all. Both visible in Roest UI screenshots. Either compute server-side from profile data points OR document the manual augmentation gap.

**Recommended**: Server-side compute. Find the TP from the profile time-series (local min on bean temp curve). Find `yellowing_temp` from the time-series at `yellowing_time`. Both as additive fields on `pull_roest_log`. Existing `roasts` columns: `tp` (text), `tp_time` (text), `yellow` (text), `yellow_time` (text) — verify alignment.

### #R61 — Total cracks count missing from `pull_roest_log`

Roest UI surfaces "Total cracks (7)" / "(3)" / "(0)". Strong audibility / silent-FC signal. Currently lives in prose only in operator notes.

**Recommended**: Add `fc_total_cracks: number | null` to `pull_roest_log` response. Add `roasts.fc_total_cracks integer` column. (NOTE: 2.7.5 retro mentions `fc_total_cracks` already landed via migration 044 — verify; if so, this item may be partially closed and only needs the `pull_roest_log` wiring.)

### #R64 — Inlet curve display string: as-designed vs as-recorded

Bean 6's V1C designed peak-20°C = 228°C at 06:00; Roest pull showed 224°C at 06:00. Worth checking if `pull_roest_log.inlet_curve` reflects as-designed-template OR as-recorded-operator-set. If they can drift, surface explicitly.

**Recommended**: Add `inlet_curve_source: 'as_designed' | 'as_recorded'` field to `pull_roest_log` if the Roest API distinguishes them. If the API only returns one, document which in `describe()`.

### #R65 — **HIGH IMPACT**: Roest API returns UTC dates, silently miscoding late-day batches

Bean 4: `pull_roest_log` returned `2026-05-05` for all three batches; Chris's screenshots show 5/4/2026 5:00 PM local. Roest API returning UTC. Currently a strict-trust path leads to the wrong date silently.

**Recommended**: Include both UTC + local-converted in `pull_roest_log.roast_date` response. Surface explicitly. Honor TZ hint from `green_beans.timezone_hint` OR user profile OR a server-side default. This is a real bug — fires on every roast logged when the batch happens late-day (any roast started after ~5 PM local in PT timezone).

### #R66 — `roest_inventory_id` orphan reconciliation

Bean 4 was pushed before Roest ingested it; `green_bean.roest_inventory_id = null`. After the roast, Roest had it as 9372 but the FK was still null until Chris ran `patch_green_bean` manually.

**Two paths**:
- (a) when `pull_roest_log` returns and matches existing green_bean by name, auto-backfill the FK if null
- (b) emit a warning during `push_roast` when `roest_log_id` is supplied AND parent `green_bean.roest_inventory_id` is null

**Recommended**: Path (b) is lower-risk (warn rather than auto-mutate) and aligns with the `external_drift_ok_latent_canonical_required` standing rule (don't auto-write canonical FK on inferred match). Path (a) is a future enhancement if Path (b)'s warning bites repeatedly.

### Cross-ref — Sprint 3.4 breach record

Sprint 3.4 (per-batch failure_boundary breach detection) lands BEFORE this sprint per the build order. The breach-detection schema decisions need to land before pull-side schema additions in case `pull_roest_log` should emit breach flags at `push_roast` time. Re-verify the cross-ref at sprint kickoff.

## Scope

**In scope:**
- 7 pull-side schema additions + `roasts` column additions where applicable
- `pull_roest_log` Tool response shape extensions
- Schema describe() updates for each new field
- Migration adding new `roasts` columns (additive only)
- Roest field-mapping verification (already verified during 2.7.5 for `hopper_load_temp`)
- Cross-ref handoff from Sprint 3.4 breach record

**Out of scope:**
- Retroactive backfill of existing `roasts` rows from Roest API (would require re-pulling all historical batches — separate concern, not Phase 3)
- Roest write-side enhancements (Phase 4 candidate if appetite emerges)
- New MCP Tools beyond `pull_roest_log` extensions
- Schema describe audit beyond Phase 3 fields (#R45 / R48 / R51 / R69 / R86 are Sprint 3.6 scope)
- `/green/[id]` UI surfacing of new fields (Sprint 3.2 surfaces provenance; Phase 3 columns surface in `/green/[id]` design refresh when Chris owns that)

## Open questions for sprint kickoff

1. **Schema-additive vs schema-reshape on `pull_roest_log`**: All 7 fixes are additive. Confirm no breaking changes to the existing response shape (every field is optional, every consumer can ignore unknowns).
2. **Breach-record cross-ref**: Does the breach-record JSONB shape from Sprint 3.4 require any pull-side fields beyond what's already scoped here? Re-verify after 3.4 ships.
3. **TZ hint location**: `green_beans.timezone_hint`, `user_profiles.timezone`, server-side default, or all three? Recommend: green_bean column with user-profile fallback. New column: `green_beans.timezone_hint text` default `'America/Los_Angeles'` (Chris's PT default).
4. **`fc_total_cracks` already shipped?**: 2.7.5 retro mentions migration 044 added this column. Verify and reduce R61 to "wire `pull_roest_log` to the column" only.
5. **Migration drift mitigation alignment**: Sprint 3.2 ships the `npm run migrations:check` gate before this sprint runs. Pull-side migration here can be the first to use the new gate as a forcing function.

## Acceptance criteria

Per-item:

- **R57**: `roasts.roest_notes` column exists; `push_roast` accepts `roest_notes: string?`; `pull_roest_log` echoes it on retrieval.
- **R59**: `pull_roest_log.hopper_load_temp` is populated when Roest API exposes it, else explicit `describe()` note.
- **R60**: `pull_roest_log.tp_temp` + `pull_roest_log.yellowing_temp` populated from profile time-series.
- **R61**: `pull_roest_log.fc_total_cracks` populated from Roest UI count.
- **R64**: `pull_roest_log.inlet_curve_source: 'as_designed' | 'as_recorded'` populated when distinguishable.
- **R65**: `pull_roest_log.roast_date` returns `{utc: string, local: string, tz: string}` triple (or equivalent shape). Bean 4-class late-day cases pass round-trip without date drift.
- **R66**: `push_roast` emits a warning array entry when `green_bean.roest_inventory_id` is null AND `roest_log_id` is supplied.

End-to-end: re-run a Batch-18-class dogfood (a 1-bean 3-batch session, ideally late-day) and verify all 7 items behave per acceptance criteria without manual augmentation.

## Migration plan

Single additive migration (target: `supabase/migrations/052_roest_api_parity_phase_3.sql`):

```sql
-- Additive columns only; no destructive changes.
ALTER TABLE roasts ADD COLUMN IF NOT EXISTS roest_notes text;
ALTER TABLE green_beans ADD COLUMN IF NOT EXISTS timezone_hint text DEFAULT 'America/Los_Angeles';
-- fc_total_cracks already exists per migration 044 — verify before re-adding.
-- Other fields (TP temp / yellowing temp / inlet curve source) are pull_roest_log response extensions, no DB changes.
```

Per the migration-drift mitigation rule (2.7.5 retro standing rule), this migration MUST land in Supabase SQL Editor same-day as the PR, with a corresponding `migrations:check` pass.

## Sizing

~3-4 days. Largest sprint in the 3.x queue.

- Day 1: Roest API field mapping verification (TP / yellowing temp / inlet curve source / `hopper_load_temp` derivation)
- Day 2: Migration + `push_roast` + `pull_roest_log` Tool changes
- Day 3: TZ handling for R65 + warning emission for R66
- Day 4: End-to-end dogfood + acceptance verification

## Build order placement

Sprint 3.5 (4th in the 6-sprint queue). After Sprint 3.4 (breach record); before Sprint 3.6 (doc reconciliation).

## Files likely modified

- `supabase/migrations/052_*.sql` — new
- `lib/mcp/push-roast.ts` — `roest_notes` field
- `lib/mcp/pull-roest-log.ts` — 6 response-shape extensions
- `lib/roest-api/*.ts` — field mapping for TZ / TP / yellowing / cracks / inlet source / notes
- Tool describe() strings on `push_roast` + `pull_roest_log`
- Verification: end-to-end dogfood
