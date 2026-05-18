-- Schema sprint S1 — 2026-05-18.
-- Snapshot roasts.agtron onto cuppings at insert time, then generate the
-- WB-to-Ground delta from the same row. Solves the Round 3 #6 friction
-- ("querying 'all cuppings with sign-inverted delta' across lots is SQL
-- gymnastics") without requiring a cross-table generated column (Postgres
-- restricts those to immutable expressions on the same row).
--
-- Drift behavior: wb_agtron is captured at push_cupping time from the joined
-- roast row. If roasts.agtron is later patched (rare — Agtron is read once
-- on the day of cupping and rarely revised), the cupping row's wb_agtron
-- stays at its insert-time value. Use patch_cupping(wb_agtron=...) to
-- realign manually. Documented in the patch_cupping description.

ALTER TABLE cuppings
  ADD COLUMN IF NOT EXISTS wb_agtron numeric,
  ADD COLUMN IF NOT EXISTS wb_to_ground_delta numeric
    GENERATED ALWAYS AS (wb_agtron - ground_agtron) STORED;

COMMENT ON COLUMN cuppings.wb_agtron IS
  'Whole-bean Agtron snapshot from roasts.agtron at push_cupping time. Captured by persistCupping via roast_id JOIN. Realign with patch_cupping if the source roast row is later patched.';
COMMENT ON COLUMN cuppings.wb_to_ground_delta IS
  'Generated column: wb_agtron - ground_agtron. V4 primary internal-development signal (target ≤3 points). Negative values indicate ground LIGHTER than whole bean (the structurally anomalous case flagged in Round 3 dogfood — v1b Fazenda Um -0.8).';

-- Backfill existing cuppings from joined roasts. Idempotent — UPDATE is a
-- no-op where wb_agtron already populated.
UPDATE cuppings c
SET wb_agtron = r.agtron
FROM roasts r
WHERE c.roast_id = r.id
  AND c.wb_agtron IS NULL
  AND r.agtron IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cuppings_wb_to_ground_delta
  ON cuppings (wb_to_ground_delta)
  WHERE wb_to_ground_delta IS NOT NULL;

NOTIFY pgrst, 'reload schema';
