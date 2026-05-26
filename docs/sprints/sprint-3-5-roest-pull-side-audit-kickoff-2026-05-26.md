# Sprint 3.5 — Roest pull-side audit + parity cleanup — kickoff brief

**Sub-sprint 1 of 4** in the [Writing-path surface polish series](./writing-path-surface-polish-series-2026-05-26.md). PRODUCT.md § Active Sprints #3. First sprint off the post-roadmap-re-session queue (2026-05-26).

**Series context:** the writing path (claude.ai → MCP → DB) gets a 4-sub-sprint polish pass before the Read-path series starts. This sub-sprint is the longest of the 4 (~1-2 days); the rest are smaller (~1-2h / ~30 min / ~1 day). See the [series umbrella doc](./writing-path-surface-polish-series-2026-05-26.md) for the full sequence + what comes next.

## Goal

Lighter, audit-flavored sweep of the Roest API pull side. Confirm what the API actually exposes vs. what `pull_roest_log` surfaces vs. what `roasts` columns expect. Resolve 6 audit items + 1 new discovery item. Sync the roest-api-worker sub-skill + documentation vocabulary.

Reshape from the original Phase 3 scoping doc per Chris audio 2026-05-26 — some items will resolve to "documented as manual augmentation" rather than "new column," reducing the original ~3-4 day scope to ~1-2 days.

## Sizing

S — ~1-2 days. Single PR (additive migration only if anything ships).

## Scope (in)

**6 audit items + 1 discovery item:**

1. **R57** — Roest `notes` field destination
   - Chris-confirmed at roadmap re-session: Chris uses this field to record the **actual color descriptor** (separate from Agtron numeric reading) after CM200 measurement.
   - **Direction**: route to existing `roasts.color_description` column (the right semantic home) instead of creating a new `roasts.roest_notes` column.
   - Sprint task: verify `roasts.color_description` exists + is the right destination; wire `pull_roest_log.notes` → `push_roast.color_description` mapping.

2. **R59** — `hopper_load_temp` derivation
   - Chris-confirmed instinct: "I'm not sure if hopper_load_temp is an actual queryable thing from the roast log. I don't think it is."
   - Sprint task: verify against Roest API docs / actual `pull_roest_log` response. If present → derive automatically. If absent → path (b), document as required manual augmentation in `push_roast.describe()`.

3. **R60** — TP + yellowing temp pull
   - Chris-comment: "not sure if that's a pullable field in Roest API but yeah worth looking into."
   - Sprint task: investigate. If profile time-series is pullable, compute server-side (TP = local min on bean-temp curve; `yellowing_temp` = curve value at existing `yellowing_time`). If not exposed → document as manual augmentation.

4. **R64** — Inlet curve as-designed vs as-recorded
   - Chris-comment: "worth a quick audit when we do this, I can pull up what I see on my side."
   - Sprint task: identify whether `pull_roest_log.inlet_curve` reflects the as-designed template or as-recorded operator-set values. Chris compares his side's screenshots; if they can drift, add `inlet_curve_source: 'as_designed' | 'as_recorded'` field.

5. **R65** — UTC date drift
   - Chris-decision: **no hotfix carve-out.** "Having high resolution on the roast date/time is not that huge of a deal but if it's a quick fix sure... even if things drift ~1 day that's ok — cupping doesn't happen till ~7 days after."
   - Sprint task: fix if it falls out cheaply during the audit. Return `roast_date` as `{utc, local, tz}` triple with `green_beans.timezone_hint` fallback to `'America/Los_Angeles'`. **NOT blocking** for the sprint to ship.

6. **R66** — `roest_inventory_id` orphan reconciliation
   - Chris-comment: "sure worth a quick audit and I can tell you what I see on my end."
   - Sprint task: confirm Bean 4 reproduction; add warning emission during `push_roast` when `green_bean.roest_inventory_id` is null AND `roest_log_id` is supplied. **No auto-mutate** (per `external_drift_ok_latent_canonical_required` rule).

