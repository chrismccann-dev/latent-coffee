-- Schema sprint S4 — 2026-05-18.
-- Provenance tracking for roast_recipes: design intent captured at design
-- time vs recovered after the fact. Surfaced by Round 5 #5 (Rancho Tio
-- one-shot backfill) — distinguishes pre-rewrite shells (migration 052's
-- 1:1 backfill, no design intent) and STAGE-0 inline-backfilled rows
-- (#174's recovery path) from fresh design-time recipes pushed via
-- push_roast_recipe at V_n design time.
--
-- was_backfilled drives queryability + UI 'backfilled' badge (future).
-- backfill_notes captures provenance prose (when + how + confidence in
-- the recovery). Mirrors the pattern of pairing structural flag with
-- prose context elsewhere (worth_repeating + why_this_roast_won;
-- key_insight_confidence + key_insight).
--
-- Data backfill: mark the 129 migration-052 rows as was_backfilled=true
-- with a canonical note. Identified by: NULL temperature_bezier AND
-- NULL experiment_id (the legacy 1:1 backfill characteristic set —
-- legacy shells have neither beziers nor experiment FK linkage).

ALTER TABLE roast_recipes
  ADD COLUMN IF NOT EXISTS was_backfilled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS backfill_notes text;

COMMENT ON COLUMN roast_recipes.was_backfilled IS
  'TRUE when this recipe row was authored as backfill (design intent recovered after the roast, e.g. via log-cupping.md STAGE 0 inline-backfill or operational backfill prompts). FALSE for recipes pushed at design time via push_roast_recipe before the roast. Drives UI provenance badging.';
COMMENT ON COLUMN roast_recipes.backfill_notes IS
  'Provenance prose for backfilled rows. Standard phrasing: "Recovered from <source> at <event>, <date>". Source examples: prior session chat memory / cupping prose / Roest tablet log. Distinct from notes (general catch-all).';

-- Backfill the 129 migration-052 legacy shells. Idempotent — UPDATE only
-- fires where was_backfilled is still default false (re-run is safe).
UPDATE roast_recipes
SET was_backfilled = true,
    backfill_notes = 'Backfilled 1:1 from existing roast via migration 052 (Sub Pages 6.1, 2026-05-13). No design-intent recovery attempted; beziers + experiment_id + batch_slot remain NULL until enriched.'
WHERE temperature_bezier IS NULL
  AND experiment_id IS NULL
  AND was_backfilled = false;

CREATE INDEX IF NOT EXISTS idx_roast_recipes_was_backfilled
  ON roast_recipes (was_backfilled)
  WHERE was_backfilled = true;

NOTIFY pgrst, 'reload schema';
