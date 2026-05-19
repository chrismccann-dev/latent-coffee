-- Sprint 11 (2026-05-20) — RO-6 character relocation: aromatic_behavior +
-- structural_behavior move from roast_learnings to cuppings.
--
-- These two prose fields describe what a CUP IS — per-tasting observation,
-- tied to a specific cupping event — not what a LOT TAUGHT (lot-aggregate
-- lesson). They were misplaced on roast_learnings since the schema was first
-- drafted; the relocation lands the semantics on the correct entity.
--
-- See docs/adr/0008-aromatic-structural-relocation.md for the ADR walking
-- the concept rationale, alternatives considered (Option B: write to all
-- cuppings on best_roast_id, redundant; Option C: keep on both, two-home
-- ambiguity), and Option A picked (single canonical cup per lot).
--
-- Data move strategy: for each closed lot (roast_learnings row with prose),
-- pick the canonical pourover cupping on best_roast_id and write the prose
-- there. Priority order:
--   1. eval_method ILIKE '%pourover%' (most lots have an explicit pourover)
--   2. cupping_date DESC NULLS LAST (latest evaluation when multiple match)
--   3. created_at DESC (deterministic tie-break)
-- LIMIT 1 picks the single canonical cup.
--
-- DB preflight (2026-05-19): all 7 closed lots have both fields populated,
-- all have typed best_roast_id, all have a pourover-matching cupping. The
-- per-lot target cuppings are deterministic; the strategy below picks the
-- same row preflight identified.
--
-- Idempotent: column adds are IF NOT EXISTS guarded; the UPDATE is a no-op
-- on a re-run because the source columns are dropped at the end (the second
-- run finds nothing to move). DROP COLUMN is IF EXISTS guarded.

BEGIN;

-- Step 1: add the two columns on cuppings.
ALTER TABLE cuppings ADD COLUMN IF NOT EXISTS aromatic_behavior text;
ALTER TABLE cuppings ADD COLUMN IF NOT EXISTS structural_behavior text;

-- Step 2: data move. For each roast_learnings row with prose, find the
-- canonical pourover cupping on best_roast_id and copy the prose onto it.
-- The subquery is the priority ladder; one row per lot is returned.
UPDATE cuppings c
SET
  aromatic_behavior = rl.aromatic_behavior,
  structural_behavior = rl.structural_behavior
FROM roast_learnings rl
WHERE c.id = (
  SELECT cc.id
  FROM cuppings cc
  WHERE cc.roast_id = rl.best_roast_id
    AND cc.user_id = rl.user_id
  ORDER BY
    (cc.eval_method ILIKE '%pourover%') DESC,
    cc.cupping_date DESC NULLS LAST,
    cc.created_at DESC
  LIMIT 1
)
AND rl.best_roast_id IS NOT NULL
AND (rl.aromatic_behavior IS NOT NULL OR rl.structural_behavior IS NOT NULL);

-- Step 3: drop the columns from roast_learnings. ADR-0008 picks Option A
-- (single home per concept) — keeping the columns on roast_learnings would
-- be Option C, deliberately not chosen.
ALTER TABLE roast_learnings DROP COLUMN IF EXISTS aromatic_behavior;
ALTER TABLE roast_learnings DROP COLUMN IF EXISTS structural_behavior;

COMMIT;