7. **NEW — RoR tracking field discovery** (from PRODUCT.md § Active Sprints #3.1 additive item)
   - Sprint task: confirm what the Roest API actually exposes around RoR tracking. Candidates: `ror_at_2_30` (drying-handoff check) / `ror_at_4_00` (approach-to-FC) / `ror_at_fc_minus_30s` (cross-lot comparable post-hoc anchor). All three were flagged from the Yunnan livestream (Dongzhe) Δ2.
   - **Outcomes:**
     - If Roest API exposes the data → bundle the three new columns + migration into this sprint as an additive item.
     - If partial data exposed → ship what's exposed; defer rest to Longer Term Items (data-dependent per Chris audio).
     - If nothing exposed → defer the whole entry to Longer Term Items; do NOT ship the schema migration speculatively.

**Cross-check:**

- roest-api-worker sub-skill ([docs/skills/roest-api-worker/SKILL.md](docs/skills/roest-api-worker/SKILL.md)) + cluster docs in-sync vocabulary pass. Anything the audit changes (new fields surfaced, manual augmentations documented, RoR tracking decision) must flow into the sub-skill docs.

## Scope (out)

- Retroactive backfill of historical `roasts` rows from Roest API (would require re-pulling all historical batches; separate concern).
- Roest write-side enhancements (Phase 4 candidate if appetite emerges).
- New MCP Tools beyond `pull_roest_log` + `push_roast` extensions.
- Schema describe audit beyond Phase 3 fields (Sprint 3.6 was killed; remaining describe-string micro-fixes ride in the continuous feedback channel if real).
- `/green/[id]` UI surfacing of any new fields (Read-path 4a Green-bean polish bundle absorbs).
- Sprint 3.4's breach-record substrate (sprint killed; "Predicted vs Actual roast delta surface" Future Direction replaces).

## Files likely to touch

- `lib/mcp/pull-roest-log.ts` — response shape extensions (audit-dependent)
- `lib/mcp/push-roast.ts` — `color_description` mapping (R57); possibly RoR fields (if exposed)
- `lib/roest-api/*.ts` — field mapping for TP / yellowing / RoR / TZ
- `supabase/migrations/0??_*.sql` — only if RoR columns ship; assigned at sprint time
- Tool describe() strings on `push_roast` + `pull_roest_log`
- `docs/skills/roest-api-worker/SKILL.md` — vocabulary sync
- `docs/skills/roest-knowledge/cluster/api/*.md` — read-surface / quirks documentation update if new fields land
- Scoping doc reshape: `docs/features/roest-api-parity-phase-3.md` (or supersede with this kickoff brief if scope diverged enough)

## Verification

- **End-to-end**: re-run a real lot dogfood class (1 bean / 3 batches, ideally late-day to exercise R65) and confirm each acceptance item lands without manual augmentation OR is explicitly documented as required manual augmentation.
- **Chris-side handoff**: Chris pulls his side's screenshots for R64 + R66 comparison at sprint kickoff.
- **`npm run check:mcp`** — exit 0, 35 tools (count unchanged unless RoR migration lands).
- **`npm run check:mcp-bundle`** — clean.
- **`npx tsc --noEmit`** — exit 0 via worktree node_modules symlink.

## Autonomy framing

Most decisions are concrete + Chris-confirmed already (R57 destination locked to `color_description`; R59 direction locked to "path (b) likely"; R65 no carve-out; R66 warn-don't-mutate). Sprint can largely run autonomously per `feedback_autonomy.md`.

**One audio-confirm checkpoint:** RoR tracking field decision (item 7). If the API exposes the data, the decision to add the migration + ship the schema in this sprint vs. punt to a follow-up is interpretive. Surface at the discovery step + AskUserQuestion before committing to migration scope.

Otherwise: implement, verify, push + merge per autonomy rule.

## Open questions to resolve at kickoff

1. Reshape `docs/features/roest-api-parity-phase-3.md` against the new lighter scope, or supersede with this kickoff brief? Recommendation: reshape (the scoping doc has the per-item paths documented; just trim the carve-out language + add the RoR item).
2. R57 destination verification — is `roasts.color_description` the right semantic home? Read the column + check existing data for one or two roasts; confirm or pick a different existing column before any write-path code.
3. Which of the 7 items have any chance of needing a brainstorm vs. ship-and-verify? Recommendation: only RoR (#7) has a real branch point; everything else is mechanical once the API behavior is observed.

## On completion — handoff to Sub-sprint 2

When this sub-sprint ships + merges:

1. Update [writing-path-surface-polish-series-2026-05-26.md](./writing-path-surface-polish-series-2026-05-26.md) sequence table — flip Sub-sprint 1 row to SHIPPED + add PR # + merge commit.
2. Update `shipped.md` with a row for Sprint 3.5.
3. Update PRODUCT.md § Active Sprints #3 Sub-sprint 1 — flip to SHIPPED.
4. Surface the next-up sub-sprint in your closing message: **Sub-sprint 2 — MCP ergonomics polish (Round 15 cluster).** ~1-2h. Full kickoff scope inline in the series umbrella doc (no separate brief needed for the smaller sub-sprints).

## Cross-references

- [writing-path-surface-polish-series-2026-05-26.md](./writing-path-surface-polish-series-2026-05-26.md) — series umbrella with sequencing + next sub-sprint kickoffs
- [PRODUCT.md § Active Sprints #3](../../PRODUCT.md#active-sprints) — canonical scope source
- [docs/features/roest-api-parity-phase-3.md](../features/roest-api-parity-phase-3.md) — original scoping (reshape against this brief)
- [docs/skills/roest-api-worker/SKILL.md](../skills/roest-api-worker/SKILL.md) — sub-skill sync target
- [docs/skills/roest-knowledge/cluster/api/](../skills/roest-knowledge/cluster/api/) — read-surface / write-surface / quirks docs
- `feedback_mcp_continuous_log.md` Outstanding follow-ups — Round 15 cluster (Sub-sprint 2 of this series)
