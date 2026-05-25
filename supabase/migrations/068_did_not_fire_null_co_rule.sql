-- Sprint R Phase 4 Step 4 Group 4 (2026-05-24) — grilling-queue Item 32
--
-- Enforce the `did_not_fire` triple-null co-rule at the DB level.
--
-- Today the rule "when fc_audibility = 'did_not_fire', fc_start / fc_temp /
-- dev_time_s MUST be null" lives in three places: CONTEXT.md § FC audibility
-- state, the Tool description for fc_audibility on push-roast.ts / patch-
-- roast.ts, and the prose convention in docs/prompts/log-roast.md +
-- one-shot.md. None of these are programmatic — Zod schemas don't have a
-- cross-field refinement, and the DB has no CHECK constraint. A row with
-- fc_audibility='did_not_fire' AND fc_start='5:27' would succeed everywhere.
--
-- This migration adds the missing belt-and-suspenders guard. The CHECK
-- constraint mirrors the Roest machine's own behavior on no-FC batches —
-- when the auto-detect never fires AND the operator never manually marks
-- (because neither heard cracks), the Roest UI displays FC / cracks count /
-- dev time / dev % all as N/A, and the phase breakdown shows only drying +
-- Maillard with no development segment. The DB constraint formalizes the
-- same invariant: no FC event ⇒ no FC-anchored fields.
--
-- Pre-flight: at the time of writing (2026-05-24), zero rows have
-- fc_audibility='did_not_fire' — the underdeveloped probes that surfaced
-- the case (Bukure v2a, Mt Elgon batch 199) were pushed as `ambiguous`
-- pre-066 and not yet patched per the "no automated rewrite, operator-
-- judgment" disposition in migration 066. The DO $$ block below asserts
-- this before the constraint applies, so future operator patch_roast calls
-- that set did_not_fire while leaving fc_start populated would be blocked
-- by the DB rather than silently land an inconsistent row.
--
-- Idempotent: re-applying is safe (DROP CONSTRAINT IF EXISTS guard).

DO $$
DECLARE
  violation_count integer;
BEGIN
  SELECT COUNT(*) INTO violation_count
  FROM roasts
  WHERE fc_audibility = 'did_not_fire'
    AND (fc_start IS NOT NULL OR fc_temp IS NOT NULL OR dev_time_s IS NOT NULL);

  IF violation_count > 0 THEN
    RAISE EXCEPTION
      'Migration 068 pre-flight: % roast(s) violate the did_not_fire triple-null co-rule. Fix data before applying — set fc_start / fc_temp / dev_time_s to NULL on these rows, or change fc_audibility to the correct enum value (silent / ambiguous / subtle).',
      violation_count;
  END IF;
END $$;

ALTER TABLE roasts DROP CONSTRAINT IF EXISTS roasts_did_not_fire_nulls_check;

ALTER TABLE roasts ADD CONSTRAINT roasts_did_not_fire_nulls_check
  CHECK (
    fc_audibility IS NULL
    OR fc_audibility != 'did_not_fire'
    OR (fc_start IS NULL AND fc_temp IS NULL AND dev_time_s IS NULL)
  );

COMMENT ON COLUMN roasts.fc_audibility IS
  'FC audibility / occurrence state per batch (5-value enum, migrations 061 + 066). audible: multi-snap canonical FC. subtle: partial detection, operationally not-audible. silent: no audibility but FC structurally happened. ambiguous: operator-property uncertainty about whether FC happened. did_not_fire: bean did NOT reach FC temperature; FC structurally did not happen (Round 14 Bukure v2a / Mt Elgon batch 199 case). subtle / silent / ambiguous / did_not_fire all trigger the same downstream protocol stack (bean-temp end condition, drop-ceiling-primary, Agtron + WB→Gnd delta as proxies). Triple-null co-rule (migration 068): when fc_audibility=did_not_fire, fc_start / fc_temp / dev_time_s MUST be null (no event to anchor to) — enforced by roasts_did_not_fire_nulls_check CHECK constraint. See CONTEXT.md § FC audibility state.';
