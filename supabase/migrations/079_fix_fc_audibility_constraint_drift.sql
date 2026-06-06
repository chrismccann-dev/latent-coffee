-- Round 21 (2026-06-05) — feedback_mcp_continuous_log #35 (iteration-blocker)
--
-- Repair a migration-drift gap: the `roasts_fc_audibility_check` CHECK
-- constraint in PROD rejects `fc_audibility = 'did_not_fire'` even though
-- migration 066 (2026-05-24) extended the enum to include it, the push_roast /
-- patch_roast Tool schemas advertise it, and the prompts (log-roast.md /
-- one-shot.md / CONTEXT-roasting.md) all treat it as valid.
--
-- Surfaced Round 21 from a Bukure close-lot session: patching v2a (Batch 193,
-- roast_id f4ef106f) from 'ambiguous' -> 'did_not_fire' was rejected by the DB
-- with `roasts_fc_audibility_check`. The error names the 066 enum constraint
-- (NOT the 068 triple-null constraint `roasts_did_not_fire_nulls_check`), so
-- the 066 constraint physically does not include 'did_not_fire' in PROD —
-- migration 066 was registered as applied (seeded into public.applied_migrations
-- by migration 076) but the ALTER TABLE was never actually run in the SQL
-- Editor. `check:migrations` could not catch this: it diffs files against the
-- applied_migrations registry, and 076's seed asserts 066 applied, masking the
-- physically-unrun constraint.
--
-- This migration re-asserts BOTH 2026-05-24 constraints idempotently (the 066
-- enum constraint and the 068 triple-null co-rule). Safe to run whether or not
-- 066/068 physically landed: every statement is DROP CONSTRAINT IF EXISTS + ADD.
-- The 068 pre-flight DO block is re-included as a belt-and-suspenders guard.
--
-- After this lands, the deferred data-patch can proceed: Batch 193
-- (roast_id f4ef106f) 'ambiguous' -> 'did_not_fire' via patch_roast, provided
-- fc_start / fc_temp / dev_time_s are NULL on that row (068 co-rule).
--
-- Idempotent: re-applying is safe.

-- 1. Re-assert the 066 enum constraint (the drifted one).
ALTER TABLE roasts DROP CONSTRAINT IF EXISTS roasts_fc_audibility_check;

ALTER TABLE roasts ADD CONSTRAINT roasts_fc_audibility_check
  CHECK (fc_audibility IS NULL OR fc_audibility IN ('audible', 'subtle', 'silent', 'ambiguous', 'did_not_fire'));

-- 2. Re-assert the 068 triple-null co-rule (belt-and-suspenders; same sprint as
--    066, so if 066 never ran, 068 may not have either).
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
      'Migration 079 pre-flight: % roast(s) violate the did_not_fire triple-null co-rule. Fix data before applying — set fc_start / fc_temp / dev_time_s to NULL on these rows, or change fc_audibility to the correct enum value (silent / ambiguous / subtle).',
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
  'FC audibility / occurrence state per batch (5-value enum, migrations 061 + 066, constraint re-asserted 079 after PROD drift). audible: multi-snap canonical FC. subtle: partial detection, operationally not-audible. silent: no audibility but FC structurally happened. ambiguous: operator-property uncertainty about whether FC happened. did_not_fire: bean did NOT reach FC temperature; FC structurally did not happen (Round 14 Bukure v2a / Mt Elgon batch 199 case). subtle / silent / ambiguous / did_not_fire all trigger the same downstream protocol stack (bean-temp end condition, drop-ceiling-primary, Agtron + WB→Gnd delta as proxies). Triple-null co-rule (migration 068): when fc_audibility=did_not_fire, fc_start / fc_temp / dev_time_s MUST be null (no event to anchor to) — enforced by roasts_did_not_fire_nulls_check CHECK constraint. See CONTEXT-roasting.md § FC audibility state.';

-- Self-register per the >= 076 convention (CLAUDE.md build-kickoff migration gate).
INSERT INTO public.applied_migrations (filename) VALUES ('079_fix_fc_audibility_constraint_drift.sql') ON CONFLICT (filename) DO NOTHING;
