-- May 2026 doc cleanup PR — close 2 schema gaps surfaced by the ROASTING.md
-- field-list audit (the "Cuppings sheet columns" reference vs current DB shape).
--
-- Both columns are free-text. They live alongside the existing 6 prose
-- evaluation fields (aroma / flavor / acidity / body / finish / overall) and
-- are surfaced on /green/[id] cupping rows + push_cupping payload.
--
--   - cuppings.sweetness: distinct evaluation axis from `body` and `overall`.
--     The original spreadsheet had it as a separate column; the V2.5 push_cupping
--     spec inherited the 6 prose fields without it. Adding now.
--
--   - cuppings.temperature_behavior: parallel to brews.temperature_evolution.
--     "Direction / when / what changes" prose — captures patterns like
--     "rose emerges below 50°C" / "bitter tail resolves on cooling" that today
--     get spread across the existing prose fields.
--
-- Schema gaps from the same audit that did NOT make this migration (Chris's
-- 2026-05-07 doc-review calls):
--
--   - cuppings.brew_method — REJECTED. Redundant with the existing
--     recipe_variant column (migration 041) for distinguishing the xbloom
--     evaluation gate from any in-the-wild pourover trials.
--   - cuppings.spoon_to_cup_notes / comparative_statements / aromatic_descriptors
--     / body_texture_notes_at_temperature — REJECTED. Some redundant with
--     existing prose fields (aromatic_descriptors ⊂ aroma); others not worth
--     a structured column for the volume Chris cups.
--   - green_beans.image_url — REJECTED. Chris doesn't track lot images
--     anymore.
--   - experiments.best_expression — REJECTED. Captured in narrative on
--     `winner` field; not worth a separate column.
--   - roast_learnings.evaluation_timing — REJECTED. Adjacent to existing
--     rest_behavior; not optimizing rest days at this level.

ALTER TABLE cuppings
  ADD COLUMN sweetness text,
  ADD COLUMN temperature_behavior text;

COMMENT ON COLUMN cuppings.sweetness IS
  'Free-text sweetness evaluation. Distinct axis from body / overall. Spreadsheet-era field reinstated 2026-05-07 in May doc cleanup PR.';
COMMENT ON COLUMN cuppings.temperature_behavior IS
  'Free-text observation of how the cup evolves across the cooling arc — direction / when / what changes. Parallel to brews.temperature_evolution. Added 2026-05-07.';
