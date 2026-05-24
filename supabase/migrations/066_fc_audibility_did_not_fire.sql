-- Sprint R Phase 4 Step 4 Group 3 (2026-05-24) — grilling-queue Item 31
--
-- Extend roasts.fc_audibility enum with a 5th value `did_not_fire` for the
-- underdeveloped low-energy-probe case where the bean structurally did NOT
-- reach FC temperature (no event to be audible / silent / ambiguous about).
--
-- Surfaced in Round 14 (2026-05-23) — Bukure v2a topped out at 199.9°C with
-- 0 cracks. claude.ai picked `ambiguous` as least-wrong canonical, but the
-- situation is near-certainty FC didn't happen, not operator-property
-- uncertainty about whether it happened. Mt Elgon batch 199 had the same
-- shape. The semantic gap predicts recurrence on any underdeveloped probe.
--
-- 5-value enum after this migration:
--
--   audible       — multi-snap canonical FC, cell-wall structure intact.
--   subtle        — partial audibility, some snaps detectable but not the
--                   canonical signature; operationally treated as not-audible.
--   silent        — no audibility but FC structurally happened (RoR flattening
--                   + bean temp climbing through FC range); cell-wall structure
--                   modified by heavy ferment / anaerobic processing.
--   ambiguous     — operator-property uncertainty; couldn't tell whether FC
--                   happened, missed it, or it's still upcoming.
--   did_not_fire  — bean did NOT reach FC temperature; FC structurally did not
--                   happen (NOT just inaudible). Distinguished from `silent`
--                   by the lack of an FC event at all rather than the absence
--                   of audibility.
--
-- Four of the five (subtle / silent / ambiguous / did_not_fire) trigger the
-- same downstream protocol stack: bean-temp end_condition_type, drop-ceiling-
-- primary, Agtron + WB→Gnd delta as proxies. The distinction matters for
-- cause attribution and predicting audibility on future similar lots — track
-- it per batch, not just on the lot. See CONTEXT.md § FC audibility state.
--
-- No backfill: historical 135 roasts stay NULL (same disposition as 061).
-- Pre-Round-14 underdeveloped probes that were forced into `ambiguous` may be
-- patched to `did_not_fire` going forward via patch_roast when re-reviewed,
-- but no automated rewrite — operator judgment is the right path.
--
-- Idempotent: re-applying is safe (DROP CONSTRAINT IF EXISTS guard).

ALTER TABLE roasts DROP CONSTRAINT IF EXISTS roasts_fc_audibility_check;

ALTER TABLE roasts ADD CONSTRAINT roasts_fc_audibility_check
  CHECK (fc_audibility IS NULL OR fc_audibility IN ('audible', 'subtle', 'silent', 'ambiguous', 'did_not_fire'));

COMMENT ON COLUMN roasts.fc_audibility IS
  'FC audibility / occurrence state per batch (5-value enum, migrations 061 + 066). audible: multi-snap canonical FC. subtle: partial detection, operationally not-audible. silent: no audibility but FC structurally happened. ambiguous: operator-property uncertainty about whether FC happened. did_not_fire: bean did NOT reach FC temperature; FC structurally did not happen (Round 14 Bukure v2a / Mt Elgon batch 199 case). subtle / silent / ambiguous / did_not_fire all trigger the same downstream protocol stack (bean-temp end condition, drop-ceiling-primary, Agtron + WB→Gnd delta as proxies). See CONTEXT.md § FC audibility state.';
